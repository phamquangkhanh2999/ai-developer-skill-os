#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GENERATED_REGISTRY_RE = /(?:^|\/)(?:\.agents|\.gemini\/config|plugins\/qk-skill-os)\/registry\/(?:index\.yaml|graph\.json)$/;

function isWithinRoot(targetPath, rootPath) {
  if (!rootPath || typeof rootPath !== 'string') return false;
  const resolvedTarget = path.resolve(targetPath);
  const resolvedRoot = path.resolve(rootPath);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}

export function evaluateWriteTarget(payload) {
  if (!payload || typeof payload !== 'object') {
    return { decision: 'ask', reason: 'Invalid hook payload; deferring to Antigravity permissions.' };
  }

  const args = payload.toolCall?.args || {};
  const rawPath = args.Path ?? args.TargetFile ?? args.path ?? args.targetFile;
  if (typeof rawPath !== 'string' || !rawPath.trim()) {
    return { decision: 'ask' };
  }

  const baseCwd = typeof payload.cwd === 'string' && payload.cwd.trim() ? payload.cwd : process.cwd();
  const resolvedTarget = path.isAbsolute(rawPath) ? path.resolve(rawPath) : path.resolve(baseCwd, rawPath);
  const normalizedPosix = resolvedTarget.replace(/\\/g, '/');
  if (GENERATED_REGISTRY_RE.test(normalizedPosix)) {
    return {
      decision: 'deny',
      reason: 'Không sửa tay các file sinh tự động trong registry/ (index.yaml, graph.json). Hãy cập nhật SKILL.md rồi chạy `node tooling/build-registry.js`.'
    };
  }

  const workspacePaths = Array.isArray(payload.workspacePaths) ? payload.workspacePaths : [];
  const artifactDir = typeof payload.artifactDirectoryPath === 'string' ? payload.artifactDirectoryPath : '';

  const inAllowedScope =
    workspacePaths.some((ws) => isWithinRoot(resolvedTarget, ws)) ||
    (artifactDir.length > 0 && isWithinRoot(resolvedTarget, artifactDir));

  if (inAllowedScope) {
    return { decision: 'allow' };
  }

  return {
    decision: 'ask',
    reason: 'Đường dẫn nằm ngoài workspace hiện hành; chuyển về cơ chế xin quyền của Antigravity.'
  };
}

function main() {
  try {
    const raw = fs.readFileSync(0, 'utf8').trim();
    const payload = raw ? JSON.parse(raw) : null;
    const result = evaluateWriteTarget(payload);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch {
    process.stdout.write(`${JSON.stringify({ decision: 'ask' })}\n`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
