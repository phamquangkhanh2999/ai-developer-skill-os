/**
 * generate-registry.js
 * Generates registry/skills-index.yml and registry/capability-graph.yml
 *
 * Usage: node tooling/generate-registry.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKILLS_DIR = path.join(__dirname, '../.agents/skills');
const INDEX_FILE = path.join(__dirname, '../.agents/registry/skills-index.yml');
const GRAPH_FILE = path.join(__dirname, '../.agents/registry/capability-graph.yml');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  
  try {
    return yaml.load(match[1]);
  } catch (e) {
    console.error('YAML parse error:', e.message);
    return null;
  }
}

function generate() {
  const skills = [];

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());

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

    // Schema Validation Enforcement
    if (meta.status === 'stable' && meta.version && meta.version.startsWith('8.')) {
      if (!meta.intent || !meta.workflow || !meta.verification || !meta.selection) {
        console.warn(`[WARN] Rejecting ${meta.name} (v8): Missing required schema fields`);
        continue;
      }
    }

    skills.push(meta);
  }

  // 1. Generate skills-index.yml (Backward compatibility)
  const indexData = {
    version: "8.1.1",
    generated_at: new Date().toISOString(),
    total_skills: skills.length,
    skills: skills.map(s => ({
      name: s.name,
      version: s.version || "8.0.0",
      status: s.status || "legacy",
      description: s.description || "",
      complexity: s.complexity?.level || "medium",
      workflow: s.workflow || null,
      triggers: s.triggers || [],
      intent: s.intent || []
    }))
  };

  fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
  fs.writeFileSync(INDEX_FILE, `# registry/skills-index.yml\n# GENERATED FILE — DO NOT EDIT MANUALLY\n` + yaml.dump(indexData, { indent: 2 }), 'utf8');

  // 2. Generate capability-graph.yml (V8.1.1)
  const nodes = {};
  const edges = [];

  for (const s of skills) {
    nodes[s.name] = {
      type: s.type || 'capability',
      maturity: s.status || 'legacy',
      owns: s.decision_boundary?.owns || [],
      does_not_own: s.decision_boundary?.does_not_own || [],
      conflicts: s.decision_boundary?.conflicts_with || [],
      workflow: s.workflow || null
    };

    if (s.workflow) {
      edges.push({
        from: s.name,
        to: s.workflow,
        relation: 'depends_on'
      });
    }
    
    if (s.decision_boundary?.conflicts_with) {
      for (const conflict of s.decision_boundary.conflicts_with) {
        edges.push({
          from: s.name,
          to: conflict,
          relation: 'conflicts_with'
        });
      }
    }
    
    if (s.decision_boundary?.delegates_to) {
      for (const delegate of s.decision_boundary.delegates_to) {
        edges.push({
          from: s.name,
          to: delegate,
          relation: 'delegates_to'
        });
      }
    }
    
    if (s.related_skills) {
       for (const related of s.related_skills) {
         edges.push({
           from: s.name,
           to: related,
           relation: 'feeds'
         });
       }
    }
  }

  const graphData = {
    version: "8.1.2",
    generated_at: new Date().toISOString(),
    nodes,
    edges
  };

  fs.writeFileSync(GRAPH_FILE, `# registry/capability-graph.yml\n# GENERATED FILE — DO NOT EDIT MANUALLY\n` + yaml.dump(graphData, { indent: 2 }), 'utf8');

  console.log(`✅ Generated registry index and capability graph with ${skills.length} skills`);
}

generate();
