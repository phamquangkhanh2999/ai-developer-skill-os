#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';
import {
  generateManifest,
  planManagedMigration,
  MANAGED_MANIFEST_FILE,
  computeSha256,
  isSourceOnlyFile
} from '../tooling/managed-files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.resolve(rootDir, '.agents');
const packageJsonPath = path.resolve(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;
const cwd = process.cwd();
const homeDir = process.env.HOME || os.homedir();

// Version marker file written after every successful install
const VERSION_FILE = '.ai-skill-os-version';
const PLUGIN_DIR_NAME = 'qk-skill-os';

const CORE_SKILLS = [
  'qk-feature-delivery',
  'qk-bug-resolution',
  'qk-code-review',
  'qk-code-cleaner',
  'qk-devops-release'
];

// ─── Supported Antigravity target ──────────────────────────────────────────────
const IDE_CONFIG = {
  antigravity: {
    label: 'Antigravity (Google Gemini)',
    localDir: path.join(cwd, '.agents'),
    globalDir: path.join(homeDir, '.gemini', 'config'),
    note: 'Global: ~/.gemini/config — applies to all projects on this machine',
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function copyRecursiveSync(src, dest, baseSrc = src) {
  if (!fs.existsSync(src)) return;
  const relFromSource = path.relative(baseSrc, src).replace(/\\/g, '/');
  if (relFromSource && path.resolve(baseSrc) === path.resolve(sourceDir) && isSourceOnlyFile(relFromSource)) {
    return;
  }
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      const childSrc = path.join(src, child);
      const childRel = path.relative(baseSrc, childSrc).replace(/\\/g, '/');
      if (path.resolve(baseSrc) === path.resolve(sourceDir) && isSourceOnlyFile(childRel)) {
        continue;
      }
      copyRecursiveSync(childSrc, path.join(dest, child), baseSrc);
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const full = path.join(dir, entry.name);
      removeEmptyDirs(full);
      try {
        if (fs.readdirSync(full).length === 0) {
          fs.rmdirSync(full);
        }
      } catch {}
    }
  }
}

function collectInstalledFiles(dir, baseDir = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectInstalledFiles(full, baseDir));
    } else {
      results.push(path.relative(baseDir, full).replace(/\\/g, '/'));
    }
  }
  return results;
}

/** Read installed version from marker file or plugin.json. Returns null if not installed. */
function getInstalledVersion(targetDir) {
  const markerPath = path.join(targetDir, VERSION_FILE);
  if (fs.existsSync(markerPath)) {
    try {
      return fs.readFileSync(markerPath, 'utf8').split(/\r?\n/)[0].trim();
    } catch {
      return null;
    }
  }
  const pluginJsonPath = path.join(targetDir, 'plugin.json');
  if (fs.existsSync(pluginJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8')).version || null;
    } catch {
      return null;
    }
  }
  return null;
}

/** Write version marker after successful install. */
function writeVersionMarker(targetDir) {
  fs.writeFileSync(
    path.join(targetDir, VERSION_FILE),
    `${version}\nInstalled: ${new Date().toISOString()}\n`,
    'utf8'
  );
}

/** Backup before overlaying managed files; retain user profile and custom agents. */
function backupExistingInstall(targetDir) {
  if (!fs.existsSync(targetDir)) return null;
  const backupDir = `${targetDir}.backup-${Date.now()}`;
  fs.cpSync(targetDir, backupDir, { recursive: true, errorOnExist: true, force: false });
  console.log(`  Backup: ${backupDir}`);
  return backupDir;
}

/** Prompt user yes/no. Resolves true for yes. */
function confirm(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (ans) => resolve(['y', 'yes', ''].includes(ans.trim().toLowerCase())));
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { ide: null, scope: null, mode: null };
  for (const arg of args) {
    if (arg.startsWith('--ide=')) result.ide = arg.split('=')[1];
    else if (arg.startsWith('--scope=')) result.scope = arg.split('=')[1];
    else if (arg.startsWith('--mode=')) result.mode = arg.split('=')[1];
  }
  return result;
}

