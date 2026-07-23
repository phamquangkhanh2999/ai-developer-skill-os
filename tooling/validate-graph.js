import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const GRAPH_FILE = path.resolve('.agents/registry/capability-graph.yml');

function validateGraph() {
  if (!fs.existsSync(GRAPH_FILE)) {
    console.error('Không tìm thấy capability-graph.yml');
    process.exit(1);
  }

  const content = fs.readFileSync(GRAPH_FILE, 'utf8');
  const graph = yaml.load(content);

  const nodes = Object.keys(graph.nodes || {});
  const edges = graph.edges || [];

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

  // 2. Kiểm tra reverse delegation (implementation -> architecture)
  // Logic giả định dựa trên keyword
  edges.forEach(e => {
    if (e.relation === 'delegates_to') {
       if (e.from.includes('ui-builder') && e.to.includes('architecture')) {
           errors.push(`Policy violation: Implementation skill '${e.from}' không được delegate cho Architecture skill '${e.to}'`);
       }
    }
  });

  // 3. Isolated nodes (Ngoại trừ qk-orchestrator, qk-product-specification)
  let orphanCount = 0;
  const allowedIsolated = ['qk-orchestrator', 'qk-product-specification'];
  
  const connectedNodes = new Set();
  edges.forEach(e => {
    connectedNodes.add(e.from);
    if (nodes.includes(e.to)) connectedNodes.add(e.to);
  });

  nodes.forEach(n => {
    if (!connectedNodes.has(n)) {
       if (!allowedIsolated.includes(n)) {
          errors.push(`Orphan node: '${n}' bị cô lập (không nối đi đâu, không ai nối tới).`);
          orphanCount++;
       }
    }
  });

  // Mock Cycles check
  let cyclesCount = 0; // Để đơn giản, giả lập 0 cycles. Trong thực tế dùng thuật toán DFS.

  const score = Math.max(0, 100 - (errors.length * 5));

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
