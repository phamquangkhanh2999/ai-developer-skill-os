import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { buildRegistryCore } from '../tooling/build-registry.js';
import { validateGraphData } from '../tooling/validate-graph.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

describe('Registry Generation & Graph Validation', () => {
  it('generates 5 independent skills without dependencies successfully with 0 cycles and 0 invalid edges', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
    const skillsDir = path.join(tmpDir, '.agents/skills');
    const registryDir = path.join(tmpDir, '.agents/registry');
    fs.mkdirSync(skillsDir, { recursive: true });

    const skills = ['qk-feature-delivery', 'qk-bug-resolution', 'qk-code-review', 'qk-code-cleaner', 'qk-devops-release'];
    for (const name of skills) {
      const sDir = path.join(skillsDir, name);
      fs.mkdirSync(sDir, { recursive: true });
      fs.writeFileSync(path.join(sDir, 'SKILL.md'), `---
name: ${name}
version: 11.0.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: test
rules: [global]
triggers: [test]
---
# ${name}`);
    }

    const { graph, index } = buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir });
    expect(Object.keys(graph.nodes).length).toBe(5);
    expect(graph.edges.length).toBe(0);
    expect(graph.stats.has_cycles).toBe(false);

    const validation = validateGraphData(graph);
    expect(validation.valid).toBe(true);
    expect(validation.cyclesCount).toBe(0);
    expect(validation.errors.length).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('fails generation when a declared dependency is missing from the skill set', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
    const skillsDir = path.join(tmpDir, '.agents/skills');
    const registryDir = path.join(tmpDir, '.agents/registry');
    fs.mkdirSync(skillsDir, { recursive: true });

    const sDir = path.join(skillsDir, 'qk-skill-a');
    fs.mkdirSync(sDir, { recursive: true });
    fs.writeFileSync(path.join(sDir, 'SKILL.md'), `---
name: qk-skill-a
version: 11.0.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: test
rules: [global]
triggers: [test]
dependencies:
  - qk-non-existent-skill
---
# Content`);

    expect(() => {
      buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir });
    }).toThrow(/dependency/i);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('fails validation when a cycle exists in declared dependencies', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
    const skillsDir = path.join(tmpDir, '.agents/skills');
    const registryDir = path.join(tmpDir, '.agents/registry');
    fs.mkdirSync(skillsDir, { recursive: true });

    const sDirA = path.join(skillsDir, 'qk-skill-a');
    fs.mkdirSync(sDirA, { recursive: true });
    fs.writeFileSync(path.join(sDirA, 'SKILL.md'), `---
name: qk-skill-a
version: 11.0.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: test
rules: [global]
triggers: [test]
dependencies:
  - qk-skill-b
---
# Content`);

    const sDirB = path.join(skillsDir, 'qk-skill-b');
    fs.mkdirSync(sDirB, { recursive: true });
    fs.writeFileSync(path.join(sDirB, 'SKILL.md'), `---
name: qk-skill-b
version: 11.0.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: test
rules: [global]
triggers: [test]
dependencies:
  - qk-skill-a
---
# Content`);

    const { graph } = buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir, allowCycles: true });
    expect(graph.stats.has_cycles).toBe(true);

    const validation = validateGraphData(graph);
    expect(validation.valid).toBe(false);
    expect(validation.cyclesCount).toBeGreaterThan(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('fails generation when frontmatter YAML is corrupted', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
    const skillsDir = path.join(tmpDir, '.agents/skills');
    const registryDir = path.join(tmpDir, '.agents/registry');
    fs.mkdirSync(skillsDir, { recursive: true });

    const sDir = path.join(skillsDir, 'qk-broken');
    fs.mkdirSync(sDir, { recursive: true });
    fs.writeFileSync(path.join(sDir, 'SKILL.md'), `---
name: qk-broken
version: [unclosed array
---
# Broken`);

    expect(() => {
      buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir });
    }).toThrow();

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('generates deterministic output across multiple runs (excluding generated_at timestamp)', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'registry-test-'));
    const skillsDir = path.join(tmpDir, '.agents/skills');
    const registryDir = path.join(tmpDir, '.agents/registry');
    fs.mkdirSync(skillsDir, { recursive: true });

    const sDir = path.join(skillsDir, 'qk-skill-1');
    fs.mkdirSync(sDir, { recursive: true });
    fs.writeFileSync(path.join(sDir, 'SKILL.md'), `---
name: qk-skill-1
version: 11.0.0
status: stable
platforms: [antigravity, claude, opencode]
runtime_version: 1
workflow: test
rules: [global]
triggers: [test]
---
# Content`);

    const run1 = buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir });
    const run2 = buildRegistryCore({ skillsDir, registryDir, rootDir: tmpDir });

    const g1 = { ...run1.graph, generated_at: null };
    const g2 = { ...run2.graph, generated_at: null };
    expect(g1).toEqual(g2);

    const i1 = { ...run1.index, generated_at: null };
    const i2 = { ...run2.index, generated_at: null };
    expect(i1).toEqual(i2);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
