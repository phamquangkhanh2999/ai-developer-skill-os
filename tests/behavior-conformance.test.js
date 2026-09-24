import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, '.agents', 'skills');

describe('V10 Skill Compliance', () => {
  const skillFiles = fs.readdirSync(skillsDir)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory())
    .map(d => path.join(skillsDir, d, 'SKILL.md'));

  it('should have exactly 11 skill files', () => {
    expect(skillFiles.length).toBe(11);
  });

  skillFiles.forEach(skillPath => {
    describe(path.basename(path.dirname(skillPath)), () => {
      const content = fs.readFileSync(skillPath, 'utf8');

      it('should have version 10.2.0 in frontmatter', () => {
        expect(content).toContain('version: 10.2.0');
      });

      it('should have platforms field', () => {
        expect(content).toContain('platforms:');
        expect(content).toContain('antigravity');
        expect(content).toContain('claude');
        expect(content).toContain('opencode');
      });

      it('should have runtime_version', () => {
        expect(content).toContain('runtime_version');
      });

      it('should have Platform-Specific Instructions section', () => {
        expect(content).toContain('Platform-Specific Instructions');
      });

      it('should have Compliance section', () => {
        expect(content).toContain('Compliance');
      });

      it('should have Exit Codes section', () => {
        expect(content).toContain('Exit Codes');
      });

      it('should have Confidence Model section', () => {
        expect(content).toContain('Confidence Model');
      });

      it('should have Evidence Format section', () => {
        expect(content).toContain('Evidence Format');
      });
    });
  });
});
