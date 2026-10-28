/**
 * build-registry.js
 * Governed Capability Metadata & Eval Platform
 * Generates registry/index.yaml (lightweight lookup) and registry/graph.json (O(1) graph & cycle check)
 * 
 * Usage: node tooling/build-registry.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_SKILLS_DIR = path.join(DEFAULT_ROOT_DIR, '.agents/skills');
const DEFAULT_REGISTRY_DIR = path.join(DEFAULT_ROOT_DIR, '.agents/registry');

export function parseYamlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (match) {
    return yaml.load(match[1]);
  }
  return yaml.load(content);
}

export function buildRegistryCore({
  skillsDir = DEFAULT_SKILLS_DIR,
  registryDir = DEFAULT_REGISTRY_DIR,
  rootDir = DEFAULT_ROOT_DIR,
  allowCycles = false
} = {}) {
  const pkgPath = path.join(rootDir, 'package.json');
  const packageVersion = fs.existsSync(pkgPath)
    ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version
    : '11.0.0';
  const manifestVersion = packageVersion.split('.').slice(0, 2).join('.');

  if (!fs.existsSync(skillsDir)) {
    throw new Error(`Skills directory not found: ${skillsDir}`);
  }

  fs.mkdirSync(registryDir, { recursive: true });

  const dirs = fs.readdirSync(skillsDir).filter(d => 
    !d.startsWith('_') && fs.statSync(path.join(skillsDir, d)).isDirectory()
  ).sort();

  const capabilities = {};
  const adjacency = {};
  const reverseAdjacency = {};

  for (const dir of dirs) {
    const capYamlPath = path.join(skillsDir, dir, 'capability.yaml');
    const skillMdPath = path.join(skillsDir, dir, 'SKILL.md');
    
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
    const version = meta.version || skillMdMeta?.version || '10.3.0';
    const status = meta.status || skillMdMeta?.status || 'stable';
    const description = meta.description || skillMdMeta?.description || '';
    
    // Normalize tags
    let tags = meta.tags || meta.keywords || [];
    if (!Array.isArray(tags) || tags.length === 0) {
      tags = dir.replace(/^qk-/, '').split('-');
    }

    // Normalize dependencies - only use explicit skill-to-skill dependencies
    let dependencies = meta.dependencies || [];
    if (!fromCapabilityYaml) {
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

    adjacency[id] = [...dependencies];
    if (!reverseAdjacency[id]) reverseAdjacency[id] = [];
  }

  // Validate all declared dependencies exist in capabilities
  for (const [id, deps] of Object.entries(adjacency)) {
    for (const dep of deps) {
      if (!capabilities[dep]) {
        throw new Error(`Declared dependency "${dep}" in skill "${id}" does not exist in active skills.`);
      }
    }
  }

  // Populate reverse adjacency
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

  if (hasCycles && !allowCycles) {
    throw new Error('Cycle detected in skill dependency graph');
  }

  // Build Graph JSON (O(1) Runtime lookups)
  const graphNodes = {};
  for (const [id, data] of Object.entries(capabilities)) {
    const dependents = reverseAdjacency[id] || [];

    graphNodes[id] = {
      path: data.path,
      version: data.version,
      platforms: data.platforms || ["antigravity", "claude", "opencode"],
      tags: data.tags,
      dependencies: data.dependencies,
      dependents,
      is_orphan: false
    };
  }

  const allIds = Object.keys(capabilities);
  const activeSkills = allIds.filter(id => capabilities[id].status === 'stable' || capabilities[id].status === 'experimental');
  const archivedSkills = allIds.filter(id => capabilities[id].status === 'archived');
  const relocatedSkills = allIds.filter(id => capabilities[id].status === 'relocated');

  const edges = [];
  for (const [from, toList] of Object.entries(adjacency)) {
    for (const to of toList) {
      edges.push({ from, to, relation: 'depends_on' });
    }
  }

  const graphJsonData = {
    schema_version: 1,
    manifest_version: manifestVersion,
    generated_at: new Date().toISOString(),
    nodes: graphNodes,
    edges,
    adjacency,
    stats: {
      total_scanned: allIds.length,
      active: activeSkills.length,
      archived: archivedSkills.length,
      relocated: relocatedSkills.length,
      has_cycles: hasCycles
    }
  };

  const indexYamlData = {
    schema_version: 1,
    manifest_version: manifestVersion,
    generated_at: new Date().toISOString(),
    stats: {
      total_scanned: allIds.length,
      active: activeSkills.length,
      archived: archivedSkills.length,
      relocated: relocatedSkills.length
    },
    capabilities
  };

  const indexYamlContent = `# AUTO-GENERATED BY registry-builder (tooling/build-registry.js)\n# DO NOT EDIT MANUALLY. THIS IS A GENERATED RUNTIME ARTIFACT.\n` +
    yaml.dump(indexYamlData, { indent: 2 });

  const indexYamlPath = path.join(registryDir, 'index.yaml');
  const graphJsonPath = path.join(registryDir, 'graph.json');

  fs.writeFileSync(indexYamlPath, indexYamlContent, 'utf8');
  fs.writeFileSync(graphJsonPath, JSON.stringify(graphJsonData, null, 2), 'utf8');

  return {
    graph: graphJsonData,
    index: indexYamlData,
    indexYamlContent,
    graphJsonContent: JSON.stringify(graphJsonData, null, 2)
  };
}

export function buildRegistry() {
  const packageVersion = JSON.parse(fs.readFileSync(path.join(DEFAULT_ROOT_DIR, 'package.json'), 'utf8')).version;
  const manifestVersion = packageVersion.split('.').slice(0, 2).join('.');
  console.log(`🔄 Building V${manifestVersion} Governed Capability Registry & O(1) Runtime Graph...`);

  try {
    const { graph } = buildRegistryCore();
    console.log(`✅ Generated lightweight registry index at .agents/registry/index.yaml (${graph.stats.total_scanned} scanned: ${graph.stats.active} active, ${graph.stats.archived} archived, ${graph.stats.relocated} relocated)`);
    console.log(`✅ Generated O(1) adjacency graph at .agents/registry/graph.json (active: ${graph.stats.active}, has_cycles: ${graph.stats.has_cycles})`);
  } catch (err) {
    console.error(`❌ Registry build failed: ${err.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  buildRegistry();
}
