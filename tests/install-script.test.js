import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Antigravity Install Script Logic', () => {
  const scriptPath = path.join(rootDir, 'bin', 'install.js');
  const content = fs.readFileSync(scriptPath, 'utf8');

  it('should support copyRecursiveSync for .agents architecture', () => {
    expect(content).toContain('copyRecursiveSync(sourceDir, targetDir)');
    expect(content).toContain('Copied .agents/');
  });

  it('should support Antigravity global installation & path conversion', () => {
    expect(content).toContain(".gemini', 'config'");
    expect(content).toContain('rewriteAbsolutePaths(targetDir');
  });

  it('exposes Antigravity as its only supported installer target', () => {
    expect(content).toContain("antigravity: {");
    expect(content).not.toContain("claude: {");
    expect(content).not.toContain("opencode: {");
    expect(content).toContain('Unsupported platform');
  });

  it('exposes only maintained Antigravity install scripts and validation tooling', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const installScripts = Object.keys(pkg.scripts).filter(name => name.startsWith('install:'));
    expect(installScripts.sort()).toEqual(['install:antigravity', 'install:antigravity:local']);
    expect(pkg.scripts['sync:v10']).toBeUndefined();
    for (const obsoleteTool of ['sync-versions.js', 'run-aar.js', 'generate-evaluation-cases.cjs']) {
      expect(fs.existsSync(path.join(rootDir, 'tooling', obsoleteTool))).toBe(false);
    }
  });

  it('should support version detection and upgrade prompt', () => {
    expect(content).toContain('getInstalledVersion');
    expect(content).toContain('backupExistingInstall');
    expect(content).toContain('writeVersionMarker');
    expect(content).toContain('--force');
  });

  it('should write version marker after successful install', () => {
    expect(content).toContain('VERSION_FILE');
    expect(content).toContain('.ai-skill-os-version');
  });
});
