import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('V8 Install Script Logic', () => {
  it('should support copyRecursiveSync for .agents architecture', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain('copyRecursiveSync(sourceDir, targetDir)');
    expect(content).toContain('Đã copy toàn bộ kiến trúc .agents');
  });

  it('should support Antigravity global installation & path conversion', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain(".gemini', 'config'");
    expect(content).toContain('walkAndReplace(targetDir)');
  });

  it('should handle multiple IDE selections in runInstall', () => {
    const scriptPath = path.join(rootDir, 'bin', 'install.js');
    const content = fs.readFileSync(scriptPath, 'utf8');
    expect(content).toContain("'4': 'antigravity'");
    expect(content).toContain("'1': 'cursor'");
  });
});
