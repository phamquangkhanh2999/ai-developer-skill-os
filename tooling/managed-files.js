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
  /\.backup-[\d]+$/,
  /\.system-new$/
];

export const V10_RETIRED_FILES_FINGERPRINTS = {
  'skills/qk-product-spec/SKILL.md': 'a3eafcffa626932bcf4702c349056750d3ebdd38db2f35b3a3cd571634dc4bb8',
  'skills/qk-ui-engineer/SKILL.md': '3994fda574ad40551d5c423974c57e5caee617889c709ad070476d60520157df',
  'skills/qk-backend-data/SKILL.md': 'cc3b50dc76f5399f6717e2259a7f748d3ebd39b980945a9b8eb70bee3ce6a67f',
  'skills/qk-api-data-discovery/SKILL.md': '40e8c430ab03acdf5d441fa311d2888fb71f46cd43a5ecabad0d52f7661885d8',
  'skills/qk-api-data-discovery/references/bronze-record-format.md': 'de7b4c3eb2071d9ab58bebd87c4431bed3abd839dc26b29e1d2c8c399e529e18',
  'skills/qk-api-data-discovery/references/data-contract-yaml.md': '1088a859424919f41e635997cfd08f626c453033a8f2e3af7bcb32f648515ade',
  'skills/qk-api-data-discovery/references/discovery-report-template.md': '8ee21b6a80303d0883d8c73b5d425875fdbd89e35ee7df4c300ca7a074be5ea9',
  'skills/qk-prompt-compiler/SKILL.md': '9fcc46abc7238698f8be2e3f8e0c138e68049095187a240beb9d389d56f71a1f',
  'skills/qk-orchestrator/SKILL.md': '11834e5213f5e2c0c024173e1f805670e21d1165dff82a9e75a9d77700b1ef1b',
  'skills/qk-orchestrator/evals/scorecard.yaml': 'e4444f5087921a66ae8ea1b741ae3d883f2cce6616f0eaf85b063e827e490809',
  'skills/qk-orchestrator/references/routing-table.md': '0597eb8f30fe56cc8ca84de7d382e94387d66e3136ae095a7df980c4be62cc33'
};

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
  currentFilesContent = {},
  isLegacyUpgrade = false
}) {
  const write = [...Object.keys(nextManifest?.files || {})];
  const remove = [];
  const preserve = [];
  const conflicts = [];

  const nextFilesSet = new Set(write);
  const prevFiles = previousManifest?.files || (isLegacyUpgrade ? V10_RETIRED_FILES_FINGERPRINTS : null);

  for (const installedFile of installedFiles) {
    const rel = installedFile.replace(/\\/g, '/');
    if (isExcludedFile(rel)) {
      preserve.push(rel);
      continue;
    }

    const currentContent = currentFilesContent[rel];
    const currentSha = currentContent !== undefined ? computeSha256(currentContent) : null;

    if (nextFilesSet.has(rel)) {
      // File exists in both old and new releases
      const hasKnownPrevSha = Boolean(prevFiles && prevFiles[rel]);
      const isKnownModified = hasKnownPrevSha && currentSha && currentSha !== prevFiles[rel];
      // When ownership cannot be proven (no manifest or not in prevFiles), protect existing file if it differs from upstream
      const isUnverifiedOwnership = !hasKnownPrevSha;
      const isDifferentFromNext = isUnverifiedOwnership && currentSha && currentSha !== nextManifest?.files?.[rel];

      if (isKnownModified || isDifferentFromNext) {
        // User modified this file or file pre-existed with unverified ownership! Preserve user version.
        preserve.push(rel);
        conflicts.push(rel);
        const writeIndex = write.indexOf(rel);
        if (writeIndex !== -1) {
          write.splice(writeIndex, 1);
        }
      }
      continue;
    }

    // File is on disk, but not in next manifest
    if (prevFiles && prevFiles[rel]) {
      if (currentSha === prevFiles[rel]) {
        // Unmodified system file -> safe to remove
        remove.push(rel);
      } else {
        // User modified this file -> DO NOT REMOVE! Preserve and report conflict.
        preserve.push(rel);
        conflicts.push(rel);
      }
    } else {
      // Not managed by previous manifest (e.g. user custom file, or unrecognized legacy file) -> preserve
      preserve.push(rel);
      if (rel.startsWith('skills/')) {
        // Legacy or custom skill folder that was not recognized
        conflicts.push(rel);
      }
    }
  }

  return {
    write,
    remove,
    preserve,
    conflicts
  };
}
