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

  it('all existing skills should satisfy platforms contract [antigravity, claude, opencode]', () => {
    for (const dir of skillDirs) {
      const skillPath = path.join(skillsDir, dir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      expect(match, `Skill ${dir} missing frontmatter`).not.toBeNull();
      const frontmatter = yaml.load(match[1]);

      expect(frontmatter.platforms).toBeDefined();
      expect(frontmatter.platforms).toContain('antigravity');
      expect(frontmatter.platforms).toContain('claude');
      expect(frontmatter.platforms).toContain('opencode');
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
platforms: [antigravity, claude, opencode]
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
platforms: [antigravity, claude, opencode]
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

    it('fails when referenced workflow does not exist', () => {
      const invalid = `---
name: qk-test-skill
version: 10.3.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: non-existent-workflow-xyz
rules: [global]
triggers: [test]
---
# Content`;
      const result = validateSkillContent(invalid, '/dummy/SKILL.md', rootDir);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('workflow'))).toBe(true);
    });

    it('fails when reference does not exist or traverses out of package root', () => {
      const missingRef = `---
name: qk-test-skill
version: 10.3.0
status: stable
platforms: [antigravity, claude, opencode]
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
platforms: [antigravity, claude, opencode]
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
