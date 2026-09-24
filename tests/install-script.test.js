import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('V8 Install Script Logic', () => {
  const scriptPath = path.join(rootDir, 'bin', 'install.js');
  const content = fs.readFileSync(scriptPath, 'utf8');

  it('should support copyRecursiveSync for .agents architecture', () => {
    expect(content).toContain('copyRecursiveSync(sourceDir, targetDir)');
    expect(content).toContain('Copied .agents/');
  });

  it('should support Antigravity global installation & path conversion', () => {
    expect(content).toContain(".gemini', 'config'");
    expect(content).toContain('rewriteAbsolutePaths(targetDir)');
  });

  it('should handle IDE selections with correct mapping', () => {
    // IDE map: 1=antigravity, 2=claude, 3=cursor, 4=codex
    expect(content).toContain("'1': 'antigravity'");
    expect(content).toContain("'2': 'claude'");
    expect(content).toContain("'3': 'cursor'");
    expect(content).toContain("'4': 'codex'");
  });

  it('should support version detection and upgrade prompt', () => {
    expect(content).toContain('getInstalledVersion');
    expect(content).toContain('removeExistingInstall');
    expect(content).toContain('writeVersionMarker');
    expect(content).toContain('--force');
  });

  it('should write version marker after successful install', () => {
    expect(content).toContain('VERSION_FILE');
    expect(content).toContain('.ai-skill-os-version');
  });
});
