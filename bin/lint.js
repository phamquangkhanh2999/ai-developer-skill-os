#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsDir = path.join(__dirname, '..', 'skills');

const REQUIRED_FOR_ALL = [
  'Preconditions',
  'Scope',
  'Non-Goals',
  'Exit Codes',
  'Handoff Contract'
];

const REQUIRED_FOR_ACTION = [
  'Workflow',
  'Confidence Model',
  'Evidence Format',
  'Escalation Rules'
];

const REQUIRED_FOR_EXECUTION = [
  'Priority Order',
  'Severity',
  'Retry Policy'
];

const ACTION_SKILLS = ['qk-bug-resolution', 'qk-feature-delivery', 'qk-fe-api-integration', 'qk-api-lifecycle', 'qk-data-lifecycle', 'qk-db-optimizer', 'qk-ui-builder', 'qk-ui-system-builder', 'qk-access-policy', 'qk-ai-builder', 'qk-system-evolution', 'qk-production-release', 'qk-project-bootstrap'];
const EXECUTION_SKILLS = ['qk-bug-resolution', 'qk-feature-delivery', 'qk-fe-api-integration', 'qk-api-lifecycle', 'qk-data-lifecycle', 'qk-db-optimizer', 'qk-ui-builder', 'qk-ui-system-builder', 'qk-access-policy', 'qk-ai-builder', 'qk-system-evolution', 'qk-production-release', 'qk-project-bootstrap', 'qk-engineering-standard', 'qk-validation-gate', 'qk-ui-audit', 'qk-project-health'];

const SKIP_LINT = ['qk-help'];

let hasErrors = false;

function lintSkill(skillPath, skillName) {
  if (SKIP_LINT.includes(skillName)) {
    console.log(`⏭️  [${skillName}] Skipped (reference skill)`);
    return;
  }

  const content = fs.readFileSync(skillPath, 'utf8');

  let parsed;
  try {
    parsed = matter(content);
  } catch (e) {
    console.error(`❌ [${skillName}] Frontmatter parsing failed: ${e.message}`);
    hasErrors = true;
    return;
  }

  const frontmatter = parsed.data;

  const requiredFrontmatter = ['name', 'category', 'version', 'description', 'platforms', 'execution_mode', 'cost', 'latency', 'risk', 'side_effects', 'produces', 'consumes', 'token_budget', 'exit_codes', 'schema_version', 'runtime_version', 'skill_version'];

  for (const field of requiredFrontmatter) {
    if (frontmatter[field] === undefined) {
      console.error(`❌ [${skillName}] Missing frontmatter field: ${field}`);
      hasErrors = true;
    }
  }

  const validPlatforms = ['antigravity', 'claude-code', 'cursor', 'windsurf', 'kilo-code'];
  if (Array.isArray(frontmatter.platforms)) {
    for (const p of frontmatter.platforms) {
      if (!validPlatforms.includes(p)) {
        console.error(`❌ [${skillName}] Invalid platform: ${p}`);
        hasErrors = true;
      }
    }
  }

  if (!content.includes('> **Language rule:**')) {
    console.error(`❌ [${skillName}] Missing Language Rule declaration.`);
    hasErrors = true;
  }

  const body = parsed.content;
  const required = [...REQUIRED_FOR_ALL];
  if (ACTION_SKILLS.includes(skillName)) {
    required.push(...REQUIRED_FOR_ACTION);
  }
  if (EXECUTION_SKILLS.includes(skillName)) {
    required.push(...REQUIRED_FOR_EXECUTION);
  }

  for (const section of required) {
    const headingRegex = new RegExp(`^##\\s+${section}\\b`, 'm');
    if (!headingRegex.test(body)) {
      console.error(`❌ [${skillName}] Missing section: ## ${section}`);
      hasErrors = true;
    }
  }
}

console.log('🔍 Running V7.5 Skill Schema Linting...');

const items = fs.readdirSync(skillsDir);
for (const item of items) {
  if (item === '_template' || item === 'qk-policy-engine') continue;

  const skillDir = path.join(skillsDir, item);
  if (fs.statSync(skillDir).isDirectory() && item.startsWith('qk-')) {
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      lintSkill(skillMdPath, item);
    }
  }
}

if (hasErrors) {
  console.error('\n💥 Linting failed. One or more skills do not comply with the V7.5 Runtime Standard.');
  process.exit(1);
} else {
  console.log('\n✅ All skills comply with V7.5 Runtime Standard!');
  process.exit(0);
}

