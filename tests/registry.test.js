import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');
const registryPath = path.join(rootDir, 'skills.json');

/**
 * Parse YAML frontmatter from a SKILL.md file.
 * Returns the frontmatter object or null if invalid/missing.
 */
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

/**
 * Read all active skill directories (excluding archives).
 */
function getActiveSkillDirs() {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir)
    .filter(name => !name.startsWith('_') && fs.statSync(path.join(skillsDir, name)).isDirectory())
    .map(name => path.join(skillsDir, name));
}

describe('Skill Registry Integrity', () => {
  it('should have skills.json present', () => {
    expect(fs.existsSync(registryPath)).toBe(true);
  });

  it('should be valid JSON', () => {
    const raw = fs.readFileSync(registryPath, 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it('registry skills count should match active skill directories', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const activeDirs = getActiveSkillDirs();
    const registryNames = registry.skills.map(s => s.name);
    const dirNames = activeDirs.map(d => path.basename(d));

    expect(registryNames.length).toBe(dirNames.length);
    dirNames.forEach(name => {
      expect(registryNames).toContain(name);
    });
  });

  it('every registry skill should have a valid SKILL.md file', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    registry.skills.forEach(skill => {
      const skillPath = path.join(rootDir, skill.path);
      expect(fs.existsSync(skillPath)).toBe(true);
    });
  });

  it('should have correct platforms (no invalid IDE names)', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const validPlatforms = ['antigravity', 'claude-code', 'cursor', 'windsurf', 'kilo-code'];
    registry.skills.forEach(skill => {
      skill.platforms.forEach(p => {
        expect(validPlatforms).toContain(p);
      });
    });
  });

  it('should have no duplicate skill names', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const names = registry.skills.map(s => s.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('categories should map to existing skills', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const allSkills = new Set(registry.skills.map(s => s.name));
    Object.entries(registry.categories).forEach(([cat, skills]) => {
      skills.forEach(s => {
        expect(allSkills.has(s)).toBe(true);
      });
    });
  });

  it('knowledge references should exist', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (registry.knowledge) {
      registry.knowledge.forEach(k => {
        expect(fs.existsSync(path.join(rootDir, k))).toBe(true);
      });
    }
  });

  it('template references should exist', () => {
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (registry.templates) {
      registry.templates.forEach(t => {
        expect(fs.existsSync(path.join(rootDir, t))).toBe(true);
      });
    }
  });
});