// ─── Post-install handlers ────────────────────────────────────────────────────

/**
 * Antigravity global/plugin install: rewrite relative .agents/X paths → absolute paths.
 * Note: .agents/DEV_PROFILE.md is intentionally kept workspace-relative so each project
 * can supply its own stack profile without duplicating global rules.
 */
function rewriteAbsolutePaths(targetDir, skippedRelativePaths = [], fileList = null) {
  const targetPosix = targetDir.replace(/\\/g, '/');
  const skippedSet = new Set(skippedRelativePaths.map(p => p.replace(/\\/g, '/')));
  const DIRS_TO_REWRITE = [
    'skills',
    'registry',
    'rules',
    'knowledge',
    'docs',
    'blueprints',
    'references',
    'hooks',
    'assets'
  ];
  const FILES_TO_REWRITE = [
    'AGENTS.md',
    'skill-aliases.yml',
    'hooks.json',
    'skills.json'
  ];
  const managedFiles = fileList || collectInstalledFiles(targetDir);

  for (const rel of managedFiles) {
    const normalizedRel = rel.replace(/\\/g, '/');
    if (skippedSet.has(normalizedRel)) continue;
    const fullPath = path.join(targetDir, normalizedRel);
    if (!fs.existsSync(fullPath)) continue;
    if (!/\.(md|yml|yaml|json)$/.test(fullPath)) continue;
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    for (const d of DIRS_TO_REWRITE) {
      const re = new RegExp(`\\.agents/${d}`, 'g');
      if (re.test(content)) {
        content = content.replace(re, () => `${targetPosix}/${d}`);
        changed = true;
      }
    }
    for (const f of FILES_TO_REWRITE) {
      const escaped = f.replace(/\./g, '\\.');
      const re = new RegExp(`\\.agents/${escaped}`, 'g');
      if (re.test(content)) {
        content = content.replace(re, () => `${targetPosix}/${f}`);
        changed = true;
      }
    }
    if (changed) fs.writeFileSync(fullPath, content, 'utf8');
  }
  console.log('  ✅ Rewrote .agents/* references → absolute paths for Antigravity global/plugin mode');
}

// ─── Thin Profile Install (--scope=profile) ──────────────────────────────────

async function runProfileInstall(config, rl) {
  const targetDir = config.localDir;
  if (path.resolve(targetDir) === path.resolve(sourceDir)) {
    throw new Error('Install into a different workspace; refusing to overwrite package source.');
  }

  console.log(`\n🚀 AI Developer Skill OS v${version}`);
  console.log(`   IDE:   ${config.label}`);
  console.log('   Scope: Thin Profile (DEV_PROFILE.md only — zero rule duplication)');
  console.log(`   Path:  ${targetDir}`);

  try {
    fs.mkdirSync(targetDir, { recursive: true });
    const srcProfile = path.join(sourceDir, 'DEV_PROFILE.md');
    const dstProfile = path.join(targetDir, 'DEV_PROFILE.md');

    if (fs.existsSync(dstProfile)) {
      console.log('  ✅ Preserved existing .agents/DEV_PROFILE.md (no rules/GEMINI.md duplicated)');
    } else {
      fs.copyFileSync(srcProfile, dstProfile);
      console.log(`  ✅ Created ${dstProfile}`);
    }
    console.log(`\n🎉 Hoàn tất Thin Profile v${version}! Hãy điền role + stack trong .agents/DEV_PROFILE.md.\n`);
  } finally {
    if (rl) rl.close();
  }
}

// ─── Native Antigravity Plugin Bundle Install (--mode=plugin) ────────────────

