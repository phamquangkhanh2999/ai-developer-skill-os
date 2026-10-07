import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
describe('Controlled orchestration workflow contracts', () => {
  for (const name of ['code-review', 'feature-delivery', 'bug-resolution']) {
    it(`${name} wires assignment outputs into execution after scope/design`, () => {
      const workflow = yaml.load(fs.readFileSync(path.join(root, '.agents/workflows', `${name}.yml`), 'utf8'));
      expect(workflow.version).toBe('10.3.0');
      const steps = workflow.steps;
      const index = steps.findIndex(step => step.id === 'orchestration_plan');
      expect(index).toBeGreaterThan(0);
      const outputs = new Set(steps.slice(0, index).flatMap(step => step.outputs || []));
      for (const input of steps[index].inputs) expect(outputs.has(input), input).toBe(true);
      expect(steps[index + 1].inputs).toEqual(expect.arrayContaining(['execution_mode', 'task_assignments']));
      expect(steps.map(step => step.id).length).toBe(new Set(steps.map(step => step.id)).size);
    });
  }
});
