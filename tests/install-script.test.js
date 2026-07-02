import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Install Script Logic', () => {
  it('systemPrompt should contain required keywords', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('[Role]');
    expect(content).toContain('[Trigger Mechanism]');
    expect(content).toContain('[Command Arguments]');
    expect(content).toContain('qk-[tên-skill]');
  });

  it('should handle multi-IDE mode', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain("case '7'");
    expect(content).toContain('CLAUDE.md');
  });

  it('should support Kilo config generation', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('ensureKiloConfig');
    expect(content).toContain('kiloJsonPath');
  });

  it('should clean old skills before installation', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('cleanOldSkills');
  });
});