async function runPluginInstall(config, isLocalPlugin, rl) {
  const pluginsRoot = isLocalPlugin
    ? path.join(config.localDir, 'plugins')
    : path.join(config.globalDir, 'plugins');
  const pluginDir = path.join(pluginsRoot, PLUGIN_DIR_NAME);

  if (path.resolve(pluginDir) === path.resolve(sourceDir) || path.resolve(config.localDir) === path.resolve(sourceDir) && isLocalPlugin) {
    throw new Error('Install into a different workspace; refusing to overwrite package source.');
  }

  console.log(`\n🚀 AI Developer Skill OS v${version} — Native Plugin Mode`);
  console.log(`   IDE:    ${config.label}`);
  console.log(`   Scope:  ${isLocalPlugin ? 'Workspace Plugin' : 'Global Plugin'}`);
  console.log(`   Target: ${pluginDir}`);

  const installedVersion = getInstalledVersion(pluginDir);
  if (installedVersion) {
    if (installedVersion === version && !process.argv.includes('--force')) {
      console.log(`\n✅ Plugin v${version} đã được cài đặt — không cần cập nhật.`);
      console.log('   Dùng --force để cài lại.\n');
      if (rl) rl.close();
      return;
    }
    if (installedVersion !== version) {
      const shouldUpgrade = process.argv.includes('--force') ? true : rl
        ? await confirm(rl, `\n   Backup plugin v${installedVersion} và cập nhật lên v${version}? [Y/n]: `)
        : true;
      if (!shouldUpgrade) {
        console.log('   Hủy cài đặt plugin.');
        if (rl) rl.close();
        return;
      }
    }
  }

  try {
    const backupDir = backupExistingInstall(pluginDir);
    if (fs.existsSync(pluginDir)) {
      fs.rmSync(pluginDir, { recursive: true, force: true });
    }
    fs.mkdirSync(pluginDir, { recursive: true });

    // Copy runtime components into plugin bundle
    for (const sub of ['skills', 'references', 'registry', 'rules', 'hooks', 'assets']) {
      const srcSub = path.join(sourceDir, sub);
      if (fs.existsSync(srcSub)) {
        copyRecursiveSync(srcSub, path.join(pluginDir, sub), srcSub);
      }
    }
    for (const rootFile of ['hooks.json', 'skill-aliases.yml']) {
      const srcFile = path.join(sourceDir, rootFile);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(pluginDir, rootFile));
      }
    }

    // Build consolidated plain-markdown rules/AGENTS.md (no YAML frontmatter per Antigravity Plugin spec)
    const geminiAdapter = fs.readFileSync(path.join(rootDir, 'GEMINI.md'), 'utf8')
      .trim()
      .replace(/\.agents\/AGENTS\.md/g, '.agents/rules/AGENTS.md');
    const agentsEntry = fs.readFileSync(path.join(sourceDir, 'AGENTS.md'), 'utf8').trim();
    const consolidatedPluginAgents = `${geminiAdapter}\n\n---\n\n${agentsEntry}\n`;
    fs.writeFileSync(path.join(pluginDir, 'rules', 'AGENTS.md'), consolidatedPluginAgents, 'utf8');

    // Write plugin.json synchronized with package.json version
    const templatePath = path.join(sourceDir, 'docs', 'templates', 'plugin.template.json');
    const pluginMeta = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    pluginMeta.version = version;
    fs.writeFileSync(path.join(pluginDir, 'plugin.json'), `${JSON.stringify(pluginMeta, null, 2)}\n`, 'utf8');

    // Include README.md for user inspection (ignored by agent rule loader)
    const readmeSrc = path.join(rootDir, 'README.md');
    if (fs.existsSync(readmeSrc)) {
      fs.copyFileSync(readmeSrc, path.join(pluginDir, 'README.md'));
    }

    rewriteAbsolutePaths(pluginDir);
    writeVersionMarker(pluginDir);

    if (backupDir) console.log(`  Rollback: restore plugin from ${backupDir}`);
    console.log(`  ✅ Installed Native Antigravity Plugin → ${pluginDir}`);
    console.log(`  🔗 Manage live in Antigravity UI: [qk-skill-os](customization://${PLUGIN_DIR_NAME})\n`);
  } catch (err) {
    console.error('❌ Lỗi cài đặt plugin:', err.message);
    process.exit(1);
  } finally {
    if (rl) rl.close();
  }
}

// ─── Main install logic ───────────────────────────────────────────────────────

