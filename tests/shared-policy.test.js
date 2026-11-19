// Static packaging/metadata checks only. These do not verify agent behavior.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const meta = rel => yaml.load(read(rel).match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
describe('QK static policy packaging (not runtime evaluation)', () => {
  it('ships one always-on global contract', () => {
    const files = fs.readdirSync(path.join(root, '.agents/rules')).filter(x => x.endsWith('.md'));
    expect(files.filter(x => meta('.agents/rules/' + x).trigger === 'always_on')).toEqual(['global.md']);
  });
  it('adapter links real shared entrypoint, contract and safety', () => {
    const content = read('GEMINI.md');
    for (const rel of ['.agents/AGENTS.md', '.agents/rules/global.md', '.agents/rules/safety.md']) {
      expect(content).toContain(rel);
      expect(fs.existsSync(path.join(root, rel))).toBe(true);
    }
    expect(content).not.toContain('/home/khanhpq');
  });
  it('core skills refer to one contract instead of defining their own status', () => {
    for (const name of fs.readdirSync(path.join(root, '.agents/skills'))) {
      const content = read('.agents/skills/' + name + '/SKILL.md');
      expect(content).toContain('../../rules/global.md');
      expect(content).not.toContain('`VERIFIED`');
    }
  });
  it('prompt compiler is on demand', () => {
    expect(meta('.agents/rules/prompt-compiler.md').trigger).toBe('model_decision');
    expect(meta('.agents/rules/prompt-compiler.md').applies_to).not.toBe('all');
  });
  it('priority entries reference existing policy files', () => {
    const data = yaml.load(read('.agents/rules/priorities.yml'));
    for (const entry of Object.values(data.priority)) for (const file of entry.files) {
      expect(fs.existsSync(path.join(root, '.agents/rules', file))).toBe(true);
    }
  });
});
