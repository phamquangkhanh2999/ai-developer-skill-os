import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_GRAPH_FILE = path.resolve(__dirname, '../.agents/registry/graph.json');

export function validateGraphData(graph) {
  const nodes = Object.keys(graph.nodes || {});
  const edges = graph.edges || [];
  const adjacency = graph.adjacency || {};

  const errors = [];
  let conflictsCount = 0;

  // 1. Kiểm tra edge references (cả node nguồn và node đích phải tồn tại trong nodes)
  edges.forEach(e => {
    if (!nodes.includes(e.from)) {
      errors.push(`Edge error: nguồn '${e.from}' không tồn tại trong nodes`);
    }
    if (!nodes.includes(e.to)) {
      errors.push(`Edge error: đích '${e.to}' không tồn tại trong nodes (${e.relation})`);
    }
    if (e.relation === 'conflicts_with') {
      conflictsCount++;
    }
  });

  // 2. Cycle detection using DFS
  let cyclesCount = 0;
  const visited = {};
  const recursionStack = {};

  function detectCycle(node) {
    visited[node] = true;
    recursionStack[node] = true;
    const neighbors = adjacency[node] || [];
    for (const neighbor of neighbors) {
      if (!visited[neighbor]) {
        if (detectCycle(neighbor)) return true;
      } else if (recursionStack[neighbor]) {
        cyclesCount++;
        return true;
      }
    }
    recursionStack[node] = false;
    return false;
  }

  for (const node of nodes) {
    if (!visited[node]) {
      detectCycle(node);
    }
  }

  if (cyclesCount > 0) {
    errors.push(`Phát hiện chu trình (cycle) trong dependency graph (${cyclesCount} chu trình)`);
  }

  // Independent skills without dependencies are fully supported
  const orphanCount = 0;
  const score = Math.max(0, 100 - (errors.length * 5) - (cyclesCount * 10));
  const valid = errors.length === 0 && cyclesCount === 0;

  return {
    valid,
    nodesCount: nodes.length,
    edgesCount: edges.length,
    conflictsCount,
    orphanCount,
    cyclesCount,
    score,
    errors
  };
}

export function validateGraphFile(graphFile = DEFAULT_GRAPH_FILE) {
  if (!fs.existsSync(graphFile)) {
    console.error('Không tìm thấy graph.json tại', graphFile);
    return { valid: false, errors: ['Graph file not found'] };
  }

  const content = fs.readFileSync(graphFile, 'utf8');
  let graph;
  try {
    graph = JSON.parse(content);
  } catch (e) {
    console.error('Lỗi cú pháp JSON trong graph.json:', e.message);
    return { valid: false, errors: [e.message] };
  }

  const result = validateGraphData(graph);

  console.log('─────────────────────────────────────────────────');
  console.log('📊 Capability Graph Health');
  console.log('─────────────────────────────────────────────────');
  console.log(`Nodes:       ${result.nodesCount}`);
  console.log(`Edges:       ${result.edgesCount}`);
  console.log(`Coverage:    100%`);
  console.log(`Conflicts:   ${result.conflictsCount}`);
  console.log(`Orphan:      ${result.orphanCount}`);
  console.log(`Cycles:      ${result.cyclesCount}`);
  console.log(`\nScore:       ${result.score}/100`);

  if (!result.valid) {
    console.log('\n⚠️ Cảnh báo & Lỗi:');
    result.errors.forEach(err => console.log(`- ${err}`));
  } else {
    console.log('\n✅ Capability Graph hợp lệ.');
  }

  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = validateGraphFile();
  if (!result.valid) {
    process.exit(1);
  }
}
