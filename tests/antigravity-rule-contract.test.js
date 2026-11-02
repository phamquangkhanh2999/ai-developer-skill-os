import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';
import { validateRuleContent, validateRulesDir } from '../tooling/validate-skills.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rulesDir = path.join(root, '.agents', 'rules');
const supportedTriggers = new Set(['always_on', 'model_decision', 'glob', 'manual']);

function readRule(file) {
  const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return { content, metadata: match ? yaml.load(match[1]) : null };
}

describe('Antigravity rule contracts', () => {
  const ruleFiles = fs.readdirSync(rulesDir).filter(file => file.endsWith('.md')).sort();

  it('gives every immediately discoverable rule valid Antigravity activation metadata', () => {
    expect(ruleFiles).toHaveLength(9);
    for (const file of ruleFiles) {
      const { metadata } = readRule(file);
      expect(metadata, `${file} has YAML frontmatter`).toBeTruthy();
      expect(supportedTriggers.has(metadata.trigger), `${file} has supported trigger`).toBe(true);
      if (metadata.trigger === 'model_decision') {
        expect(typeof metadata.description === 'string' && metadata.description.trim(), `${file} describes activation`).toBeTruthy();
      }
    }
  });

  it('keeps the shared rule always active and loads specialized rules by decision', () => {
    expect(readRule('global.md').metadata.trigger).toBe('always_on');
    for (const file of ruleFiles.filter(file => file !== 'global.md')) {
      expect(readRule(file).metadata.trigger, file).toBe('model_decision');
    }
  });

  it('validator rejects invalid triggers and missing activation metadata', () => {
    expect(validateRuleContent('# rule', 'missing.md').valid).toBe(false);
    expect(validateRuleContent('---\ntrigger: alwaysOn\n---\n# rule', 'bad-trigger.md').valid).toBe(false);
    expect(validateRuleContent('---\ntrigger: model_decision\n---\n# rule', 'no-description.md').valid).toBe(false);
    expect(validateRuleContent('---\ntrigger: glob\n---\n# rule', 'no-globs.md').valid).toBe(false);
    expect(validateRuleContent('---\ntrigger: glob\nglobs: "**/*.ts"\n---\n# rule', 'valid-glob.md').valid).toBe(true);
  });

  it('validator scans the workspace Antigravity rules directory', () => {
    expect(validateRulesDir(rulesDir).valid).toBe(true);
  });

  it('documents native Antigravity skill commands without a removed workflow subsystem', () => {
    const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
    for (const skill of ['qk-feature-delivery', 'qk-bug-resolution', 'qk-code-review', 'qk-code-cleaner', 'qk-devops-release']) {
      expect(readme).toContain(`/${skill}`);
    }
    expect(readme).not.toMatch(/\.\/qk-[a-z-]+/);
    expect(readme).not.toMatch(/\.agents\/workflows|workflow runtime/i);
    expect(readme).not.toMatch(/Claude Code|OpenCode|--ide=claude|--ide=opencode/i);
    expect(fs.existsSync(path.join(root, '.agents', 'workflows'))).toBe(false);
  });

  it('keeps current docs and CI scoped to Antigravity only', () => {
    const rootAgents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    const architecture = fs.readFileSync(path.join(root, '.agents', 'docs', 'ARCHITECTURE.md'), 'utf8');
    const spec = fs.readFileSync(path.join(root, '.agents', 'docs', 'SPEC.md'), 'utf8');
    const ci = fs.readFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
    expect(rootAgents).toMatch(/Applies to: Antigravity only/i);
    expect(architecture + spec).not.toMatch(/Claude Code|OpenCode|platforms: \[antigravity, claude/i);
    expect(ci).not.toMatch(/--ide=claude|--ide=opencode|\.agents\/workflows/);
    expect(ci).toContain('--ide=antigravity');
    expect(fs.existsSync(path.join(root, 'CLAUDE.md'))).toBe(false);
  });

  it('does not require a skill-selection banner in user-facing responses', () => {
    const entrypoint = fs.readFileSync(path.join(root, '.agents', 'AGENTS.md'), 'utf8');
    expect(entrypoint).not.toMatch(/Dòng thông báo bắt buộc/);
    for (const skill of ['qk-feature-delivery', 'qk-bug-resolution', 'qk-code-review', 'qk-code-cleaner', 'qk-devops-release']) {
      const content = fs.readFileSync(path.join(root, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
      expect(content).not.toMatch(/Dòng mở đầu bắt buộc/);
    }
  });

  it('runs CI for Antigravity customization sources and release metadata', () => {
    const ci = fs.readFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'utf8');
    for (const changedPath of [
      '.agents/rules/**', '.agents/references/**', '.agents/docs/**',
      '.agents/AGENTS.md', 'GEMINI.md', 'tests/**', 'package.json', 'package-lock.json', 'CHANGELOG.md'
    ]) {
      expect(ci, `CI path filter includes ${changedPath}`).toContain(`'${changedPath}'`);
    }
  });

  it('keeps release metadata and root architecture guidance synchronized', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const rootAgents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    expect(pkg.version).toBe('12.0.0');
    expect(rootAgents).toContain('5 Core Skills');
    expect(rootAgents).not.toMatch(/11 Core Super-Skills/);
  });
});
