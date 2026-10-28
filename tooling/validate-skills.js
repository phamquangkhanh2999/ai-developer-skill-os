import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_SKILLS_DIR = path.join(DEFAULT_ROOT_DIR, '.agents/skills');

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

export function validateSkillContent(content, filePath, rootDir = DEFAULT_ROOT_DIR) {
  const errors = [];
  const yamlString = extractFrontmatter(content);

  if (!yamlString) {
    errors.push(`Missing frontmatter in ${filePath}`);
    return { valid: false, errors, meta: null };
  }

  let meta;
  try {
    meta = yaml.load(yamlString);
  } catch (err) {
    errors.push(`Invalid YAML frontmatter in ${filePath}: ${err.message}`);
    return { valid: false, errors, meta: null };
  }

  if (!meta || typeof meta !== 'object') {
    errors.push(`Frontmatter must be an object in ${filePath}`);
    return { valid: false, errors, meta: null };
  }

  // 1. Name validation
  if (!meta.name || typeof meta.name !== 'string' || !meta.name.trim()) {
    errors.push(`Missing or invalid name in ${filePath}`);
  }

  // 2. Version validation (semver)
  if (!meta.version || typeof meta.version !== 'string' || !SEMVER_REGEX.test(meta.version)) {
    errors.push(`Invalid semver version "${meta.version}" in ${filePath}`);
  }

  // 3. Platforms validation
  const requiredPlatforms = ['antigravity', 'claude', 'opencode'];
  if (!Array.isArray(meta.platforms)) {
    errors.push(`Missing platforms array in ${filePath}`);
  } else {
    for (const p of requiredPlatforms) {
      if (!meta.platforms.includes(p)) {
        errors.push(`Missing required platform "${p}" in ${filePath}`);
      }
    }
  }

  // 4. Runtime version
  if (meta.runtime_version === undefined || meta.runtime_version === null) {
    errors.push(`Missing runtime_version in ${filePath}`);
  }

  // 5. Workflow validation
  if (!meta.workflow || typeof meta.workflow !== 'string') {
    errors.push(`Missing workflow in ${filePath}`);
  } else {
    const workflowBase = meta.workflow.endsWith('.yml') || meta.workflow.endsWith('.yaml')
      ? meta.workflow
      : `${meta.workflow}.yml`;
    const workflowPath = path.join(rootDir, '.agents', 'workflows', workflowBase);
    if (!fs.existsSync(workflowPath)) {
      errors.push(`Referenced workflow "${meta.workflow}" does not exist at ${workflowPath} (in ${filePath})`);
    }
  }

  // 6. Triggers validation
  if (!meta.triggers || (!Array.isArray(meta.triggers) && typeof meta.triggers !== 'string')) {
    errors.push(`Missing triggers in ${filePath}`);
  }

  // 7. Rules validation
  if (!meta.rules) {
    errors.push(`Missing rules in ${filePath}`);
  }

  // 8. References validation (optional array of paths relative to skill directory)
  if (meta.references !== undefined) {
    if (!Array.isArray(meta.references)) {
      errors.push(`Field "references" must be an array in ${filePath}`);
    } else {
      const skillDir = path.dirname(filePath);
      for (const ref of meta.references) {
        if (typeof ref !== 'string') {
          errors.push(`Reference "${ref}" must be a string path in ${filePath}`);
          continue;
        }
        const resolvedRef = path.resolve(skillDir, ref);
        const relToRoot = path.relative(rootDir, resolvedRef);

        if (relToRoot.startsWith('..') || path.isAbsolute(ref)) {
          errors.push(`Reference path traversal outside root: "${ref}" in ${filePath}`);
        } else if (!fs.existsSync(resolvedRef)) {
          errors.push(`Referenced file does not exist: "${ref}" (resolved: ${resolvedRef}) in ${filePath}`);
        }
      }
    }
  }

  // 9. Shared contract compliance check
  // Either references global rules OR has legacy sections
  const hasGlobalRule = (Array.isArray(meta.rules) && meta.rules.includes('global')) ||
                        content.includes('global.md') ||
                        content.includes('.agents/rules/global');
  const hasLegacySections = content.includes('Compliance') &&
                            (content.includes('Exit Codes') || content.includes('Thoái Ra Mã')) &&
                            (content.includes('Confidence Model') || content.includes('Độ Tin Cậy')) &&
                            (content.includes('Evidence Format') || content.includes('Bằng Chứng'));

  if (!hasGlobalRule && !hasLegacySections) {
    errors.push(`Missing shared contract compliance (must reference global rules or define contract sections) in ${filePath}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    meta
  };
}

export function validateSkillsDir(skillsDir = DEFAULT_SKILLS_DIR, rootDir = DEFAULT_ROOT_DIR) {
  if (!fs.existsSync(skillsDir)) {
    console.error('Skills directory not found:', skillsDir);
    return { valid: false, errors: [`Skills directory not found: ${skillsDir}`], count: 0 };
  }

  const skillDirs = fs.readdirSync(skillsDir)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory());

  let totalScanned = 0;
  let validCount = 0;
  const allErrors = [];

  for (const dir of skillDirs) {
    const skillFile = path.join(skillsDir, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      allErrors.push(`Missing SKILL.md in directory ${dir}`);
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    const result = validateSkillContent(content, skillFile, rootDir);
    totalScanned++;

    if (result.valid) {
      validCount++;
    } else {
      for (const err of result.errors) {
        allErrors.push(err);
        console.warn(`[WARN] ${err}`);
      }
    }
  }

  console.log(`\nSkills scanned: ${totalScanned}`);
  console.log(`\nValid:`);
  console.log(`${validCount}/${totalScanned}`);
  console.log(`\nMissing required / errors:`);
  console.log(`${allErrors.length}`);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    totalScanned,
    validCount
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = validateSkillsDir();
  if (!result.valid) {
    process.exit(1);
  }
}
