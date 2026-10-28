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

      it('should have a valid semver version', () => {
        const match = content.match(/version:\s*([^\s\r\n]+)/);
        expect(match).not.toBeNull();
        expect(match[1]).toMatch(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/);
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

      it('should have Platform-Specific Instructions section or reference', () => {
        const hasSection = content.includes('Platform-Specific Instructions') || content.includes('rules/global.md');
        expect(hasSection).toBe(true);
      });

      it('should have Compliance section or shared contract reference', () => {
        const hasCompliance = content.includes('Compliance') || content.includes('rules/global.md');
        expect(hasCompliance).toBe(true);
      });

      it('should have Exit Codes section or shared contract reference', () => {
        const hasExitCodes = content.includes('Exit Codes') || content.includes('Thoái Ra Mã') || content.includes('rules/global.md');
        expect(hasExitCodes).toBe(true);
      });

      it('should have Confidence Model section or shared contract reference', () => {
        const hasConfidence = content.includes('Confidence Model') || content.includes('Độ Tin Cậy') || content.includes('rules/global.md');
        expect(hasConfidence).toBe(true);
      });

      it('should have Evidence Format section or shared contract reference', () => {
        const hasEvidence = content.includes('Evidence Format') || content.includes('Bằng Chứng') || content.includes('rules/global.md');
        expect(hasEvidence).toBe(true);
      });
    });
  });
});
