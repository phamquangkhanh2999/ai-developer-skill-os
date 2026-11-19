import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_SKILLS_DIR = path.join(DEFAULT_ROOT_DIR, '.agents/skills');
const DEFAULT_RULES_DIR = path.join(DEFAULT_ROOT_DIR, '.agents/rules');
const DEFAULT_HOOKS_FILE = path.join(DEFAULT_ROOT_DIR, '.agents/hooks.json');

const SUPPORTED_RULE_TRIGGERS = new Set(['always_on', 'model_decision', 'glob', 'manual']);
const VALID_SKILL_STATUSES = new Set(['stable', 'experimental', 'deprecated']);
const SUPPORTED_HOOK_EVENTS = new Set([
  'SessionStart',
  'PreToolUse',
  'PostToolUse',
  'PreInvocation',
  'PostInvocation',
  'Stop'
]);
const GROUPED_HOOK_EVENTS = new Set(['PreToolUse', 'PostToolUse']);

const SKILL_NAME_REGEX = /^qk-[a-z0-9-]+$/;
const MAX_DESCRIPTION_LENGTH = 240;
export const MAX_RULE_FILE_BYTES = 24000;
export const MAX_ALWAYS_ON_BYTES = 16000;

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
  } else if (!SKILL_NAME_REGEX.test(meta.name.trim())) {
    errors.push(`Skill name "${meta.name}" must match ${SKILL_NAME_REGEX} in ${filePath}`);
  }

  // 2. Version validation (semver)
  if (!meta.version || typeof meta.version !== 'string' || !SEMVER_REGEX.test(meta.version)) {
    errors.push(`Invalid semver version "${meta.version}" in ${filePath}`);
  }

  // 2b. Status validation
  if (!meta.status || !VALID_SKILL_STATUSES.has(meta.status)) {
    errors.push(`Missing or invalid status "${meta.status}" (expected stable, experimental, or deprecated) in ${filePath}`);
  }

  // 2c. Description length check when present
  if (meta.description !== undefined) {
    if (typeof meta.description !== 'string' || !meta.description.trim()) {
      errors.push(`Field "description" must be a non-empty string in ${filePath}`);
    } else if (meta.description.trim().length > MAX_DESCRIPTION_LENGTH) {
      errors.push(`Field "description" exceeds ${MAX_DESCRIPTION_LENGTH} characters (${meta.description.trim().length}) in ${filePath}`);
    }
  }

  // 3. Platforms validation
  const requiredPlatforms = ['antigravity'];
  if (!Array.isArray(meta.platforms)) {
    errors.push(`Missing platforms array in ${filePath}`);
  } else {
    for (const p of requiredPlatforms) {
      if (!meta.platforms.includes(p)) errors.push(`Missing required platform "${p}" in ${filePath}`);
    }
    if (meta.platforms.length !== 1 || meta.platforms.some(platform => !requiredPlatforms.includes(platform))) {
      errors.push(`Unsupported platform metadata in ${filePath}; supported platforms: antigravity only`);
    }
  }

  // 4. Runtime version
  if (meta.runtime_version === undefined || meta.runtime_version === null) {
    errors.push(`Missing runtime_version in ${filePath}`);
  }

  // 5. Triggers validation
  if (!meta.triggers || (!Array.isArray(meta.triggers) && typeof meta.triggers !== 'string')) {
    errors.push(`Missing triggers in ${filePath}`);
  } else if (Array.isArray(meta.triggers) && meta.triggers.length === 0) {
    errors.push(`Triggers array must not be empty in ${filePath}`);
  }

  // 6. Rules validation (must be non-empty array and each rule must exist if .agents/rules exists)
  if (!meta.rules || !Array.isArray(meta.rules) || meta.rules.length === 0) {
    errors.push(`Missing rules in ${filePath}`);
  } else {
    const rulesDir = path.join(rootDir, '.agents/rules');
    const checkRuleFiles = fs.existsSync(rulesDir);
    for (const ruleName of meta.rules) {
      if (typeof ruleName !== 'string' || !ruleName.trim()) {
        errors.push(`Invalid rule entry "${ruleName}" in ${filePath}`);
        continue;
      }
      if (checkRuleFiles) {
        const rulePath = path.join(rulesDir, `${ruleName}.md`);
        if (!fs.existsSync(rulePath)) {
          errors.push(`Referenced rule "${ruleName}" does not exist at ${rulePath} in ${filePath}`);
        }
      }
    }
  }

  // 7. References validation (optional array of paths relative to skill directory)
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

  // 8. Shared contract compliance check
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

