import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const MANAGED_MANIFEST_FILE = '.ai-skill-os-managed.json';

const EXCLUDED_PATTERNS = [
  /^\.ai-local/,
  /^DEV_PROFILE\.md$/,
  /^\.git/,
  /^\.ai-skill-os-version$/,
  /^\.ai-skill-os-managed\.json$/,
  /\.backup-[\d]+$/
];

export function computeSha256(contentOrBuffer) {
  return crypto.createHash('sha256').update(contentOrBuffer).digest('hex');
}

export function isExcludedFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return EXCLUDED_PATTERNS.some(re => re.test(normalized));
}

export function generateManifest(sourceDir, packageVersion = '11.0.0') {
  const files = {};

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(sourceDir, fullPath).replace(/\\/g, '/');

      // Security: ensure no path traversal or absolute escape
      if (relPath.startsWith('..') || path.isAbsolute(relPath)) {
        throw new Error(`Path traversal detected in manifest generation: ${relPath}`);
      }

      if (isExcludedFile(relPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath);
        files[relPath] = computeSha256(content);
      }
    }
  }

  walk(sourceDir);

  return {
    schemaVersion: 1,
    packageVersion,
    files
  };
}

export function planManagedMigration({
  previousManifest,
  nextManifest,
  installedFiles = [],
  currentFilesContent = {}
}) {
  const write = Object.keys(nextManifest?.files || {});
  const remove = [];
  const preserve = [];
  const conflicts = [];

  const nextFilesSet = new Set(write);
  const prevFiles = previousManifest?.files || null;

  for (const installedFile of installedFiles) {
    const rel = installedFile.replace(/\\/g, '/');
    if (isExcludedFile(rel)) {
      preserve.push(rel);
      continue;
    }

    if (nextFilesSet.has(rel)) {
      continue;
    }

    // File is on disk, but not in next manifest
    if (prevFiles && prevFiles[rel]) {
      // It was managed in previous release
      const currentContent = currentFilesContent[rel];
      const currentSha = currentContent !== undefined ? computeSha256(currentContent) : null;

      if (currentSha === prevFiles[rel]) {
        // Unmodified system file -> safe to remove
        remove.push(rel);
      } else {
        // User modified this file -> DO NOT REMOVE! Preserve and report conflict.
        preserve.push(rel);
        conflicts.push(rel);
      }
    } else {
      // Not managed by previous manifest (e.g. user custom file, or v10 without manifest) -> preserve
      preserve.push(rel);
    }
  }

  return {
    write,
    remove,
    preserve,
    conflicts
  };
}
