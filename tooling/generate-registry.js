/**
 * generate-registry.js
 * Generates registry/skills-index.yml from SKILL.md frontmatter.
 *
 * Usage: node tooling/generate-registry.js
 * Output: .agents/registry/skills-index.yml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKILLS_DIR = path.join(__dirname, '../.agents/skills');
const OUTPUT_FILE = path.join(__dirname, '../.agents/registry/skills-index.yml');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  
  // Simple YAML key extraction (for specific fields we need)
  const yaml = match[1];
  const extract = (key, isArray = false) => {
    if (isArray) {
      const arrayMatch = yaml.match(new RegExp(`^${key}:\\s*\\n([\\s\\S]*?)(?=^\\w|$)`, 'm'));
      if (!arrayMatch) return [];
      return arrayMatch[1].match(/^\s+-\s+"?([^"\n]+)"?/gm)
        ?.map(l => l.replace(/^\s+-\s+"?|"?$/g, '').trim()) || [];
    }
    const m = yaml.match(new RegExp(`^${key}:\\s*(.+)`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  };

  return {
    name: extract('name'),
    description: extract('description'),
    version: extract('version') || '7.5.0',
    status: extract('status') || 'legacy',
    complexity_level: yaml.match(/^\s+level:\s*(.+)/m)?.[1]?.trim() || extract('complexity'),
    triggers: extract('triggers', true),
    intent: extract('intent', true),
    workflow: extract('workflow'),
    related_skills: extract('related_skills', true),
  };
}

function generate() {
  const skills = [];

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR)
    .filter(d => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());

  for (const dir of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf8');
    const meta = parseFrontmatter(content);
    if (!meta || !meta.name) continue;

    // Default legacy if not marked stable
    if (!meta.status && meta.version && meta.version.startsWith('8.')) {
        meta.status = 'stable';
    }

    skills.push(meta);
  }

  // Build index grouped by triggers
  const triggerMap = {};
  for (const skill of skills) {
    for (const trigger of (skill.triggers || [])) {
      if (!triggerMap[trigger]) triggerMap[trigger] = [];
      triggerMap[trigger].push(skill.name);
    }
  }

  // Generate YAML output
  let yaml = `# registry/skills-index.yml
# GENERATED FILE — DO NOT EDIT MANUALLY
# Source: .agents/skills/*/SKILL.md
# Regenerate: node tooling/generate-registry.js
#
version: 8.0.0
generated_at: "${new Date().toISOString()}"
total_skills: ${skills.length}

# ── Skills catalog ────────────────────────────────────────
skills:\n`;

  for (const skill of skills) {
    yaml += `  - name: ${skill.name}\n`;
    yaml += `    version: "${skill.version}"\n`;
    yaml += `    status: ${skill.status}\n`;
    yaml += `    description: "${skill.description || ''}"\n`;
    yaml += `    complexity: ${skill.complexity_level || 'medium'}\n`;
    yaml += `    workflow: ${skill.workflow || 'null'}\n`;
    if (skill.triggers?.length) {
      yaml += `    triggers:\n${skill.triggers.map(t => `      - "${t}"`).join('\n')}\n`;
    }
    if (skill.intent?.length) {
      yaml += `    intent:\n${skill.intent.map(i => `      - ${i}`).join('\n')}\n`;
    }
    yaml += '\n';
  }

  // Write output
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, yaml, 'utf8');
  console.log(`✅ Generated registry with ${skills.length} skills → ${OUTPUT_FILE}`);
}

generate();
