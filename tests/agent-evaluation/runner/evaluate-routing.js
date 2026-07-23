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
  let boundaryViolations = 0;

  console.log(`Đang phân tích ${totalCases} test cases...\n`);

  testFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const testCase = yaml.load(content);
      
      console.log(`- Đang chạy case: ${testCase.case.id || path.basename(file)}`);
      
      // Giả lập kết quả routing (Mock AI execution)
      // Trong môi trường production, bước này sẽ gọi đến qk-orchestrator API
      const isRoutingAccurate = true; // Mock
      const isConflictDetected = true; // Mock
      const hasBoundaryViolation = false; // Mock
      
      if (isRoutingAccurate) routingScore++;
      if (isConflictDetected) conflictScore++;
      if (hasBoundaryViolation) boundaryViolations++;

    } catch (e) {
      console.error(`Lỗi khi đọc file ${file}:`, e.message);
    }
  });

  console.log('\n📊 BÁO CÁO KẾT QUẢ ĐÁNH GIÁ (Mock Result)');
  console.log('─────────────────────────────────────────────────');
  console.log(`Routing Accuracy:       ${Math.round((routingScore / totalCases) * 100)}/100`);
  console.log(`Conflict Detection:     ${conflictScore}/${totalCases}`);
  console.log(`Boundary Violations:    ${boundaryViolations}`);
  console.log('─────────────────────────────────────────────────\n');
}

runEvaluation();
