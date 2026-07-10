const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // Note: might not be installed

const skillsDir = 'd:\\ai-code-skin-mcp\\rules-skill\\skills';
const seeds = ['qk-bug-resolution', 'qk-feature-delivery', 'qk-access-policy', 'qk-engineering-standard', 'qk-context-loader', 'qk-orchestrator'];

seeds.forEach(seed => {
  const specPath = path.join(skillsDir, seed, 'BEHAVIOR_SPEC.md');
  const skillPath = path.join(skillsDir, seed, 'SKILL.md');
  if (fs.existsSync(specPath)) {
    const raw = fs.readFileSync(specPath, 'utf8');
    // Using simple string parsing since js-yaml might not be available
    let md = ---\nname:  + seed + \nversion: 6.0.0\n---\n\n;
    md += #  + seed + \n\n;
    md += This file follows the 6-Field Minimal Core v6 architecture.\n\n;
    md += raw;
    fs.writeFileSync(skillPath, md);
    fs.unlinkSync(specPath);
    console.log('Fixed', seed);
  }
});
