import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluateWriteTarget } from '../.agents/hooks/guard-registry.mjs';
import { evaluateCommand } from '../.agents/hooks/guard-command.mjs';
import { validateHooksFile } from '../tooling/validate-skills.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hooksJsonPath = path.join(root, '.agents', 'hooks.json');
const registryGuardScript = path.join(root, '.agents', 'hooks', 'guard-registry.mjs');
const commandGuardScript = path.join(root, '.agents', 'hooks', 'guard-command.mjs');

function runHookSubprocess(scriptPath, payload) {
  const stdout = execFileSync(process.execPath, [scriptPath], {
    cwd: path.join(root, '.agents'),
    input: JSON.stringify(payload),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  return JSON.parse(stdout.trim());
}

describe('Antigravity Lifecycle Safety Hooks (.agents/hooks.json)', () => {
  it('ships valid hooks.json with registry guard enabled and destructive command guard opt-in', () => {
    const validation = validateHooksFile(hooksJsonPath);
    expect(validation.valid, validation.errors.join(', ')).toBe(true);
    expect(validation.hookCount).toBe(2);

    const parsed = JSON.parse(fs.readFileSync(hooksJsonPath, 'utf8'));
    expect(parsed['qk-registry-guard'].enabled).toBe(true);
    expect(parsed['qk-destructive-command-guard'].enabled).toBe(false);
  });

  it('validator rejects invalid hook events and missing hook scripts', () => {
    const tmpHooks = path.join(root, '.agents', 'hooks.invalid-test.json');
    try {
      fs.writeFileSync(tmpHooks, JSON.stringify({
        broken: {
          PreToolUse: [
            {
              matcher: 'run_command',
              hooks: [{ command: 'node ./hooks/non-existent-script.mjs' }]
            }
          ],
          UnknownEvent: []
        }
      }), 'utf8');
      const res = validateHooksFile(tmpHooks);
      expect(res.valid).toBe(false);
      expect(res.errors.some(e => e.includes('UnknownEvent'))).toBe(true);
      expect(res.errors.some(e => e.includes('non-existent-script.mjs'))).toBe(true);
    } finally {
      fs.rmSync(tmpHooks, { force: true });
    }
  });

  describe('guard-registry.mjs (PreToolUse write_file/edit_file)', () => {
    const workspacePaths = ['/tmp/demo-app'];
    const artifactDirectoryPath = '/tmp/agy-brain/conv-123';

    it('denies direct writes to generated .agents/registry, global registry, and plugin registry files (including relative paths via payload.cwd)', () => {
      for (const blockedPath of [
        '/tmp/demo-app/.agents/registry/index.yaml',
        '/tmp/demo-app/.agents/registry/graph.json',
        '/home/dev/.gemini/config/registry/index.yaml',
        '/home/dev/.gemini/config/plugins/qk-skill-os/registry/graph.json'
      ]) {
        const res = runHookSubprocess(registryGuardScript, {
          workspacePaths,
          artifactDirectoryPath,
          toolCall: { name: 'edit_file', args: { Path: blockedPath } }
        });
        expect(res.decision, blockedPath).toBe('deny');
        expect(res.reason).toContain('build-registry.js');
      }

      const relRes = evaluateWriteTarget({
        cwd: '/tmp/demo-app',
        workspacePaths,
        artifactDirectoryPath,
        toolCall: { name: 'write_file', args: { Path: '.agents/registry/index.yaml' } }
      });
      expect(relRes.decision).toBe('deny');
    });

    it('allows normal workspace files and artifact files without false positives on app registry folders', () => {
      for (const allowedPath of [
        '/tmp/demo-app/.agents/skills/qk-code-review/SKILL.md',
        '/tmp/demo-app/src/registry/index.yaml',
        '/tmp/agy-brain/conv-123/implementation_plan.md'
      ]) {
        const res = runHookSubprocess(registryGuardScript, {
          workspacePaths,
          artifactDirectoryPath,
          toolCall: { name: 'write_file', args: { Path: allowedPath } }
        });
        expect(res.decision, allowedPath).toBe('allow');
      }
    });

    it('returns "ask" (never "allow") for non-workspace paths and sibling prefix boundary paths', () => {
      for (const externalPath of [
        '/etc/hosts',
        '/tmp/demo-app-sibling/secret.txt',
        '/home/dev/.ssh/authorized_keys'
      ]) {
        const res = evaluateWriteTarget({
          workspacePaths,
          artifactDirectoryPath,
          toolCall: { name: 'write_file', args: { Path: externalPath } }
        });
        expect(res.decision, externalPath).toBe('ask');
      }
    });
  });

  describe('guard-command.mjs (PreToolUse run_command)', () => {
    it('returns "force_ask" on high-risk destructive or irreversible commands', () => {
      const dangerousCommands = [
        'git reset --hard HEAD~1',
        'git push origin main --force',
        'git push -f origin feature',
        'git clean -fd',
        'psql -c "DROP TABLE orders;"',
        'psql -c "truncate table audit_logs"',
        'terraform destroy -auto-approve',
        'npm publish --access public',
        'chmod -R 777 ./storage',
        'rm -rf /',
        'rm -rf ~'
      ];

      for (const cmd of dangerousCommands) {
        const res = runHookSubprocess(commandGuardScript, {
          toolCall: { name: 'run_command', args: { CommandLine: cmd } }
        });
        expect(res.decision, cmd).toBe('force_ask');
        expect(res.reason).toContain('safety.md');
      }
    });

    it('returns "ask" (respecting user permission policy without auto-allowing) on normal commands', () => {
      for (const safeCmd of [
        'npm test',
        'node tooling/build-registry.js',
        'rm -rf ./dist',
        'git status -sb'
      ]) {
        const res = evaluateCommand(safeCmd);
        expect(res.decision, safeCmd).toBe('ask');
      }
    });
  });
});
