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
  it('rejects unsupported platforms before creating or changing target files', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-unsupported-platform-'));
    try {
      for (const ide of ['claude', 'opencode', 'unknown']) {
        expect(() => execFileSync(process.execPath, [script, `--ide=${ide}`, '--scope=local'], {
          cwd,
          encoding: 'utf8',
          stdio: 'pipe'
        })).toThrow();
      }
      expect(fs.readdirSync(cwd)).toEqual([]);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

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
      expect(fs.readFileSync(path.join(cwd, 'GEMINI.md'), 'utf8')).toBe(fs.readFileSync(path.join(root, 'GEMINI.md'), 'utf8'));
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

  it('prunes only empty retired workflow directories and preserves user files there', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-workflow-cleanup-'));
    try {
      run(cwd);
      const workflows = path.join(cwd, '.agents/workflows');
      fs.mkdirSync(path.join(workflows, 'shared'), { recursive: true });
      const customFile = path.join(workflows, 'personal/notes.md');
      fs.mkdirSync(path.dirname(customFile), { recursive: true });
      fs.writeFileSync(customFile, 'keep my workflow notes\n');

      run(cwd, ['--force']);

      expect(fs.existsSync(path.join(workflows, 'shared'))).toBe(false);
      expect(fs.readFileSync(customFile, 'utf8')).toBe('keep my workflow notes\n');

      fs.rmSync(path.join(workflows, 'personal'), { recursive: true });
      run(cwd, ['--force']);
      expect(fs.existsSync(workflows)).toBe(false);
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
      expect(gemini).toContain(`${cwd}/.gemini/config/AGENTS.md`);
      expect(gemini).toContain(`${cwd}/.gemini/config/rules/global.md`);
      const globalAgents = fs.readFileSync(path.join(cwd, '.gemini/config/AGENTS.md'), 'utf8');
      expect(globalAgents).toContain(`(${cwd}/.gemini/config/rules/global.md)`);
      expect(globalAgents).toContain(`${cwd}/.gemini/config/references/ui.md`);
      expect(globalAgents).toContain(`${cwd}/.gemini/config/skill-aliases.yml`);
      expect(globalAgents).toContain('.agents/DEV_PROFILE.md');
      expect(globalAgents).not.toContain('`references/ui.md`');
      expect(globalAgents).not.toContain('(rules/global.md)');
      const featureSkill = fs.readFileSync(path.join(cwd, '.gemini/config/skills/qk-feature-delivery/SKILL.md'), 'utf8');
      expect(featureSkill).toContain('../../rules/global.md');
      expect(fs.existsSync(path.resolve(cwd, '.gemini/config/skills/qk-feature-delivery', '../../rules/global.md'))).toBe(true);
      expect(featureSkill).not.toContain('.agents/rules/global.md');
      expect(gemini).not.toContain('.agents/AGENTS.md');
      expect(gemini).not.toContain('.agents/rules/');
      expect(fs.existsSync(path.join(cwd, '.gemini/config/rules/subagent-orchestration.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/rules/global.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/skills/_template'))).toBe(false);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/docs'))).toBe(false);
      expect(fs.existsSync(path.join(cwd, '.gemini/config/LICENSE'))).toBe(false);
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
      const stockUiContent = fs.readFileSync(path.join(root, 'tests/fixtures/v10-ui-skill.md'), 'utf8');
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

  it('records accurate checksums matching on-disk rewritten files in global install manifest (0 mismatches)', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-global-checksum-'));
    try {
      execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=global'],
        { cwd, env: { ...process.env, HOME: cwd }, stdio: 'pipe' });

      const targetDir = path.join(cwd, '.gemini/config');
      const manifestPath = path.join(targetDir, '.ai-skill-os-managed.json');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const mismatched = [];

      for (const [rel, recordedSha] of Object.entries(manifest.files)) {
        const full = path.join(targetDir, rel);
        expect(fs.existsSync(full), `File ${rel} recorded in manifest must exist on disk`).toBe(true);
        const actualSha = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
        if (actualSha !== recordedSha) {
          mismatched.push({ file: rel, recordedSha, actualSha });
        }
      }

      // Checksum mismatches immediately after fresh global install must be exactly 0
      expect(mismatched).toEqual([]);

      // Second install / upgrade should not report any conflicts
      const upgradeOutput = execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=global', '--force'],
        { cwd, env: { ...process.env, HOME: cwd }, encoding: 'utf8', stdio: 'pipe' });

      expect(upgradeOutput).not.toContain('conflict');

      // User customizes rules/global.md with a relative .agents/rules reference; global upgrade must preserve it untouched
      const customGlobalContent = '# User Custom Global\nKeep literal .agents/rules/safety.md reference untouched!\n';
      fs.writeFileSync(path.join(targetDir, 'rules/global.md'), customGlobalContent, 'utf8');
      execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=global', '--force'],
        { cwd, env: { ...process.env, HOME: cwd }, encoding: 'utf8', stdio: 'pipe' });
      expect(fs.readFileSync(path.join(targetDir, 'rules/global.md'), 'utf8')).toBe(customGlobalContent);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('excludes internal .agents/docs from installs and cleans previously managed docs while preserving user docs', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-docs-prune-'));
    try {
      const target = path.join(cwd, '.agents');
      fs.mkdirSync(path.join(target, 'docs'), { recursive: true });
      const oldSpecContent = '# Old Managed Spec v12\n';
      const oldSpecSha = crypto.createHash('sha256').update(oldSpecContent).digest('hex');
      fs.writeFileSync(path.join(target, 'docs/SPEC.md'), oldSpecContent, 'utf8');
      fs.writeFileSync(path.join(target, 'docs/my-team-notes.md'), 'keep team notes\n', 'utf8');
      fs.writeFileSync(path.join(target, '.ai-skill-os-managed.json'), JSON.stringify({
        schemaVersion: 1,
        packageVersion: '12.1.0',
        files: { 'docs/SPEC.md': oldSpecSha }
      }));

      run(cwd, ['--force']);

      expect(fs.existsSync(path.join(target, 'docs/SPEC.md'))).toBe(false);
      expect(fs.readFileSync(path.join(target, 'docs/my-team-notes.md'), 'utf8')).toBe('keep team notes\n');
      expect(fs.existsSync(path.join(target, 'LICENSE'))).toBe(false);
      expect(fs.existsSync(path.join(target, 'hooks.json'))).toBe(true);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('supports --scope=profile to create or preserve only .agents/DEV_PROFILE.md without duplicating rules', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-thin-profile-'));
    try {
      execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=profile'],
        { cwd, env: { ...process.env, HOME: cwd }, stdio: 'pipe' });

      expect(fs.existsSync(path.join(cwd, '.agents/DEV_PROFILE.md'))).toBe(true);
      expect(fs.existsSync(path.join(cwd, 'GEMINI.md'))).toBe(false);
      expect(fs.existsSync(path.join(cwd, '.agents/rules'))).toBe(false);
      expect(fs.existsSync(path.join(cwd, '.agents/skills'))).toBe(false);

      fs.writeFileSync(path.join(cwd, '.agents/DEV_PROFILE.md'), 'role: ai-engineer\n', 'utf8');
      execFileSync(process.execPath, [script, '--ide=antigravity', '--scope=profile', '--force'],
        { cwd, env: { ...process.env, HOME: cwd }, stdio: 'pipe' });
      expect(fs.readFileSync(path.join(cwd, '.agents/DEV_PROFILE.md'), 'utf8')).toBe('role: ai-engineer\n');
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

  it('supports --mode=plugin to package a compliant Native Antigravity Plugin bundle', () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-plugin-mode-'));
    try {
      const output = execFileSync(process.execPath, [script, '--ide=antigravity', '--mode=plugin'],
        { cwd, env: { ...process.env, HOME: cwd }, encoding: 'utf8', stdio: 'pipe' });

      expect(output).toContain('customization://qk-skill-os');
      const pluginDir = path.join(cwd, '.gemini/config/plugins/qk-skill-os');
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      const pluginMeta = JSON.parse(fs.readFileSync(path.join(pluginDir, 'plugin.json'), 'utf8'));

      const allowedKeys = new Set([
        'name', 'description', 'logo', 'suggestedPrompts', 'displayName',
        'version', 'author', 'homepage', 'repository', 'disabled'
      ]);
      for (const k of Object.keys(pluginMeta)) {
        expect(allowedKeys.has(k), `Unknown plugin.json key: ${k}`).toBe(true);
      }
      expect(pluginMeta.name).toBe('qk-skill-os');
      expect(pluginMeta.version).toBe(pkg.version);
      expect(pluginMeta.suggestedPrompts).toHaveLength(3);
      expect(fs.existsSync(path.join(pluginDir, pluginMeta.logo))).toBe(true);
      expect(fs.existsSync(path.join(pluginDir, 'hooks.json'))).toBe(true);
      expect(fs.existsSync(path.join(pluginDir, 'hooks/guard-registry.mjs'))).toBe(true);
      expect(fs.existsSync(path.join(pluginDir, 'skills/qk-feature-delivery/SKILL.md'))).toBe(true);

      const pluginAgentsRule = fs.readFileSync(path.join(pluginDir, 'rules/AGENTS.md'), 'utf8');
      expect(pluginAgentsRule.startsWith('---')).toBe(false);
      expect(pluginAgentsRule).toContain(`${pluginDir}/rules/AGENTS.md`);
      expect(pluginAgentsRule).not.toContain(`${pluginDir}/AGENTS.md`);
      expect(pluginAgentsRule).toContain(`${pluginDir}/rules/global.md`);
      expect(pluginAgentsRule).toContain(`${pluginDir}/references/ui.md`);
      expect(pluginAgentsRule).toContain('.agents/DEV_PROFILE.md');

      // Same-version run is a no-op
      const secondRun = execFileSync(process.execPath, [script, '--ide=antigravity', '--mode=plugin'],
        { cwd, env: { ...process.env, HOME: cwd }, encoding: 'utf8', stdio: 'pipe' });
      expect(secondRun).toContain('không cần cập nhật');
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });

});
