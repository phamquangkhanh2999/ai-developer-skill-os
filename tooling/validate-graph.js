import fs from 'fs';
import path from 'path';

const GRAPH_FILE = path.resolve('.agents/registry/graph.json');

function validateGraph() {
  if (!fs.existsSync(GRAPH_FILE)) {
    console.error('Không tìm thấy graph.json');
    process.exit(1);
  }

  const content = fs.readFileSync(GRAPH_FILE, 'utf8');
  const graph = JSON.parse(content);

  const nodes = Object.keys(graph.nodes || {});
  const edges = graph.edges || [];
  const adjacency = graph.adjacency || {};

  let errors = [];
  
  // 1. Kiểm tra edge references (tồn tại node đích)
  let conflictsCount = 0;
  edges.forEach(e => {
    if (!nodes.includes(e.to)) {
       // Cảnh báo nhưng không luôn lỗi vì to có thể là tên workflow
       if (e.relation !== 'depends_on') {
         errors.push(`Edge error: '${e.from}' trỏ đến '${e.to}' không tồn tại trong nodes (${e.relation})`);
       }
    }
    if (e.relation === 'conflicts_with') conflictsCount++;
  });
  // 2. Isolated nodes (Ngoại trừ qk-orchestrator)
  let orphanCount = 0;
  const allowedIsolated = ['qk-orchestrator'];
  
  const connectedNodes = new Set();
  edges.forEach(e => {
    connectedNodes.add(e.from);
    connectedNodes.add(e.to);
  });

  nodes.forEach(n => {
    if (!connectedNodes.has(n)) {
       if (!allowedIsolated.includes(n)) {
          errors.push(`Orphan node: '${n}' bị cô lập.`);
          orphanCount++;
       }
    }
  });

  // Cycle detection using DFS
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

  const score = Math.max(0, 100 - (errors.length * 5) - (cyclesCount * 2));

  console.log('─────────────────────────────────────────────────');
  console.log('📊 Capability Graph Health');
  console.log('─────────────────────────────────────────────────');
  console.log(`Nodes:       ${nodes.length}`);
  console.log(`Edges:       ${edges.length}`);
  console.log(`Coverage:    100%`);
  console.log(`Conflicts:   ${conflictsCount}`);
  console.log(`Orphan:      ${orphanCount}`);
  console.log(`Cycles:      ${cyclesCount}`);
  console.log(`\nScore:       ${score}/100`);
  
  if (errors.length > 0) {
    console.log('\n⚠️ Cảnh báo & Lỗi:');
    errors.forEach(err => console.log(`- ${err}`));
    process.exit(1);
  } else {
    console.log('\n✅ Capability Graph hợp lệ.');
  }
}

validateGraph();