async function runInstall(ideKey, scopeKey, rl, modeKey = null) {
  const scopeMap = { '1': 'local', '2': 'global', '3': 'profile', '4': 'plugin' };

  const ide = ideKey || 'antigravity';
  const scope = scopeMap[scopeKey] || scopeKey || (modeKey === 'plugin' ? 'global' : 'local');
  const mode = modeKey || (scope === 'plugin' ? 'plugin' : null);
  const config = IDE_CONFIG[ide];

  if (!config) {
    console.error(`Unsupported platform: "${ide}". This package supports Antigravity only.`);
    process.exit(1);
  }

  if (mode === 'plugin') {
    await runPluginInstall(config, scope === 'local', rl);
    return;
  }

  if (scope === 'profile') {
    await runProfileInstall(config, rl);
    return;
  }

  const isGlobal = scope === 'global';

  if (isGlobal && config.globalDir === null) {
    console.warn(`⚠️  ${config.label} không hỗ trợ cài Global qua file.`);
    console.warn(`   ${config.note}`);
    console.warn('   Tiến hành cài Local thay thế...');
  }

  const targetDir = (isGlobal && config.globalDir) ? config.globalDir : config.localDir;
  if (path.resolve(targetDir) === path.resolve(sourceDir)) {
    throw new Error('Install into a different workspace; refusing to overwrite package source.');
  }

  console.log(`\n🚀 AI Developer Skill OS v${version}`);
  console.log(`   IDE:   ${config.label}`);
  console.log(`   Scope: ${isGlobal ? 'Global' : 'Local'}`);
  console.log(`   Path:  ${targetDir}`);

  if (!isGlobal && config.globalDir) {
    const hasGlobalInstall =
      fs.existsSync(path.join(config.globalDir, VERSION_FILE)) ||
      fs.existsSync(path.join(config.globalDir, 'plugins', PLUGIN_DIR_NAME, 'plugin.json'));
    if (hasGlobalInstall) {
      console.log('   💡 Lưu ý: Máy đã có bản Global/Plugin. Nếu chỉ cần cấu hình stack dự án mà tránh nạp trùng 2x Rules, dùng --scope=profile.');
    }
  }

  // ── Version check ────────────────────────────────────────────────────────
  const installedVersion = getInstalledVersion(targetDir);

  if (installedVersion) {
    if (installedVersion === version) {
      console.log(`\n✅ Phiên bản v${version} đã được cài đặt — không cần cập nhật.`);
      console.log('   Dùng --force để cài lại.\n');
      const isForce = process.argv.includes('--force');
      if (!isForce) {
        if (rl) rl.close();
        return;
      }
      console.log('   --force detected: tiến hành cài lại...');
    } else {
      console.log(`\n⚠️  Phát hiện phiên bản cũ: v${installedVersion}`);
      console.log(`   Phiên bản mới:             v${version}`);
      const shouldUpgrade = process.argv.includes('--force') ? true : rl
        ? await confirm(rl, '\n   Backup và cập nhật bản mới? [Y/n]: ')
        : true;
      if (!shouldUpgrade) {
        console.log('   Hủy cài đặt.');
        if (rl) rl.close();
        return;
      }
    }
  } else {
    console.log('   (Chưa cài đặt — fresh install)\n');
  }

  // ── Install ──────────────────────────────────────────────────────────────
  try {
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Không tìm thấy source: ${sourceDir}`);
      process.exit(1);
    }

    const backupDir = backupExistingInstall(targetDir);
    const profilePath = path.join(targetDir, 'DEV_PROFILE.md');
    const preservedProfile = fs.existsSync(profilePath) ? fs.readFileSync(profilePath) : null;

    const nextManifest = generateManifest(sourceDir, version);
    const managedManifestPath = path.join(targetDir, MANAGED_MANIFEST_FILE);
    let previousManifest = null;
    if (fs.existsSync(managedManifestPath)) {
      try {
        previousManifest = JSON.parse(fs.readFileSync(managedManifestPath, 'utf8'));
      } catch {}
    }

    const installedFiles = fs.existsSync(targetDir) ? collectInstalledFiles(targetDir) : [];
    const currentFilesContent = {};
    for (const rel of installedFiles) {
      try {
        currentFilesContent[rel] = fs.readFileSync(path.join(targetDir, rel));
      } catch {}
    }
    const isLegacyUpgrade = !previousManifest && Boolean(installedVersion || fs.existsSync(path.join(targetDir, 'skills')));

    const migrationPlan = planManagedMigration({
      previousManifest,
      nextManifest,
      installedFiles,
      currentFilesContent,
      isLegacyUpgrade
    });

    if (!previousManifest && !isLegacyUpgrade && !fs.existsSync(targetDir)) {
      copyRecursiveSync(sourceDir, targetDir);
      console.log(`  ✅ Copied .agents/ → ${targetDir}`);
    } else {
      // Execute removals
      for (const fileToRemove of migrationPlan.remove) {
        const fullRemove = path.join(targetDir, fileToRemove);
        if (fs.existsSync(fullRemove)) {
          fs.unlinkSync(fullRemove);
          console.log(`  🗑️ Removed retired managed file: ${fileToRemove}`);
        }
      }

      // Clean up empty directories in targetDir (skills, retired knowledge/blueprints/docs/workflows)
      removeEmptyDirs(targetDir);
      const workflowsDir = path.join(targetDir, 'workflows');
      removeEmptyDirs(workflowsDir);
      if (fs.existsSync(workflowsDir) && fs.readdirSync(workflowsDir).length === 0) {
        fs.rmdirSync(workflowsDir);
      }

      // Copy only files in migrationPlan.write (never overwrite conflict files)
      for (const rel of migrationPlan.write) {
        const src = path.join(sourceDir, rel);
        const dst = path.join(targetDir, rel);
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.copyFileSync(src, dst);
        }
      }

      // Report conflicts and save upstream new versions as .system-new for user inspection
      for (const conflict of migrationPlan.conflicts) {
        console.warn(`  ⚠️ Preserved modified user file (conflict): ${conflict}`);
        const src = path.join(sourceDir, conflict);
        if (fs.existsSync(src)) {
          const conflictNewPath = path.join(targetDir, `${conflict}.system-new`);
          try {
            fs.mkdirSync(path.dirname(conflictNewPath), { recursive: true });
            fs.copyFileSync(src, conflictNewPath);
          } catch {}
        }
      }

      console.log(`  ✅ Installed .agents/ → ${targetDir}`);
    }

    if (isGlobal) rewriteAbsolutePaths(targetDir, migrationPlan.conflicts, Object.keys(nextManifest.files || {}));
    const geminiSource = path.resolve(__dirname, '..', 'GEMINI.md');
    if (fs.existsSync(geminiSource)) {
      const geminiDest = isGlobal ? path.join(homeDir, '.gemini', 'GEMINI.md') : path.join(cwd, 'GEMINI.md');
      fs.mkdirSync(path.dirname(geminiDest), { recursive: true });
      if (fs.existsSync(geminiDest)) {
        fs.copyFileSync(geminiDest, `${geminiDest}.backup-${Date.now()}`, fs.constants.COPYFILE_EXCL);
      }
      fs.copyFileSync(geminiSource, geminiDest);
      if (isGlobal) {
        const content = fs.readFileSync(geminiDest, 'utf8');
        fs.writeFileSync(geminiDest, content.replace(/\.agents\//g, () => `${targetDir.replace(/\\/g, '/')}/`));
      }
      console.log(`  ✅ Copied GEMINI.md → ${geminiDest}`);
    }

    if (preservedProfile) fs.writeFileSync(profilePath, preservedProfile);
    if (backupDir) console.log(`  Rollback: restore files from ${backupDir}`);

    // Generate the installed manifest reflecting actual content on disk after post-install transformations
    const installedManifest = {
      schemaVersion: nextManifest.schemaVersion || 1,
      packageVersion: version,
      files: {}
    };

    for (const [rel, sourceSha] of Object.entries(nextManifest.files || {})) {
      const full = path.join(targetDir, rel);
      if (fs.existsSync(full)) {
        if (migrationPlan.conflicts.includes(rel)) {
          installedManifest.files[rel] = previousManifest?.files?.[rel] || sourceSha;
        } else {
          installedManifest.files[rel] = computeSha256(fs.readFileSync(full));
        }
      }
    }

    fs.writeFileSync(
      path.join(targetDir, MANAGED_MANIFEST_FILE),
      JSON.stringify(installedManifest, null, 2),
      'utf8'
    );
    writeVersionMarker(targetDir);

    // Verify remaining skills to check for incomplete migration
    let remainingSkills = [];
    const skillsDir = path.join(targetDir, 'skills');
    if (fs.existsSync(skillsDir)) {
      remainingSkills = fs.readdirSync(skillsDir)
        .filter(d => !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory());
    }
    const unexpectedSkills = remainingSkills.filter(s => !CORE_SKILLS.includes(s));
    const hasIncompleteMigration = unexpectedSkills.length > 0;

    const coreConflicts = (migrationPlan?.conflicts || []).filter(f => f === 'AGENTS.md' || f === 'rules/global.md');
    if (coreConflicts.length > 0) {
      console.log('\n⚠️ CẢNH BÁO: Cài đặt ở trạng thái PARTIAL.');
      console.log(`   Các tệp cốt lõi sau đang giữ phiên bản tùy chỉnh của bạn: ${coreConflicts.join(', ')}`);
      console.log('   Bản phát hành mới được lưu thành file *.system-new. Hãy đối chiếu để hoàn tất cập nhật.');
    }

    if (hasIncompleteMigration) {
      console.log('\n⚠️ CẢNH BÁO MIGRATION CHƯA HOÀN TẤT:');
      console.log(`   Phát hiện kỹ năng cũ chưa được dọn dẹp trong ${targetDir}/skills: ${unexpectedSkills.join(', ')}`);
      console.log('   Để tránh trùng lặp discovery trong Antigravity, vui lòng kiểm tra backup và xóa hoặc di chuyển các kỹ năng cũ sang .agents/references/.');
      console.log(`\n⚠️ Cài đặt hoàn tất với cảnh báo (còn ${remainingSkills.length} skills trên disk). ${config.note}\n`);
    } else if (coreConflicts.length > 0) {
      console.log(`\n⚠️ Hoàn tất cài đặt với cảnh báo PARTIAL! ${config.note}\n`);
    } else {
      console.log(`\n🎉 Hoàn tất v${version}! ${config.note}\n`);
    }

  } catch (err) {
    console.error('❌ Lỗi cài đặt:', err.message);
    process.exit(1);
  } finally {
    if (rl) rl.close();
  }
}

// ─── Interactive CLI Entry Point ─────────────────────────────────────────────

async function main() {
  const parsed = parseArgs();

  if (parsed.scope || parsed.mode) {
    await runInstall(parsed.ide || 'antigravity', parsed.scope, null, parsed.mode);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log(`║   AI Developer Skill OS v${version} Installer           ║`);
  console.log('╚═══════════════════════════════════════════════════╝\n');
  console.log('Platform: Antigravity (Google Gemini)\n');

  console.log('\nChọn phạm vi cài đặt:');
  console.log('  1) Local        — đầy đủ cho dự án hiện tại (./.agents/ + ./GEMINI.md)');
  console.log('  2) Global       — tất cả dự án trên máy này (~/.gemini/config)');
  console.log('  3) Thin Profile — chỉ tạo ./.agents/DEV_PROFILE.md (không nhân đôi Rules khi đã cài Global/Plugin)');
  console.log('  4) Plugin       — đóng gói Native Antigravity Plugin (~/.gemini/config/plugins/qk-skill-os)\n');

  const scopeChoice = await new Promise((resolve) => rl.question('Lựa chọn [1/2/3/4]: ', resolve));

  await runInstall(parsed.ide || 'antigravity', scopeChoice.trim(), rl, parsed.mode);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
