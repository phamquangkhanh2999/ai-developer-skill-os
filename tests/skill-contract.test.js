import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { validateSkillContent, validateSkillsDir, validateRuleContent, MAX_RULE_FILE_BYTES } from '../tooling/validate-skills.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, '.agents', 'skills');

describe('Skill Contract Specification', () => {
  const skillDirs = fs.readdirSync(skillsDir)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory());

  it('should have the expected number of active core skills (5 after cutover) and no _template in .agents/skills', () => {
    expect(skillDirs.length).toBe(5);
    expect(fs.existsSync(path.join(skillsDir, '_template'))).toBe(false);
    expect(fs.existsSync(path.join(rootDir, '.agents/docs/templates/SKILL.template.md'))).toBe(true);
  });

  it('all existing skills should reference only rules that exist in .agents/rules/', () => {
    for (const dir of skillDirs) {
      const skillPath = path.join(skillsDir, dir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const result = validateSkillContent(content, skillPath, rootDir);
      expect(result.valid, `Skill ${dir} failed validation: ${result.errors.join(', ')}`).toBe(true);
      for (const ruleName of result.meta.rules) {
        expect(fs.existsSync(path.join(rootDir, '.agents/rules', `${ruleName}.md`)), `Missing rule ${ruleName}.md in ${dir}`).toBe(true);
      }
    }
  });

  it('all existing skills should satisfy the Antigravity-only platform contract', () => {
    for (const dir of skillDirs) {
      const skillPath = path.join(skillsDir, dir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      expect(match, `Skill ${dir} missing frontmatter`).not.toBeNull();
      const frontmatter = yaml.load(match[1]);

      expect(frontmatter.platforms).toBeDefined();
      expect(frontmatter.platforms).toEqual(['antigravity']);
    }
  });

  it('core skills are self-contained and do not depend on a workflow YAML tree', () => {
    for (const dir of skillDirs) {
      const skillPath = path.join(skillsDir, dir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const frontmatter = yaml.load(match[1]);
      expect(frontmatter.workflow, `${dir} must not require a workflow file`).toBeUndefined();
      expect(content, `${dir} delegates verification to the shared contract`).toContain('../../rules/global.md');
      expect(content, `${dir} reports results with evidence`).toMatch(/report|báo cáo/i);
    }
    expect(fs.existsSync(path.join(rootDir, '.agents', 'workflows'))).toBe(false);
  });

  it('publishes non-code modes, two-speed iterative execution, and a shared verification contract', () => {
    const feature = fs.readFileSync(path.join(skillsDir, 'qk-feature-delivery', 'SKILL.md'), 'utf8');
    const bug = fs.readFileSync(path.join(skillsDir, 'qk-bug-resolution', 'SKILL.md'), 'utf8');
    const cleaner = fs.readFileSync(path.join(skillsDir, 'qk-code-cleaner', 'SKILL.md'), 'utf8');
    for (const mode of ['plan-only', 'discovery-only', 'prompt-only', 'build']) expect(feature).toContain(mode);
    for (const content of [feature, bug, cleaner]) {
      expect(content).toContain('Tầng 1');
      expect(content.toLowerCase()).toContain('checkpoint');
    }
    for (const dir of skillDirs) {
      const content = fs.readFileSync(path.join(skillsDir, dir, 'SKILL.md'), 'utf8');
      expect(content).toContain('../../rules/global.md');
      expect(content).not.toContain('`VERIFIED`');
    }
  });

  it('all existing skills with references should resolve within project root without path traversal', () => {
    for (const dir of skillDirs) {
      const skillDir = path.join(skillsDir, dir);
      const skillPath = path.join(skillDir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match) continue;
      const frontmatter = yaml.load(match[1]);

      if (frontmatter.references && Array.isArray(frontmatter.references)) {
        for (const ref of frontmatter.references) {
          const resolvedPath = path.resolve(skillDir, ref);
          const relativeToRoot = path.relative(rootDir, resolvedPath);
          expect(relativeToRoot.startsWith('..')).toBe(false);
          expect(fs.existsSync(resolvedPath), `Reference ${ref} in ${dir} does not exist`).toBe(true);
        }
      }
    }
  });

  describe('Validator edge cases and fixtures', () => {
    it('fails when frontmatter is missing name', () => {
      const invalid = `---
version: 10.3.0
status: stable
platforms: [antigravity]
runtime_version: 1
workflow: feature-delivery
rules: [global]
triggers: [test]
---
# Content`;
      const result = validateSkillContent(invalid, '/dummy/SKILL.md', rootDir);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    it('fails when version is invalid semver', () => {
      const invalid = `---
name: qk-test-skill
version: not-a-semver
status: stable
platforms: [antigravity]
runtime_version: 1
workflow: feature-delivery
rules: [global]
triggers: [test]
---
# Content`;
      const result = validateSkillContent(invalid, '/dummy/SKILL.md', rootDir);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('version') || e.includes('semver'))).toBe(true);
    });

    it('does not require non-native workflow YAML metadata', () => {
      const invalid = `---
name: qk-test-skill
version: 10.3.0
status: stable
platforms: [antigravity]
runtime_version: 1
rules: [global]
triggers: [test]
---
# Content`;
      const result = validateSkillContent(invalid, '/dummy/SKILL.md', rootDir);
      expect(result.valid).toBe(true);
    });

    it('fails when reference does not exist or traverses out of package root', () => {
      const missingRef = `---
name: qk-test-skill
version: 10.3.0
status: stable
platforms: [antigravity]
runtime_version: 1
workflow: feature-delivery
rules: [global]
triggers: [test]
references:
  - ../../references/missing-reference-file.md
---
# Content`;
      const resultMissing = validateSkillContent(missingRef, path.join(skillsDir, 'qk-test', 'SKILL.md'), rootDir);
      expect(resultMissing.valid).toBe(false);
      expect(resultMissing.errors.some(e => e.includes('reference') || e.includes('missing-reference-file'))).toBe(true);

      const traversalRef = `---
name: qk-test-skill
version: 10.3.0
status: stable
platforms: [antigravity]
runtime_version: 1
workflow: feature-delivery
rules: [global]
triggers: [test]
references:
  - ../../../../../../etc/passwd
---
# Content`;
      const resultTraversal = validateSkillContent(traversalRef, path.join(skillsDir, 'qk-test', 'SKILL.md'), rootDir);
      expect(resultTraversal.valid).toBe(false);
      expect(resultTraversal.errors.some(e => e.includes('traversal') || e.includes('reference'))).toBe(true);
    });

    it('rejects invalid status enum and descriptions longer than 240 characters', () => {
      const longDesc = 'x'.repeat(241);
      const invalid = `---
name: qk-test-skill
version: 13.0.0
status: retired-invalid
description: "${longDesc}"
platforms: [antigravity]
runtime_version: 1
rules: [global]
triggers: [test]
---
# Content`;
      const res = validateSkillContent(invalid, '/dummy/SKILL.md', rootDir);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes('status'))).toBe(true);
      expect(res.errors.some(e => e.includes('240'))).toBe(true);
    });

    it('rejects duplicate triggers and directory-name mismatches across skills', () => {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qk-dup-triggers-'));
      try {
        const s1 = path.join(tmp, 'qk-alpha');
        const s2 = path.join(tmp, 'qk-beta');
        fs.mkdirSync(s1, { recursive: true });
        fs.mkdirSync(s2, { recursive: true });

        fs.writeFileSync(path.join(s1, 'SKILL.md'), `---
name: qk-alpha
version: 13.0.0
status: stable
description: "Alpha skill"
platforms: [antigravity]
runtime_version: 1
rules: [global]
triggers: ["shared trigger"]
---
# Alpha`);
        fs.writeFileSync(path.join(s2, 'SKILL.md'), `---
name: qk-wrong-name
version: 13.0.0
status: stable
description: "Beta skill"
platforms: [antigravity]
runtime_version: 1
rules: [global]
triggers: ["SHARED TRIGGER"]
---
# Beta`);

        const res = validateSkillsDir(tmp, rootDir);
        expect(res.valid).toBe(false);
        expect(res.errors.some(e => e.includes('Duplicate trigger'))).toBe(true);
        expect(res.errors.some(e => e.includes('must match directory'))).toBe(true);
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    });

    it('rejects rule files exceeding Antigravity 24KB per-file limit', () => {
      const oversized = `---\ntrigger: model_decision\ndescription: "Oversized rule"\n---\n${'a'.repeat(MAX_RULE_FILE_BYTES + 10)}`;
      const res = validateRuleContent(oversized, 'oversized.md');
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes('24KB'))).toBe(true);
    });
  });
});
