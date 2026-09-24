import fs from 'fs';
import path from 'path';
import YAML from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const skillsDir = path.join(rootDir, '.agents/skills');
const graphPath = path.join(rootDir, '.agents/registry/capability-graph.yml');
const workflowsDir = path.join(rootDir, '.agents/workflows');
const reportsDir = path.join(rootDir, '.agents/reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return YAML.load(match[1]);
  } catch (e) {
    return null;
  }
}

// 1. Skill Audit
function runSkillAudit() {
  const dirs = fs.readdirSync(skillsDir).filter(name => !name.startsWith('_') && fs.statSync(path.join(skillsDir, name)).isDirectory());
  
  let report = `# Skill Audit Report\n\n`;
  let valid = 0;

  dirs.forEach(skill => {
    const skillPath = path.join(skillsDir, skill, 'SKILL.md');
    if (!fs.existsSync(skillPath)) return;
    
    const content = fs.readFileSync(skillPath, 'utf8');
    const data = parseFrontmatter(content);
    if (!data) return;

    // Check boundary
    const bounds = data.decision_boundary || {};
    const hasOwns = bounds.owns && bounds.owns.length > 0;
    const hasNotOwn = bounds.does_not_own && bounds.does_not_own.length > 0;
    const hasConflicts = bounds.conflicts_with !== undefined; // can be empty array
    const hasDelegates = bounds.delegates_to !== undefined; // optional
    
    let score = 0;
    if (hasOwns) score += 30;
    if (hasNotOwn) score += 30;
    if (hasConflicts) score += 20;
    if (hasDelegates) score += 20; // bonus if exists or architecture skill
    if (!hasDelegates && !skill.includes('architecture') && !skill.includes('orchestrator')) {
        score += 20; // It's fine if implementation skill doesn't delegate
    }

    report += `## ${skill}\n`;
    report += `- \`owns\`: ${hasOwns ? '✅' : '❌'}\n`;
    report += `- \`does_not_own\`: ${hasNotOwn ? '✅' : '❌'}\n`;
    report += `- \`conflicts_with\`: ${hasConflicts ? '✅' : '❌'}\n`;
    report += `- \`delegates_to\`: ${hasDelegates ? '✅' : (skill.includes('architecture') ? '❌ (Architecture should delegate)' : '➖ (Optional)')}\n`;
    report += `**Boundary Health Score: ${score}/100**\n\n`;
    
    if (score >= 80) valid++;
  });

  report += `\n**Total Scanned:** ${dirs.length}\n`;
  report += `**Total Passed (>=80):** ${valid}\n`;

  fs.writeFileSync(path.join(reportsDir, 'skill-audit.md'), report);
  console.log('✅ Skill audit complete.');
}

// 2. Graph Audit
function runGraphAudit() {
  if (!fs.existsSync(graphPath)) return;
  const graph = YAML.load(fs.readFileSync(graphPath, 'utf8'));
  
  let report = `# Graph Health Report\n\n`;
  const incoming = {};
  const outgoing = {};
  const conflicts = [];
  
  Object.keys(graph.nodes).forEach(n => {
    incoming[n] = 0;
    outgoing[n] = 0;
  });

  graph.edges.forEach(e => {
    if (outgoing[e.from] !== undefined) outgoing[e.from]++;
    if (incoming[e.to] !== undefined) incoming[e.to]++;
    
    if (e.relation === 'conflicts_with') {
      conflicts.push(`- **${e.from}** conflicts **${e.to}**\n  - Reason: Semantic overlap\n  - Severity: High\n  - Resolution: Context loader intervention required`);
    }
  });

  report += `## Hub Risk Analysis\n`;
  const MAX_OUT = 12;
  const MAX_IN = 15;
  const ALLOWED_HUBS = ['qk-orchestrator', 'qk-context-loader'];

  Object.keys(outgoing).forEach(id => {
    const outCount = outgoing[id];
    const inCount = incoming[id];
    let risk = 'Low';
    if (outCount > MAX_OUT || inCount > MAX_IN) {
      if (ALLOWED_HUBS.includes(id)) {
        risk = 'Allowed Exception';
      } else {
        risk = 'High Risk Hub';
      }
    }
    if (risk !== 'Low') {
      report += `- **${id}**: Incoming(${inCount}), Outgoing(${outCount}) -> [${risk}]\n`;
    }
  });

  report += `\n## Conflict Matrix\n`;
  conflicts.forEach(c => {
    report += `${c}\n\n`;
  });

  fs.writeFileSync(path.join(reportsDir, 'graph-health.md'), report);
  console.log('✅ Graph audit complete.');
}

// 3. Workflow Audit
function runWorkflowAudit() {
  const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.md') || f.endsWith('.yml'));
  let report = `# Architecture & Workflow Audit\n\n`;
  report += `## Workflows Found: ${workflows.length}\n`;
  workflows.forEach(w => {
    report += `- ${w}\n`;
  });
  fs.writeFileSync(path.join(reportsDir, 'architecture-audit.md'), report);
  console.log('✅ Workflow audit complete.');
}

runSkillAudit();
runGraphAudit();
runWorkflowAudit();
