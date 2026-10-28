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
  computeSha256
} from '../tooling/managed-files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceDir = path.resolve(__dirname, '..', '.agents');
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;
const cwd = process.cwd();
const homeDir = os.homedir();

// Version marker file written after every successful install
const VERSION_FILE = '.ai-skill-os-version';

const CORE_SKILLS = [
  'qk-feature-delivery',
  'qk-bug-resolution',
  'qk-code-review',
  'qk-code-cleaner',
  'qk-devops-release'
];

// ─── IDE Configuration Map ────────────────────────────────────────────────────
const IDE_CONFIG = {
  antigravity: {
    label: 'Antigravity (Google Gemini)',
    localDir: path.join(cwd, '.agents'),
    globalDir: path.join(homeDir, '.gemini', 'config'),
    postInstall: 'rewriteAbsolutePaths',
    note: 'Global: ~/.gemini/config — applies to all projects on this machine',
  },
  claude: {
    label: 'Claude Code (Anthropic)',
    localDir: path.join(cwd, '.claude'),
    globalDir: path.join(homeDir, '.claude'),
    postInstall: 'renameToClaude',
    note: 'Global: ~/.claude/CLAUDE.md — applies to all Claude Code sessions',
  },
  opencode: {
    label: 'OpenCode (Open Source)',
    localDir: path.join(cwd, '.opencode'),
    globalDir: path.join(homeDir, '.config', 'opencode'),
    postInstall: 'copyOpenCodeConfig',
    note: 'Global: ~/.config/opencode — applies to all OpenCode sessions',
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
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

/** Read installed version from marker file. Returns null if not installed. */
function getInstalledVersion(targetDir) {
  const markerPath = path.join(targetDir, VERSION_FILE);
  if (!fs.existsSync(markerPath)) return null;
  try {
    return fs.readFileSync(markerPath, 'utf8').split(/\r?\n/)[0].trim();
  } catch {
    return null;
  }
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
  const result = { ide: null, scope: null };
  for (const arg of args) {
    if (arg.startsWith('--ide=')) result.ide = arg.split('=')[1];
    else if (arg.startsWith('--scope=')) result.scope = arg.split('=')[1];
  }
  return result;
}

// ─── Post-install handlers ────────────────────────────────────────────────────

/**
 * Antigravity global install: rewrite relative .agents/X paths → absolute paths.
 * Required because Antigravity reads SKILL.md files from an absolute global path.
 */
function rewriteAbsolutePaths(targetDir) {
  const targetPosix = targetDir.replace(/\\/g, '/');
  const DIRS_TO_REWRITE = ['skills', 'registry', 'rules', 'workflows', 'knowledge', 'docs', 'blueprints', 'references'];

  const walk = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (/\.(md|yml|yaml|json)$/.test(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let changed = false;

        for (const d of DIRS_TO_REWRITE) {
          const re = new RegExp(`\\.agents/${d}`, 'g');
          if (re.test(content)) {
            content = content.replace(re, () => `${targetPosix}/${d}`);
            changed = true;
          }
        }
        if (content.includes('.agents/skills.json')) {
          content = content.replace(/\.agents\/skills\.json/g, () => `${targetPosix}/skills.json`);
          changed = true;
        }
        if (changed) fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  };

  walk(targetDir);
  console.log('  ✅ Rewrote .agents/* references → absolute paths for Antigravity global mode');
}

/**
 * Claude Code install: copy AGENTS.md → CLAUDE.md at target root.
 * Claude Code reads ~/.claude/CLAUDE.md as global instructions.
 */
function renameToClaude(targetDir) {
  const agentsMd = path.join(targetDir, 'AGENTS.md');
  const claudeMd = path.join(targetDir, 'CLAUDE.md');

  if (fs.existsSync(agentsMd) && !fs.existsSync(claudeMd)) {
    fs.copyFileSync(agentsMd, claudeMd);
    console.log('  ✅ Copied AGENTS.md → CLAUDE.md (Claude Code entry point)');
  } else if (fs.existsSync(claudeMd)) {
    console.log('  ℹ️  CLAUDE.md already exists — skipped overwrite');
  }
}

/**
 * OpenCode install: create .opencode/config.yaml pointing to AGENTS.md.
 * OpenCode reads .opencode/ directory for configuration.
 */
function copyOpenCodeConfig(targetDir) {
  const agentsMd = path.join(targetDir, 'AGENTS.md');
  const opencodeDir = path.join(targetDir, '.opencode');
  const configPath = path.join(opencodeDir, 'config.yaml');

  if (fs.existsSync(agentsMd)) {
    fs.mkdirSync(opencodeDir, { recursive: true });
    fs.writeFileSync(configPath, `# OpenCode Configuration
# Auto-generated by AI Developer Skill OS v${version}
rules:
  - path: AGENTS.md
    always: true
`, 'utf8');
    console.log('  ✅ Created .opencode/config.yaml');
  }
}

// ─── Main install logic ───────────────────────────────────────────────────────

async function runInstall(ideKey, scopeKey, rl) {
  const ideMap = { '1': 'antigravity', '2': 'claude', '3': 'opencode' };
  const scopeMap = { '1': 'local', '2': 'global' };

  const ide = ideMap[ideKey] || ideKey;
  const scope = scopeMap[scopeKey] || scopeKey;
  const config = IDE_CONFIG[ide];

  if (!config) {
    console.error(`❌ IDE không hợp lệ: "${ide}". Chọn: antigravity, claude, opencode`);
    process.exit(1);
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

      // Clean up empty directories in skills
      removeEmptyDirs(path.join(targetDir, 'skills'));

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

    if (ide === 'opencode') {
      copyOpenCodeConfig(targetDir);
    } else {
      if (isGlobal && config.postInstall === 'rewriteAbsolutePaths') {
        rewriteAbsolutePaths(targetDir);
      }
      if (config.postInstall === 'renameToClaude') {
        renameToClaude(targetDir);
      }
      if (ide === 'antigravity') {
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
      }
    }

    if (preservedProfile) fs.writeFileSync(profilePath, preservedProfile);
    if (backupDir) console.log(`  Rollback: restore files from ${backupDir}`);

    fs.writeFileSync(
      path.join(targetDir, MANAGED_MANIFEST_FILE),
      JSON.stringify(nextManifest, null, 2),
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

    if (hasIncompleteMigration) {
      console.log('\n⚠️ CẢNH BÁO MIGRATION CHƯA HOÀN TẤT:');
      console.log(`   Phát hiện kỹ năng cũ chưa được dọn dẹp trong ${targetDir}/skills: ${unexpectedSkills.join(', ')}`);
      console.log('   Để tránh trùng lặp discovery trong Antigravity/Claude, vui lòng kiểm tra backup và xóa hoặc di chuyển các kỹ năng cũ sang .agents/references/.');
      console.log(`\n⚠️ Cài đặt hoàn tất với cảnh báo (còn ${remainingSkills.length} skills trên disk). ${config.note}\n`);
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

  if (parsed.ide && parsed.scope) {
    await runInstall(parsed.ide, parsed.scope, null);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log(`║   AI Developer Skill OS v${version} Installer           ║`);
  console.log('╚═══════════════════════════════════════════════════╝\n');
  console.log('Chọn IDE của bạn:');
  console.log('  1) Antigravity  (Google Gemini)  → ~/.gemini/config');
  console.log('  2) Claude Code  (Anthropic)      → ~/.claude/CLAUDE.md');
  console.log('  3) OpenCode     (Open Source)    → ~/.config/opencode\n');

  const ideChoice = await new Promise((resolve) => rl.question('Lựa chọn [1/2/3]: ', resolve));

  console.log('\nChọn phạm vi cài đặt:');
  console.log('  1) Local  — chỉ dự án hiện tại (./.agents/)');
  console.log('  2) Global — tất cả dự án trên máy này (khuyến nghị)\n');

  const scopeChoice = await new Promise((resolve) => rl.question('Lựa chọn [1/2]: ', resolve));

  await runInstall(ideChoice.trim(), scopeChoice.trim(), rl);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
