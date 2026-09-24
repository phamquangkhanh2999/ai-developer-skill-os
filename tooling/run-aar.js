import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const graphPath = path.join(rootDir, '.agents/registry/graph.json');
const reportsDir = path.join(rootDir, '.agents/reports');

/**
 * Run After Action Review (AAR).
 * Reads graph.json and generates health report.
 */
export async function runAar() {
  if (!fs.existsSync(graphPath)) {
    console.error('❌ graph.json not found. Run: node tooling/build-registry.js');
    return;
  }

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  const nodes = Object.keys(graph.nodes || {});
  const edges = graph.edges || [];
  const adjacency = graph.adjacency || {};

  let report = '# After Action Review (AAR)\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;

  // Node health
  report += '## Node Health\n\n';
  report += '| Node | Version | Platforms | Dependencies |\n';
  report += '|------|---------|-----------|-------------|\n';
  for (const [id, node] of Object.entries(graph.nodes || {})) {
    const deps = (node.dependencies || []).join(', ') || '—';
    report += `| ${id} | ${node.version || '—'} | ${(node.platforms || []).join(', ') || '—'} | ${deps} |\n`;
  }

  // Edge summary
  report += '\n## Edge Summary\n\n';
  report += `- Total edges: ${edges.length}\n`;
  report += `- Total nodes: ${nodes.length}\n`;
  report += `- Orphans: ${graph.orphan_count || 0}\n`;
  report += `- Has cycles: ${graph.has_cycles || false}\n`;

  // Platform coverage
  report += '\n## Platform Coverage\n\n';
  const platformCounts = { antigravity: 0, claude: 0, opencode: 0 };
  for (const node of Object.values(graph.nodes || {})) {
    for (const p of node.platforms || []) {
      if (platformCounts[p] !== undefined) platformCounts[p]++;
    }
  }
  for (const [platform, count] of Object.entries(platformCounts)) {
    report += `- ${platform}: ${count}/${nodes.length} skills\n`;
  }

  // Version compliance
  report += '\n## Version Compliance\n\n';
  let compliant = 0;
  for (const [id, node] of Object.entries(graph.nodes || {})) {
    if (node.version === '10.2.0') compliant++;
  }
  report += `- Version 10.2.0: ${compliant}/${nodes.length}\n`;

  fs.writeFileSync(path.join(reportsDir, 'aar-report.md'), report);
  console.log('✅ AAR report generated.');
}

export default { runAar };
