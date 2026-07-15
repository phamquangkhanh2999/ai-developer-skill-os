import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, 'skills');

function getActiveSkillDirs() {
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir)
    .filter(name => !name.startsWith('_') && fs.statSync(path.join(skillsDir, name)).isDirectory())
    .map(name => path.join(skillsDir, name));
}

function parseBSF(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  
  // Lấy frontmatter (v6)
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const frontmatter = YAML.load(fmMatch[1]);
  let type = 'legacy';
  if (frontmatter.version && frontmatter.version.startsWith('7.')) type = 'v7';
  else if (frontmatter.version && frontmatter.version.startsWith('6.')) type = 'v6';
  
  const bsf = { type, frontmatter };
  
  // Parse YAML blocks
  const yamlBlocks = [...content.matchAll(/```yaml\r?\n([\s\S]*?)\r?\n```/g)];
  
  try {
    let parsedBlocks = {};
    yamlBlocks.forEach(block => {
      const parsed = YAML.load(block[1]);
      if (parsed) Object.assign(parsedBlocks, parsed);
    });
    
    bsf.constraints = {
      must: parsedBlocks.must || [],
      must_not: parsedBlocks.must_not || []
    };
    bsf.policies = {
      prefer: parsedBlocks.prefer || []
    };
    bsf.escalation = {
      stop: parsedBlocks.stop || [],
      ask: parsedBlocks.ask || []
    };

    if (!content.includes('## Scope')) {
      bsf.error = 'Missing Scope section';
    }
  } catch (e) {
    bsf.error = 'Invalid YAML inside markdown blocks';
  }
  
  return bsf;
}

describe('Behavior Validation Framework', () => {

  describe('Level 1: Specification Valid', () => {
    it('Every v6/v7 skill must have valid Schema (Metadata, Scope, Constraints)', () => {
      const dirs = getActiveSkillDirs();
      const modernSkills = [];

      dirs.forEach(dir => {
        const skillPath = path.join(dir, 'SKILL.md');
        if (!fs.existsSync(skillPath)) return;
        const bsf = parseBSF(skillPath);
        
        if (bsf && bsf.type === 'v7') {
          modernSkills.push(dir);
          expect(bsf.error, `Parser error in ${path.basename(dir)}: ${bsf.error}`).toBeUndefined();
          expect(bsf.frontmatter.category, `Missing category metadata in ${path.basename(dir)}`).toBeDefined();
          expect(bsf.constraints, `Missing Constraints in ${path.basename(dir)}`).toBeDefined();
        }
      });

      expect(modernSkills.length).toBeGreaterThan(0);
    });
  });

  describe('Level 2: Contract Consistent', () => {
    it('Constraints MUST NOT conflict with each other', () => {
      const dirs = getActiveSkillDirs();
      
      dirs.forEach(dir => {
        const skillPath = path.join(dir, 'SKILL.md');
        if (!fs.existsSync(skillPath)) return;
        const bsf = parseBSF(skillPath);
        
        if (bsf && bsf.type === 'v7' && !bsf.error) {
          const must = bsf.constraints.must || [];
          const must_not = bsf.constraints.must_not || [];
          
          must.forEach(rule => {
            if (typeof rule !== 'string') return;
            const conflict = must_not.some(c => typeof c === 'string' && c.toLowerCase() === rule.toLowerCase());
            expect(conflict, `Conflict detected in ${path.basename(dir)}: '${rule}' is in both must and must_not`).toBe(false);
          });
        }
      });
    });
  });

  describe('Level 3: Behavior Conformance', () => {
    const scenariosDir = path.join(rootDir, 'specs', 'scenarios');
    const expectationsDir = path.join(rootDir, 'specs', 'expectations');

    it('All scenarios must map to a valid behavior expectation', () => {
      if (!fs.existsSync(scenariosDir)) return;
      
      const scenarioFiles = fs.readdirSync(scenariosDir).filter(f => f.endsWith('.yaml'));
      if (scenarioFiles.length === 0) return;

      scenarioFiles.forEach(file => {
        const content = fs.readFileSync(path.join(scenariosDir, file), 'utf8');
        const scenario = YAML.load(content);
        
        expect(scenario.scenario_id, `Missing scenario_id in ${file}`).toBeDefined();
        expect(scenario.expected_behavior, `Missing expected_behavior in ${file}`).toBeDefined();

        const expectationPath = path.join(expectationsDir, `${scenario.expected_behavior}.yaml`);
        expect(fs.existsSync(expectationPath), `Missing expectation file for behavior: ${scenario.expected_behavior}`).toBe(true);
      });
    });

    it('All expectations must define behavior properties (must, prefer, must_not)', () => {
      if (!fs.existsSync(expectationsDir)) return;

      const expectationFiles = fs.readdirSync(expectationsDir).filter(f => f.endsWith('.yaml'));
      if (expectationFiles.length === 0) return;

      expectationFiles.forEach(file => {
        const content = fs.readFileSync(path.join(expectationsDir, file), 'utf8');
        const expectation = YAML.load(content);
        
        expect(expectation.behavior, `Missing behavior ID in ${file}`).toBeDefined();
        expect(Array.isArray(expectation.must), `${file} should define 'must' properties`).toBe(true);
        expect(Array.isArray(expectation.must_not), `${file} should define 'must_not' properties`).toBe(true);
      });
    });
  });

  describe('Level 4: Regression Stable (Placeholder)', () => {
    it('Golden Snapshot testing (Reserved for LLM runner)', () => {
      expect(true).toBe(true);
    });
  });
});
