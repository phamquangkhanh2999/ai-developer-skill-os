import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Shared Policy and Adapter Specification', () => {
  const globalPath = path.join(rootDir, '.agents/rules/global.md');
  const geminiPath = path.join(rootDir, 'GEMINI.md');
  const promptCompilerPath = path.join(rootDir, '.agents/rules/prompt-compiler.md');
  const prioritiesPath = path.join(rootDir, '.agents/rules/priorities.yml');

  it('global.md satisfies line budget (<= 160 lines)', () => {
    const lines = fs.readFileSync(globalPath, 'utf8').split('\n');
    expect(lines.length).toBeLessThanOrEqual(160);
  });

  it('global.md contains 5 mandatory fields for bug reports', () => {
    const content = fs.readFileSync(globalPath, 'utf8');
    // 1. Problem / conditions
    expect(content).toMatch(/điều kiện|lỗi và điều kiện/i);
    // 2. Cause + evidence
    expect(content).toMatch(/nguyên nhân|root cause/i);
    expect(content).toMatch(/bằng chứng|evidence/i);
    // 3. What changed + location
    expect(content).toMatch(/sửa gì|vị trí thay đổi/i);
    // 4. Why the change eliminates the cause
    expect(content).toMatch(/vì sao thay đổi|loại bỏ nguyên nhân/i);
    // 5. Verification commands + results
    expect(content).toMatch(/kiểm chứng|verification/i);
  });

  it('global.md specifies evidence-based statuses: VERIFIED, PARTIAL, BLOCKED, FAILED', () => {
    const content = fs.readFileSync(globalPath, 'utf8');
    expect(content).toContain('VERIFIED');
    expect(content).toContain('PARTIAL');
    expect(content).toContain('BLOCKED');
    expect(content).toContain('FAILED');
  });

  it('global.md strictly forbids auto-creating .ai-local/ memory without explicit user request', () => {
    const content = fs.readFileSync(globalPath, 'utf8');
    expect(content).toMatch(/không tự (ý )?tạo.*(\.ai-local|memory)/i);
  });

  it('global.md recognizes user authority: no autonomous publish/deploy', () => {
    const content = fs.readFileSync(globalPath, 'utf8');
    expect(content).toMatch(/không tự (ý )?(publish|deploy)/i);
  });

  it('GEMINI.md satisfies line budget (<= 60 lines)', () => {
    const lines = fs.readFileSync(geminiPath, 'utf8').split('\n');
    expect(lines.length).toBeLessThanOrEqual(60);
  });

  it('GEMINI.md acts as adapter (artifacts, clickable links, slash commands) without hardcoded personal paths', () => {
    const content = fs.readFileSync(geminiPath, 'utf8');
    expect(content).toContain('file:///');
    expect(content).toMatch(/artifact/i);
    expect(content).not.toContain('/home/khanhpq');
    expect(content).not.toMatch(/thay đổi ≥ 2 files/i);
  });

  it('prompt-compiler.md is on-demand, not applies_to: all', () => {
    if (fs.existsSync(promptCompilerPath)) {
      const content = fs.readFileSync(promptCompilerPath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (match) {
        const meta = yaml.load(match[1]);
        expect(meta.applies_to).not.toBe('all');
      }
    }
  });
});