export function validateRuleContent(content, filePath) {
  const errors = [];
  const byteSize = Buffer.byteLength(content, 'utf8');
  if (byteSize > MAX_RULE_FILE_BYTES) {
    errors.push(`Rule file exceeds Antigravity 24KB limit (${byteSize} > ${MAX_RULE_FILE_BYTES} bytes) in ${filePath}`);
  }

  const yamlString = extractFrontmatter(content);
  if (!yamlString) {
    errors.push(`Missing YAML frontmatter in Antigravity rule ${filePath}`);
    return { valid: false, errors, meta: null };
  }

  let meta;
  try {
    meta = yaml.load(yamlString);
  } catch (err) {
    errors.push(`Invalid YAML frontmatter in Antigravity rule ${filePath}: ${err.message}`);
    return { valid: false, errors, meta: null };
  }

  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    errors.push(`Frontmatter must be an object in Antigravity rule ${filePath}`);
    return { valid: false, errors, meta: null };
  }

  if (meta.version !== undefined && (typeof meta.version !== 'string' || !SEMVER_REGEX.test(meta.version))) {
    errors.push(`Invalid semver version "${meta.version}" in Antigravity rule ${filePath}`);
  }

  if (!SUPPORTED_RULE_TRIGGERS.has(meta.trigger)) {
    errors.push(`Missing or unsupported Antigravity trigger "${meta.trigger}" in ${filePath}`);
  }

  if (meta.trigger === 'model_decision' && (typeof meta.description !== 'string' || !meta.description.trim())) {
    errors.push(`Antigravity model_decision rule requires a description in ${filePath}`);
  }

  if (meta.trigger === 'glob') {
    const globs = meta.globs ?? meta.glob;
    if (typeof globs !== 'string' || !globs.trim()) {
      errors.push(`Antigravity glob rule requires non-empty single-string globs in ${filePath}`);
    } else if (/\{[^}]*\}/.test(globs)) {
      errors.push(`Antigravity glob rule must not use brace expansion ({...}) in ${filePath}`);
    }
  }

  return { valid: errors.length === 0, errors, meta };
}

