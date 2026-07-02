import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');

function parseFrontmatter(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return YAML.load(match[1]);
  } catch {
    return null;
  }
}

function getActiveSkillDirs() {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir)
    .filter(name => !name.startsWith('_') && fs.statSync(path.join(skillsDir, name)).isDirectory())
    .map(name => path.join(skillsDir, name));
}

describe('SKILL.md Spec Compliance', () => {
  const REQUIRED_FIELDS = [
    'name', 'version', 'updated', 'description', 'behavior', 'intent',
    'priority', 'tags', 'platforms', 'trigger', 'inputs', 'outputs',
    'allowed_tools', 'pipeline'
  ];

  const VALID_BEHAVIORS = ['static-analysis', 'development', 'validation', 'maintenance'];
  const VALID_INTENTS = ['review-code', 'fix-bug', 'implement-feature', 'validate', 'maintain'];
  const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];
  const VALID_PIPELINE_STEPS = new Set([
    'analyze', 'plan', 'design', 'implement', 'review', 'validate', 'complete', 'delegate', 'evaluate', 'engineering-standard'
  ]);

  it('every active SKILL.md should have frontmatter', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      expect(fs.existsSync(skillPath)).toBe(true);
      const fm = parseFrontmatter(skillPath);
      expect(fm).not.toBeNull();
    });
  });

  it('every SKILL.md frontmatter should contain all required fields', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      REQUIRED_FIELDS.forEach(field => {
        expect(fm[field], `Missing ${field} in ${path.basename(dir)}/SKILL.md`).toBeDefined();
      });
    });
  });

  it('behavior field should be one of the allowed values', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(VALID_BEHAVIORS).toContain(fm.behavior);
    });
  });

  it('intent field should be one of the allowed values', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(VALID_INTENTS).toContain(fm.intent);
    });
  });

  it('priority field should be one of the allowed values', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(VALID_PRIORITIES).toContain(fm.priority);
    });
  });

  it('pipeline steps should use only allowed verbs', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      const steps = Array.isArray(fm.pipeline) ? fm.pipeline : [fm.pipeline];
      steps.forEach(step => {
        expect(VALID_PIPELINE_STEPS.has(step), `Invalid pipeline step "${step}" in ${path.basename(dir)}`).toBe(true);
      });
    });
  });

  it('name field should match directory name and use qk- prefix', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillName = path.basename(dir);
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(fm.name).toBe(skillName);
      expect(fm.name.startsWith('qk-')).toBe(true);
    });
  });

  it('version should be semver string', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(fm.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('updated should be YYYY-MM-DD', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      const val = typeof fm.updated === 'string' ? fm.updated : new Date(fm.updated).toISOString().split('T')[0];
      expect(val).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('platforms should be an array of valid IDE strings', () => {
    const valid = ['claude-code', 'cursor', 'windsurf', 'gemini-cli'];
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(Array.isArray(fm.platforms)).toBe(true);
      fm.platforms.forEach(p => expect(valid).toContain(p));
    });
  });

  it('tags should be an array of strings', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(Array.isArray(fm.tags)).toBe(true);
      fm.tags.forEach(t => expect(typeof t).toBe('string'));
    });
  });

  it('trigger should be a non-empty string', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(typeof fm.trigger).toBe('string');
      expect(fm.trigger.length).toBeGreaterThan(0);
    });
  });

  it('allowed_tools should be an array of strings', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const fm = parseFrontmatter(skillPath);
      expect(Array.isArray(fm.allowed_tools)).toBe(true);
      fm.allowed_tools.forEach(t => expect(typeof t).toBe('string'));
    });
  });

  it('body should contain required sections', () => {
    const dirs = getActiveSkillDirs();
    dirs.forEach(dir => {
      const skillPath = path.join(dir, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      expect(content).toContain('Goal');
      expect(content).toContain('Chain of Thought');
      expect(content).toContain('Constraints');
      expect(content).toContain('Output Format');
    });
  });

  it('no skill should reference archived version of itself', () => {
    const registryPath = path.join(rootDir, 'skills.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    registry.skills.forEach(skill => {
      expect(skill.path).not.toContain('_archive_old_skills');
    });
  });
});
