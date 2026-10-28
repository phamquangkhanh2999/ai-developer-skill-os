import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import {
  generateManifest,
  planManagedMigration,
  computeSha256,
  MANAGED_MANIFEST_FILE
} from '../tooling/managed-files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Managed Files Manifest & Migration Planner', () => {
  it('computes sha256 correctly', () => {
    const hash = computeSha256('hello world');
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('generates a valid manifest without path traversal and excludes DEV_PROFILE and .ai-local', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
    fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# Agents');
    fs.writeFileSync(path.join(tmp, 'DEV_PROFILE.md'), 'role: fe');
    fs.mkdirSync(path.join(tmp, '.ai-local'), { recursive: true });
    fs.writeFileSync(path.join(tmp, '.ai-local', 'test.txt'), 'memory');

    const manifest = generateManifest(tmp, '11.0.0');
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.packageVersion).toBe('11.0.0');
    expect(manifest.files['AGENTS.md']).toBeDefined();
    expect(manifest.files['DEV_PROFILE.md']).toBeUndefined();
    expect(manifest.files['.ai-local/test.txt']).toBeUndefined();

    for (const file of Object.keys(manifest.files)) {
      expect(file.startsWith('..')).toBe(false);
      expect(file.startsWith('/')).toBe(false);
    }

    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('plans migration: cleanly removes unmodified old files and preserves user custom files', () => {
    const oldHashA = computeSha256('old content A');
    const oldHashB = computeSha256('old content B');

    const previousManifest = {
      schemaVersion: 1,
      packageVersion: '10.3.0',
      files: {
        'fileA.md': oldHashA,
        'retiredSkill/SKILL.md': oldHashB
      }
    };

    const nextManifest = {
      schemaVersion: 1,
      packageVersion: '11.0.0',
      files: {
        'fileA.md': computeSha256('new content A'),
        'newSkill/SKILL.md': computeSha256('new content skill')
      }
    };

    // Case 1: retiredSkill was unmodified
    const plan1 = planManagedMigration({
      previousManifest,
      nextManifest,
      installedFiles: ['fileA.md', 'retiredSkill/SKILL.md', 'custom/agent.md', 'DEV_PROFILE.md'],
      currentFilesContent: {
        'fileA.md': 'old content A',
        'retiredSkill/SKILL.md': 'old content B',
        'custom/agent.md': 'my custom agent',
        'DEV_PROFILE.md': 'private profile'
      }
    });

    expect(plan1.remove).toContain('retiredSkill/SKILL.md');
    expect(plan1.write).toContain('fileA.md');
    expect(plan1.write).toContain('newSkill/SKILL.md');
    expect(plan1.preserve).toContain('custom/agent.md');
    expect(plan1.preserve).toContain('DEV_PROFILE.md');
    expect(plan1.conflicts.length).toBe(0);

    // Case 2: retiredSkill was customized by user (different hash)
    const plan2 = planManagedMigration({
      previousManifest,
      nextManifest,
      installedFiles: ['fileA.md', 'retiredSkill/SKILL.md', 'custom/agent.md'],
      currentFilesContent: {
        'fileA.md': 'old content A',
        'retiredSkill/SKILL.md': 'user customized this old skill',
        'custom/agent.md': 'my custom agent'
      }
    });

    // Should NOT remove user-customized skill!
    expect(plan2.remove).not.toContain('retiredSkill/SKILL.md');
    expect(plan2.preserve).toContain('retiredSkill/SKILL.md');
    expect(plan2.conflicts).toContain('retiredSkill/SKILL.md');
  });

  it('handles upgrade from version without previous manifest (v10 legacy fallback)', () => {
    const nextManifest = {
      schemaVersion: 1,
      packageVersion: '11.0.0',
      files: {
        'AGENTS.md': computeSha256('# New Agents')
      }
    };

    const plan = planManagedMigration({
      previousManifest: null,
      nextManifest,
      installedFiles: ['custom.md', 'DEV_PROFILE.md'],
      currentFilesContent: {
        'custom.md': 'custom',
        'DEV_PROFILE.md': 'profile'
      }
    });

    // When there is no previous manifest to prove ownership, do NOT delete any unknown files
    expect(plan.remove.length).toBe(0);
    expect(plan.preserve).toContain('custom.md');
    expect(plan.preserve).toContain('DEV_PROFILE.md');
    expect(plan.write).toContain('AGENTS.md');
  });
});
