/**
 * build-registry.js
 * V10.2 Governed Capability Metadata & Eval Platform
 * Generates registry/index.yaml (lightweight lookup) and registry/graph.json (O(1) graph & cycle check)
 * 
 * Usage: node tooling/build-registry.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKILLS_DIR = path.join(__dirname, '../.agents/skills');
const REGISTRY_DIR = path.join(__dirname, '../.agents/registry');
const INDEX_YAML = path.join(REGISTRY_DIR, 'index.yaml');
const GRAPH_JSON = path.join(REGISTRY_DIR, 'graph.json');

function parseYamlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
      return yaml.load(match[1]);
    }
    return yaml.load(content);
  } catch (e) {
    console.error(`[WARN] Failed to parse YAML from ${filePath}: ${e.message}`);
    return null;
  }
}

function buildRegistry() {
  console.log('🔄 Building V10.2 Governed Capability Registry & O(1) Runtime Graph...');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('❌ Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  fs.mkdirSync(REGISTRY_DIR, { recursive: true });

  const dirs = fs.readdirSync(SKILLS_DIR).filter(d => 
    !d.startsWith('_') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  const capabilities = {};
  const adjacency = {};
  const reverseAdjacency = {};

  for (const dir of dirs) {
    const capYamlPath = path.join(SKILLS_DIR, dir, 'capability.yaml');
    const skillMdPath = path.join(SKILLS_DIR, dir, 'SKILL.md');
    
    let meta = null;
    let fromCapabilityYaml = false;

    let skillMdMeta = null;
    if (fs.existsSync(skillMdPath)) {
      skillMdMeta = parseYamlFile(skillMdPath);
    }

    if (fs.existsSync(capYamlPath)) {
      meta = parseYamlFile(capYamlPath);
      fromCapabilityYaml = true;
    } else if (skillMdMeta) {
      meta = skillMdMeta;
    }

    if (!meta) continue;

    const id = meta.id || meta.name || dir;
    const version = meta.version || skillMdMeta?.version || '8.2.0';
    const status = meta.status || skillMdMeta?.status || 'stable';
    const description = meta.description || skillMdMeta?.description || '';
    
    // Normalize tags
    let tags = meta.tags || meta.keywords || [];
    if (!Array.isArray(tags) || tags.length === 0) {
      // Derive simple tags from dir words
      tags = dir.replace(/^qk-/, '').split('-');
    }

    // Normalize dependencies - only use explicit skill-to-skill dependencies
    let dependencies = meta.dependencies || [];
    if (!fromCapabilityYaml) {
      // Only use explicit dependencies, not workflow names
      // workflow field identifies the primary workflow, not a dependency
      const extraDeps = meta.decision_boundary?.delegates_to || [];
      if (extraDeps.length > 0) {
        const depSet = new Set([...dependencies, ...extraDeps]);
        dependencies = Array.from(depSet);
      }
    }

    capabilities[id] = {
      path: `.agents/skills/${dir}`,
      version,
      status,
      platforms: meta.platforms || ["antigravity", "claude", "opencode"],
      tags,
      dependencies
    };

    adjacency[id] = dependencies;
    if (!reverseAdjacency[id]) reverseAdjacency[id] = [];
  }

  // ── Hardcoded Cross-Skill Edges (V10.2) ─────
  // Directed acyclic graph: qk-orchestrator is the root hub
  // It routes to all other skills. No other skill routes back to it.
  const crossEdges = {
    'qk-orchestrator': ['qk-prompt-compiler', 'qk-product-spec', 'qk-feature-delivery', 'qk-bug-resolution', 'qk-code-cleaner', 'qk-code-review', 'qk-ui-engineer', 'qk-backend-data', 'qk-devops-release', 'qk-api-data-discovery']
  };

  for (const [skillId, deps] of Object.entries(crossEdges)) {
    if (adjacency[skillId]) {
      adjacency[skillId] = [...new Set([...adjacency[skillId], ...deps])];
    } else {
      adjacency[skillId] = deps;
    }
  }

  // Populate reverse adjacency for orphan detection
  for (const [id, deps] of Object.entries(adjacency)) {
    for (const dep of deps) {
      if (!reverseAdjacency[dep]) reverseAdjacency[dep] = [];
      reverseAdjacency[dep].push(id);
    }
  }

  // Detect cycles using DFS
  let hasCycles = false;
  const visited = {};
  const recursionStack = {};

  function detectCycle(node) {
    visited[node] = true;
    recursionStack[node] = true;

    const deps = adjacency[node] || [];
    for (const dep of deps) {
      if (!visited[dep]) {
        if (detectCycle(dep)) return true;
      } else if (recursionStack[dep]) {
        return true;
      }
    }

    recursionStack[node] = false;
    return false;
  }

  for (const node of Object.keys(adjacency)) {
    if (!visited[node]) {
      if (detectCycle(node)) {
        hasCycles = true;
        break;
      }
    }
  }

  // Build Graph JSON (O(1) Runtime lookups)
  const graphNodes = {};
  for (const [id, data] of Object.entries(capabilities)) {
    const dependents = reverseAdjacency[id] || [];
    const isOrphan = data.dependencies.length === 0 && dependents.length === 0 && id !== 'qk-orchestrator' && id !== 'qk-help';

    graphNodes[id] = {
      path: data.path,
      version: data.version,
      platforms: data.platforms || ["antigravity", "claude", "opencode"],
      tags: data.tags,
      dependencies: data.dependencies,
      dependents,
      is_orphan: isOrphan
    };
  }

  const allIds = Object.keys(capabilities);
  const activeSkills = allIds.filter(id => capabilities[id].status === 'stable' || capabilities[id].status === 'experimental');
  const archivedSkills = allIds.filter(id => capabilities[id].status === 'archived');
  const relocatedSkills = allIds.filter(id => capabilities[id].status === 'relocated');

  const graphJsonData = {
    schema_version: 1,
    manifest_version: '10.2',
    generated_at: new Date().toISOString(),
    nodes: graphNodes,
    edges: Object.entries(adjacency).flatMap(([from, toList]) => toList.map(to => ({ from, to, relation: 'depends_on' }))),
    adjacency,
    stats: {
      total_scanned: allIds.length,
      active: activeSkills.length,
      archived: archivedSkills.length,
      relocated: relocatedSkills.length,
      has_cycles: hasCycles
    }
  };

  // Build Registry Index YAML (Lightweight lookup)
  const indexYamlContent = `# AUTO-GENERATED BY registry-builder (tooling/build-registry.js)\n# DO NOT EDIT MANUALLY. THIS IS A GENERATED RUNTIME ARTIFACT.\n` +
    yaml.dump({
      schema_version: 1,
      manifest_version: '10.2',
      generated_at: new Date().toISOString(),
      stats: {
        total_scanned: allIds.length,
        active: activeSkills.length,
        archived: archivedSkills.length,
        relocated: relocatedSkills.length
      },
      capabilities
    }, { indent: 2 });

  fs.writeFileSync(INDEX_YAML, indexYamlContent, 'utf8');
  fs.writeFileSync(GRAPH_JSON, JSON.stringify(graphJsonData, null, 2), 'utf8');

  console.log(`✅ Generated lightweight registry index at .agents/registry/index.yaml (${allIds.length} scanned: ${activeSkills.length} active, ${archivedSkills.length} archived, ${relocatedSkills.length} relocated)`);
  console.log(`✅ Generated O(1) adjacency graph at .agents/registry/graph.json (active: ${activeSkills.length}, has_cycles: ${hasCycles})`);
}

buildRegistry();
