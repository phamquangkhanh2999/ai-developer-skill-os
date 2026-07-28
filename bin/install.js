#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';

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

// ─── IDE Configuration Map ────────────────────────────────────────────────────
// Each IDE has:
//   localDir  — where to install when scope=local (relative to cwd)
//   globalDir — where to install when scope=global (absolute, user-level)
//   postInstall — special steps after copy (null = none)
// ─────────────────────────────────────────────────────────────────────────────
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
  cursor: {
    label: 'Cursor IDE',
    localDir: path.join(cwd, '.cursor', 'rules'),
    globalDir: null, // Cursor has no reliable global rules path — use Settings UI
    postInstall: 'exportCursorRules',
    note: 'Local only: .cursor/rules/ — use Cursor Settings > Rules for AI for global rules',
  },
  codex: {
    label: 'OpenAI Codex CLI',
    localDir: path.join(cwd, '.codex'),
    globalDir: path.join(homeDir, '.codex'),
    postInstall: null,
    note: 'Global: ~/.codex — applies to all Codex CLI sessions',
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

/** Read installed version from marker file. Returns null if not installed. */
function getInstalledVersion(targetDir) {
  const markerPath = path.join(targetDir, VERSION_FILE);
  if (!fs.existsSync(markerPath)) return null;
  try {
    return fs.readFileSync(markerPath, 'utf8').trim();
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

/** Remove existing install. For Cursor: only delete the .mdc rule file. */
function removeExistingInstall(targetDir, ide) {
  if (ide === 'cursor') {
    const mdcPath = path.join(targetDir, 'ai-skill-os.mdc');
    if (fs.existsSync(mdcPath)) fs.unlinkSync(mdcPath);
    console.log('  🗑️  Removed old Cursor rule: ai-skill-os.mdc');
  } else {
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      console.log(`  🗑️  Removed old install: ${targetDir}`);
    }
  }
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
  const DIRS_TO_REWRITE = ['skills', 'registry', 'rules', 'workflows', 'knowledge', 'docs', 'blueprints'];

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
            content = content.replace(re, `${targetPosix}/${d}`);
            changed = true;
          }
        }
        if (content.includes('.agents/skills.json')) {
          content = content.replace(/\.agents\/skills\.json/g, `${targetPosix}/skills.json`);
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
 * Cursor install: export AGENTS.md content as a .mdc rule file.
 * Cursor reads .cursor/rules/*.mdc — each file needs YAML frontmatter.
 */
function exportCursorRules(targetDir) {
  const agentsMd = path.join(sourceDir, 'AGENTS.md');
  if (!fs.existsSync(agentsMd)) return;

  const rawContent = fs.readFileSync(agentsMd, 'utf8');
  const mdcContent = `---
description: "AI Developer Skill OS v${version} — global skill rules"
alwaysApply: true
---

${rawContent}`;

  const outPath = path.join(targetDir, 'ai-skill-os.mdc');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(outPath, mdcContent, 'utf8');
  console.log(`  ✅ Exported rules → ${outPath}`);
  console.log('  ℹ️  For global rules: Cursor Settings > General > Rules for AI');
}

// ─── Main install logic ───────────────────────────────────────────────────────

async function runInstall(ideKey, scopeKey, rl) {
  const ideMap = { '1': 'antigravity', '2': 'claude', '3': 'cursor', '4': 'codex' };
  const scopeMap = { '1': 'local', '2': 'global' };

  const ide = ideMap[ideKey] || ideKey;
  const scope = scopeMap[scopeKey] || scopeKey;
  const config = IDE_CONFIG[ide];

  if (!config) {
    console.error(`❌ IDE không hợp lệ: "${ide}". Chọn: antigravity, claude, cursor, codex`);
    process.exit(1);
  }

  const isGlobal = scope === 'global';

  if (isGlobal && config.globalDir === null) {
    console.warn(`⚠️  ${config.label} không hỗ trợ cài Global qua file.`);
    console.warn(`   ${config.note}`);
    console.warn('   Tiến hành cài Local thay thế...');
  }

  const targetDir = (isGlobal && config.globalDir) ? config.globalDir : config.localDir;

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
      const shouldUpgrade = rl
        ? await confirm(rl, '\n   Xóa bản cũ và cài bản mới? [Y/n]: ')
        : true;
      if (!shouldUpgrade) {
        console.log('   Hủy cài đặt.');
        if (rl) rl.close();
        return;
      }
    }
    // Remove old install before fresh copy
    removeExistingInstall(targetDir, ide);
  } else {
    console.log('   (Chưa cài đặt — fresh install)\n');
  }

  // ── Install ──────────────────────────────────────────────────────────────
  try {
    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Không tìm thấy source: ${sourceDir}`);
      process.exit(1);
    }

    if (ide === 'cursor') {
      exportCursorRules(targetDir);
    } else {
      copyRecursiveSync(sourceDir, targetDir);
      console.log(`  ✅ Copied .agents/ → ${targetDir}`);

      if (isGlobal && config.postInstall === 'rewriteAbsolutePaths') {
        rewriteAbsolutePaths(targetDir);
      }
      if (config.postInstall === 'renameToClaude') {
        renameToClaude(targetDir);
      }
    }

    writeVersionMarker(targetDir);
    console.log(`\n🎉 Hoàn tất v${version}! ${config.note}\n`);

  } catch (err) {
    console.error('❌ Lỗi cài đặt:', err.message);
    process.exit(1);
  } finally {
    if (rl) rl.close();
  }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

const args = parseArgs();

if (args.ide && args.scope) {
  // Non-interactive mode (called via npm scripts)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await runInstall(args.ide, args.scope, rl);
} else {
  // Interactive mode
  console.log(`\n🚀 AI Developer Skill OS v${version} — Setup\n`);

  const ideQuestion = `Chọn IDE/AI Assistant:
  (1) Antigravity (Google Gemini)
  (2) Claude Code (Anthropic)
  (3) Cursor IDE
  (4) OpenAI Codex CLI

Nhập số (1-4): `;

  const scopeQuestion = `
Phạm vi cài đặt:
  (1) Local  — Chỉ dự án này (.agents/ hoặc .claude/ trong thư mục hiện tại)
  (2) Global — Toàn bộ máy tính (áp dụng cho mọi dự án)

Nhập số (1-2): `;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question(ideQuestion, async (ideAnswer) => {
    rl.question(scopeQuestion, async (scopeAnswer) => {
      await runInstall(ideAnswer.trim(), scopeAnswer.trim(), rl);
    });
  });
}
