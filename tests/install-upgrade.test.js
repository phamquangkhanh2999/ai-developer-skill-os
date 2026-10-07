import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
      expect(gemini).not.toContain('.agents/rules/');
      expect(fs.existsSync(path.join(cwd, '.gemini/config/rules/subagent-orchestration.md'))).toBe(true);
    } finally { fs.rmSync(cwd, { recursive: true, force: true }); }
  });
});
