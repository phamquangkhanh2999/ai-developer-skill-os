import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'bin/install.js');
const run = (cwd, args = []) => execFileSync(process.execPath,
  [script, '--ide=antigravity', '--scope=local', ...args], { cwd, encoding: 'utf8', stdio: 'pipe' });

describe('Installation and upgrade in isolated workspaces', () => {
  it('ships protocol, preserves profile/custom agents, and backs up overwritten files', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-upgrade-'));
    try {
      const target = path.join(cwd, '.agents');
      fs.mkdirSync(path.join(target, 'agents'), { recursive: true });
      fs.writeFileSync(path.join(target, '.ai-skill-os-version'), '10.2.0\nInstalled: old\n');
      fs.writeFileSync(path.join(target, 'DEV_PROFILE.md'), 'private profile\n');
      fs.writeFileSync(path.join(target, 'agents/custom.md'), 'custom agent\n');
      fs.writeFileSync(path.join(cwd, 'GEMINI.md'), 'custom instructions\n');
      run(cwd, ['--force']);
      expect(fs.readFileSync(path.join(target, 'DEV_PROFILE.md'), 'utf8')).toBe('private profile\n');
      expect(fs.readFileSync(path.join(target, 'agents/custom.md'), 'utf8')).toBe('custom agent\n');
      expect(fs.readFileSync(path.join(cwd, 'GEMINI.md'), 'utf8')).toContain('Controlled Subagent Orchestration');
      expect(fs.readFileSync(path.join(target, 'rules/subagent-orchestration.md'), 'utf8')).toContain('parallel-write');
      const files = fs.readdirSync(cwd);
      const backup = files.find(f => f.startsWith('.agents.backup-'));
      expect(fs.readFileSync(path.join(cwd, backup, '.ai-skill-os-version'), 'utf8')).toContain('10.2.0');
      const geminiBackup = files.find(f => f.startsWith('GEMINI.md.backup-'));
      expect(fs.readFileSync(path.join(cwd, geminiBackup), 'utf8')).toBe('custom instructions\n');
      const before = fs.readdirSync(cwd).sort();
      run(cwd);
      expect(fs.readdirSync(cwd).sort()).toEqual(before);
      run(cwd, ['--force']);
      expect(fs.readFileSync(path.join(target, 'DEV_PROFILE.md'), 'utf8')).toBe('private profile\n');
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('does not overwrite its own package source', () => {
    try {
      run(root);
      throw new Error('Expected source install to fail');
    } catch (error) {
      expect(String(error.stderr)).toContain('refusing to overwrite package source');
    }
  });

  it('resolves global protocol paths using an isolated home and retains custom agents', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-global-'));
    try {
      execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=global'],
        { cwd, env: { ...process.env, HOME: cwd }, stdio: 'pipe' });
      const gemini = fs.readFileSync(path.join(cwd, '.gemini/GEMINI.md'), 'utf8');
      expect(gemini).toContain(`${cwd}/.gemini/config/rules/subagent-orchestration.md`);
      expect(gemini).toContain(`${cwd}/.gemini/config/AGENTS.md`);
      expect(gemini).toContain(`${cwd}/.gemini/config/rules/global.md`);
      expect(gemini).not.toContain('.agents/AGENTS.md');
      expect(gemini).not.toContain('.agents/rules/');
      expect(fs.existsSync(path.join(cwd, '.gemini/config/rules/subagent-orchestration.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/rules/global.md'))).toBe(true);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('upgrades with managed manifest: removes retired files and preserves customized files', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-managed-upgrade-'));
    try {
      const target = path.join(cwd, '.agents');
      fs.mkdirSync(path.join(target, 'retired-skill'), { recursive: true });
      fs.writeFileSync(path.join(target, 'retired-skill/SKILL.md'), 'retired skill content');
      fs.writeFileSync(path.join(target, 'custom.md'), 'user custom content');

      const sha = crypto.createHash('sha256').update('retired skill content').digest('hex');
      fs.writeFileSync(path.join(target, '.ai-skill-os-managed.json'), JSON.stringify({
        schemaVersion: 1,
        packageVersion: '10.2.0',
        files: {
          'retired-skill/SKILL.md': sha
        }
      }));

      run(cwd, ['--force']);

      expect(fs.existsSync(path.join(target, 'retired-skill/SKILL.md'))).toBe(false);
      expect(fs.readFileSync(path.join(target, 'custom.md'), 'utf8')).toBe('user custom content');
      expect(fs.existsSync(path.join(target, '.ai-skill-os-managed.json'))).toBe(true);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('preserves user modified files even when present in new release and creates .system-new', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-conflict-'));
    try {
      run(cwd);
      const target = path.join(cwd, '.agents');
      const globalRule = path.join(target, 'rules/global.md');
      expect(fs.existsSync(globalRule)).toBe(true);

      fs.writeFileSync(globalRule, '# User Customized Global Rule\nNever overwrite me!\n');

      run(cwd, ['--force']);

      expect(fs.readFileSync(globalRule, 'utf8')).toBe('# User Customized Global Rule\nNever overwrite me!\n');
      expect(fs.existsSync(`${globalRule}.system-new`)).toBe(true);
      expect(fs.readFileSync(`${globalRule}.system-new`, 'utf8')).not.toContain('Never overwrite me!');
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('handles legacy v10 upgrade without manifest: cleans unmodified retired skills and warns if custom legacy skills remain', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-v10-legacy-'));
    try {
      const target = path.join(cwd, '.agents');
      // Create mock v10 directory with unmodified ui-engineer and customized product-spec
      const uiSkillDir = path.join(target, 'skills/qk-ui-engineer');
      const psSkillDir = path.join(target, 'skills/qk-product-spec');
      fs.mkdirSync(uiSkillDir, { recursive: true });
      fs.mkdirSync(psSkillDir, { recursive: true });

      // Get stock v10 content for qk-ui-engineer
      const stockUiContent = execFileSync('git', ['show', '85b28f88fb1ffdbf0a931bd3ff583467b61b9d92:.agents/skills/qk-ui-engineer/SKILL.md'], { encoding: 'utf8' });
      fs.writeFileSync(path.join(uiSkillDir, 'SKILL.md'), stockUiContent);

      // Write customized content for qk-product-spec
      fs.writeFileSync(path.join(psSkillDir, 'SKILL.md'), '# User Customized Product Spec\nDo not delete!\n');

      const output = run(cwd, ['--force']);

      // Unmodified ui-engineer was removed
      expect(fs.existsSync(uiSkillDir)).toBe(false);

      // Customized product-spec was preserved
      expect(fs.existsSync(psSkillDir)).toBe(true);
      expect(fs.readFileSync(path.join(psSkillDir, 'SKILL.md'), 'utf8')).toContain('User Customized Product Spec');

      // Output warns about incomplete migration due to remaining legacy skill
      expect(output).toContain('CẢNH BÁO MIGRATION CHƯA HOÀN TẤT');
      expect(output).toContain('qk-product-spec');
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });
});
