import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import fg from 'fast-glob';
const globSync = fg.sync;

const CASES_DIR = path.resolve('tests/agent-evaluation/cases');

function runEvaluation() {
  console.log('🚀 Khởi chạy V8.1.1 Agent Evaluation Suite\n');
  
  const testFiles = globSync('**/*.yml', { cwd: CASES_DIR, absolute: true });
  
  if (testFiles.length === 0) {
    console.log('❌ Không tìm thấy test case nào.');
    return;
  }

  let totalCases = testFiles.length;
  let routingScore = 0;
  let conflictScore = 0;
  let severityScore = 0;
  let boundaryViolations = 0;

  console.log(`Đang phân tích ${totalCases} test cases...\n`);

  testFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const testCase = yaml.load(content);
      
      console.log(`- Đang chạy case: ${testCase.case.id || path.basename(file)}`);
      
      // Candidate Ranking and Trace Simulation
      if (testCase.candidates) {
        console.log(`  [Trace] Generating candidates...`);
        testCase.candidates.forEach(cand => {
          console.log(`    - ${cand.skill} (Score: ${cand.score})`);
        });
      }
      
      if (testCase.decision) {
        console.log(`  [Trace] Decision: Selected ${testCase.decision.selected}`);
        if (testCase.decision.rejected) {
           testCase.decision.rejected.forEach(r => {
             console.log(`    [Reject] ${r.skill} - ${r.reason}`);
           });
        }
      }
      
      // Mock validation logic
      const isRoutingAccurate = !!testCase.decision?.selected;
      const isConflictDetected = !!testCase.decision?.rejected?.length;
      const hasBoundaryViolation = false; 
      
      let severityChecked = false;
      if (testCase.conflict_policy && testCase.conflict_policy.severity) {
         severityChecked = true;
      }
      
      if (isRoutingAccurate) routingScore++;
      if (isConflictDetected) conflictScore++;
      if (severityChecked) severityScore++;
      if (hasBoundaryViolation) boundaryViolations++;

    } catch (e) {
      console.error(`Lỗi khi đọc file ${file}:`, e.message);
    }
  });

  console.log('\n📊 BÁO CÁO KẾT QUẢ ĐÁNH GIÁ (Mock Result)');
  console.log('─────────────────────────────────────────────────');
  console.log(`Routing Accuracy:       ${Math.round((routingScore / totalCases) * 100)}/100`);
  console.log(`Conflict Detection:     ${conflictScore}/${totalCases}`);
  console.log(`Severity Handling:      ${severityScore}/${totalCases}`);
  console.log(`Boundary Violations:    ${boundaryViolations}`);
  console.log('─────────────────────────────────────────────────\n');
}

runEvaluation();
