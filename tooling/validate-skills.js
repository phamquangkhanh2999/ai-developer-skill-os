import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.join(__dirname, '../.agents/skills');

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function parseFrontmatter(content) {
  const yamlString = extractFrontmatter(content);
  if (!yamlString) return null;

  const extract = (key, isArray = false) => {
    if (isArray) {
      const arrayMatch = yamlString.match(new RegExp(`^${key}:\\s*\\n(?:\\s+-.*\\n)+`, 'm'));
      if (arrayMatch) {
        return arrayMatch[0].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^\\s*-\\s*["']?([^"']+)["']?/, '$1').trim());
      }
      return null;
    }
    const m = yamlString.match(new RegExp(`^${key}:\\s*(.+)`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
  };

  const name = extract('name');
  const version = extract('version') || '7.5.0';
  let status = extract('status');
  
  if (!status && version.startsWith('8.')) {
      status = 'stable';
  } else if (!status) {
      status = 'legacy';
  }

  return {
    name,
    version,
    status,
    hasIntent: yamlString.includes('intent:'),
    hasWorkflow: yamlString.includes('workflow:'),
    hasVerification: yamlString.includes('verification:'),
    hasSelection: yamlString.includes('selection:')
  };
}

function validate() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error('Skills directory not found:', SKILLS_DIR);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR)
    .filter(d => !d.startsWith('_') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());

  let totalScanned = 0;
  let stableValid = 0;
  let stableTotal = 0;
  let legacyIgnored = 0;
  let missingRequiredCount = 0;

  for (const dir of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf8');
    const meta = parseFrontmatter(content);
    if (!meta || !meta.name) continue;

    totalScanned++;

    if (meta.status === 'stable' || meta.status === 'experimental') {
      stableTotal++;
      if (meta.hasIntent && meta.hasWorkflow && meta.hasVerification && meta.hasSelection) {
        stableValid++;
      } else {
        missingRequiredCount++;
        console.warn(`[WARN] ${meta.name} is missing required V8 fields`);
      }
    } else {
      legacyIgnored++;
    }
  }

  console.log(`\nSkills scanned: ${totalScanned}`);
  console.log(`\nStable/Experimental:`);
  console.log(`${stableValid}/${stableTotal} valid`);
  console.log(`\nLegacy:`);
  console.log(`${legacyIgnored}/${legacyIgnored} ignored`);
  console.log(`\nMissing required:`);
  console.log(`${missingRequiredCount}`);

  if (missingRequiredCount > 0) {
      process.exit(1);
  }
}

validate();