export function validateRulesDir(rulesDir = DEFAULT_RULES_DIR, rootDir = DEFAULT_ROOT_DIR) {
  if (!fs.existsSync(rulesDir)) {
    return { valid: false, errors: [`Antigravity rules directory not found: ${rulesDir}`], totalScanned: 0, validCount: 0 };
  }

  const ruleFiles = fs.readdirSync(rulesDir).filter(file => file.endsWith('.md')).sort();
  const errors = [];
  let validCount = 0;
  let alwaysOnBytes = 0;

  for (const file of ruleFiles) {
    const filePath = path.join(rulesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const result = validateRuleContent(content, filePath);
    if (result.meta?.trigger === 'always_on') {
      alwaysOnBytes += Buffer.byteLength(content, 'utf8');
    }
    if (result.valid) validCount++;
    else errors.push(...result.errors);
  }

  // Enforce compact aggregate Always-On budget (GEMINI.md + .agents/AGENTS.md + always_on rules)
  for (const extraRel of ['GEMINI.md', '.agents/AGENTS.md']) {
    const extraPath = path.join(rootDir, extraRel);
    if (fs.existsSync(extraPath)) {
      alwaysOnBytes += Buffer.byteLength(fs.readFileSync(extraPath, 'utf8'), 'utf8');
    }
  }
  if (alwaysOnBytes > MAX_ALWAYS_ON_BYTES) {
    errors.push(`Aggregate always-on rules exceed budget (${alwaysOnBytes} > ${MAX_ALWAYS_ON_BYTES} bytes)`);
  }

  console.log(`\nAntigravity rules scanned: ${ruleFiles.length}`);
  console.log(`Valid: ${validCount}/${ruleFiles.length} (Always-on footprint: ${alwaysOnBytes} bytes)`);
  console.log(`Missing required / errors: ${errors.length}`);
  for (const error of errors) console.warn(`[WARN] ${error}`);

  return { valid: errors.length === 0, errors, totalScanned: ruleFiles.length, validCount, alwaysOnBytes };
}

export function validateHooksFile(hooksFilePath = DEFAULT_HOOKS_FILE) {
  if (!fs.existsSync(hooksFilePath)) {
    return { valid: true, errors: [], hookCount: 0 };
  }

  const errors = [];
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(hooksFilePath, 'utf8'));
  } catch (err) {
    return { valid: false, errors: [`Invalid JSON in ${hooksFilePath}: ${err.message}`], hookCount: 0 };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, errors: [`hooks.json root must be an object in ${hooksFilePath}`], hookCount: 0 };
  }

  const hooksDir = path.dirname(hooksFilePath);
  const hookNames = Object.keys(parsed);

  for (const hookName of hookNames) {
    const spec = parsed[hookName];
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      errors.push(`Hook "${hookName}" must be an object in ${hooksFilePath}`);
      continue;
    }

    for (const [key, value] of Object.entries(spec)) {
      if (key === 'enabled') {
        if (typeof value !== 'boolean') {
          errors.push(`Hook "${hookName}.enabled" must be a boolean in ${hooksFilePath}`);
        }
        continue;
      }

      if (!SUPPORTED_HOOK_EVENTS.has(key)) {
        errors.push(`Unsupported hook event "${key}" in hook "${hookName}" (${hooksFilePath})`);
        continue;
      }

      if (!Array.isArray(value)) {
        errors.push(`Hook event "${hookName}.${key}" must be an array in ${hooksFilePath}`);
        continue;
      }

      const handlers = [];
      if (GROUPED_HOOK_EVENTS.has(key)) {
        for (const group of value) {
          if (!group || typeof group.matcher !== 'string' || !Array.isArray(group.hooks)) {
            errors.push(`Grouped event "${hookName}.${key}" requires { matcher: string, hooks: array } in ${hooksFilePath}`);
            continue;
          }
          handlers.push(...group.hooks);
        }
      } else {
        handlers.push(...value);
      }

      for (const handler of handlers) {
        if (!handler || typeof handler.command !== 'string' || !handler.command.trim()) {
          errors.push(`Hook handler in "${hookName}.${key}" requires a non-empty command string`);
          continue;
        }
        if (handler.type !== undefined && handler.type !== 'command') {
          errors.push(`Unsupported hook handler type "${handler.type}" in "${hookName}.${key}"`);
        }
        const scriptMatch = handler.command.match(/(?:^|\s)(\.\/[^\s"']+)/);
        if (scriptMatch) {
          const scriptPath = path.resolve(hooksDir, scriptMatch[1]);
          if (!fs.existsSync(scriptPath)) {
            errors.push(`Hook command script does not exist: ${scriptMatch[1]} (resolved: ${scriptPath})`);
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, hookCount: hookNames.length };
}

export function validateSkillsDir(skillsDir = DEFAULT_SKILLS_DIR, rootDir = DEFAULT_ROOT_DIR) {
  if (!fs.existsSync(skillsDir)) {
    console.error('Skills directory not found:', skillsDir);
    return { valid: false, errors: [`Skills directory not found: ${skillsDir}`], count: 0 };
  }

  const allDirs = fs.readdirSync(skillsDir)
    .filter(d => fs.statSync(path.join(skillsDir, d)).isDirectory());
  const allErrors = [];

  for (const d of allDirs) {
    if (d.startsWith('_')) {
      allErrors.push(`Template or underscore-prefixed directory "${d}" must not be placed inside .agents/skills/ (Antigravity IDE mounts all subdirectories as live skills)`);
    }
  }

  const skillDirs = allDirs.filter(d => !d.startsWith('_')).sort();
  let totalScanned = 0;
  let validCount = 0;
  const triggerOwners = new Map();

  for (const dir of skillDirs) {
    const skillFile = path.join(skillsDir, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      allErrors.push(`Missing SKILL.md in directory ${dir}`);
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    const result = validateSkillContent(content, skillFile, rootDir);
    const dirErrors = [...result.errors];

    if (result.meta) {
      if (result.meta.name !== dir) {
        dirErrors.push(`Skill frontmatter name "${result.meta.name}" must match directory "${dir}" in ${skillFile}`);
      }
      if (typeof result.meta.description !== 'string' || !result.meta.description.trim()) {
        dirErrors.push(`Missing required description in ${skillFile}`);
      }
      const triggers = Array.isArray(result.meta.triggers)
        ? result.meta.triggers
        : typeof result.meta.triggers === 'string'
          ? [result.meta.triggers]
          : [];
      for (const rawTrigger of triggers) {
        const normalized = String(rawTrigger).normalize('NFC').trim().toLowerCase();
        if (!normalized) continue;
        const existingOwner = triggerOwners.get(normalized);
        if (existingOwner && existingOwner !== dir) {
          dirErrors.push(`Duplicate trigger "${rawTrigger}" claimed by both "${existingOwner}" and "${dir}"`);
        } else {
          triggerOwners.set(normalized, dir);
        }
      }
    }

    totalScanned++;

    if (dirErrors.length === 0) {
      validCount++;
    } else {
      for (const err of dirErrors) {
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
  const skillsResult = validateSkillsDir();
  const rulesResult = validateRulesDir();
  const hooksResult = validateHooksFile();
  if (!hooksResult.valid) {
    for (const err of hooksResult.errors) console.warn(`[WARN] ${err}`);
  }
  if (!skillsResult.valid || !rulesResult.valid || !hooksResult.valid) {
    process.exit(1);
  }
}
