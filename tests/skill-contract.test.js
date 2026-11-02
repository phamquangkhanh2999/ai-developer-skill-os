import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { validateSkillContent, validateSkillsDir } from '../tooling/validate-skills.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, '.agents', 'skills');

describe('Skill Contract Specification', () => {
  const skillDirs = fs.readdirSync(skillsDir)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory());

  it('should have the expected number of active core skills (5 after cutover)', () => {
    expect(skillDirs.length).toBe(5);
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
      expect(content, `${dir} contains its own execution guidance`).toMatch(/verify|kiểm chứng/i);
      expect(content, `${dir} reports results with evidence`).toMatch(/report|báo cáo/i);
    }
    expect(fs.existsSync(path.join(rootDir, '.agents', 'workflows'))).toBe(false);
  });

  it('retains the defining task contracts after workflow removal', () => {
    const readSkill = name => fs.readFileSync(path.join(skillsDir, name, 'SKILL.md'), 'utf8');
    expect(readSkill('qk-feature-delivery')).toMatch(/plan-only[\s\S]*discovery-only[\s\S]*prompt-only/i);
    expect(readSkill('qk-feature-delivery')).toMatch(/subagent-orchestration\.md/i);
    expect(readSkill('qk-bug-resolution')).toMatch(/Observe[\s\S]*Evidence[\s\S]*Cause[\s\S]*Verify/);
    expect(readSkill('qk-code-review')).toMatch(/Read-Only[\s\S]*file:dòng/i);
    expect(readSkill('qk-code-review')).not.toMatch(/health score|100\s*-\s*\(/i);
    expect(readSkill('qk-code-cleaner')).toMatch(/Zero Behavior Change[\s\S]*Regression Shield/i);
    expect(readSkill('qk-devops-release')).toMatch(/Cấm tự ý Deploy \/ Publish[\s\S]*Rollback/i);
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
  });
});
