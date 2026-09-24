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
  const version = extract('version') || '10.2.0';
  let status = extract('status');
  
  if (!status && (version.startsWith('8.') || version.startsWith('9.'))) {
      status = 'stable';
  } else if (!status && version.startsWith('10.')) {
      status = 'stable';
  } else if (!status) {
      status = 'legacy';
  }

  return {
    name,
    version,
    status,
    hasWorkflow: yamlString.includes('workflow:'),
    hasTriggers: yamlString.includes('triggers:'),
    hasRules: yamlString.includes('rules:'),
    hasClassification: yamlString.includes('classification:'),
    hasReferences: yamlString.includes('references:'),
    isV10Frontmatter: yamlString.includes('classification:'),
    isLegacyFrontmatter: yamlString.includes('workflow:') && !yamlString.includes('classification:'),
    isV10Format: (yamlString.includes('classification:') && yamlString.includes('references:')) ||
                 (yamlString.includes('workflow:') && !yamlString.includes('classification:')),
    hasPlatforms: yamlString.includes('platforms:')
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
  let v10Valid = 0;
  let v10Total = 0;
  let legacyIgnored = 0;
  let missingRequiredCount = 0;

  for (const dir of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf8');
    const meta = parseFrontmatter(content);
    if (!meta || !meta.name) continue;

    totalScanned++;

    if (meta.version && meta.version.startsWith('10.')) {
      v10Total++;
      const hasExitCodes = content.includes('Thoái Ra Mã') || content.includes('Exit Codes');
      const hasCompliance = content.includes('Compliance');
      const hasConfidence = content.includes('Confidence Model') || content.includes('Độ Tin Cậy');
      const hasEvidence = content.includes('Bằng Chứng') || content.includes('Evidence Format');
      const hasAllV10Sections = hasExitCodes && hasCompliance && hasConfidence && hasEvidence && meta.hasPlatforms;
      if (hasAllV10Sections) {
        v10Valid++;
      } else {
        missingRequiredCount++;
        const missing = [];
        if (!hasExitCodes) missing.push('Exit Codes');
        if (!hasCompliance) missing.push('Compliance');
        if (!hasConfidence) missing.push('Confidence Model');
        if (!hasEvidence) missing.push('Evidence Format');
        console.warn(`[WARN] ${meta.name} is missing V10 sections: ${missing.join(', ')}`);
      }
    } else {
      legacyIgnored++;
    }
  }

  console.log(`\nSkills scanned: ${totalScanned}`);
  console.log(`\nV10 Format:`);
  console.log(`${v10Valid}/${v10Total} valid`);
  console.log(`\nLegacy (pre-V10):`);
  console.log(`${legacyIgnored}/${legacyIgnored} ignored`);
  console.log(`\nMissing required:`);
  console.log(`${missingRequiredCount}`);

  if (missingRequiredCount > 0) {
      process.exit(1);
  }
}

validate();
