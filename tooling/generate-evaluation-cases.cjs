const fs = require('fs');
const path = require('path');

const cases = [
  { path: 'routing/frontend.yml', id: 'frontend-001', input: 'App React 100 pages tổ chức thế nào?', skill: 'qk-frontend-architecture', forbidden: ['qk-ui-builder'] },
  { path: 'routing/backend.yml', id: 'backend-001', input: 'Viết middleware auth cho API', skill: 'qk-access-policy', forbidden: ['qk-api-lifecycle'] },
  { path: 'routing/security.yml', id: 'sec-001', input: 'Kiểm tra xem thư viện có lỗi bảo mật không', skill: 'qk-security-audit', forbidden: ['qk-validation-gate'] },
  { path: 'routing/devops.yml', id: 'devops-001', input: 'Thiết lập pipeline github actions', skill: 'qk-devops-platform', forbidden: ['qk-production-release'] },
  { path: 'boundary/design-system-conflict.yml', id: 'bound-001', input: 'Tạo màu và typography cho thương hiệu mới', skill: 'qk-design-system-engineering', forbidden: ['qk-ui-system-builder'] },
  { path: 'boundary/ui-builder-conflict.yml', id: 'bound-002', input: 'Code nút bấm màu đỏ theo thiết kế figma', skill: 'qk-ui-builder', forbidden: ['qk-design-system-engineering', 'qk-frontend-architecture'] },
  { path: 'boundary/test-strategy-conflict.yml', id: 'bound-003', input: 'Lên chiến lược viết test cho app e-commerce', skill: 'qk-test-engineering', forbidden: ['qk-validation-gate'] },
  { path: 'boundary/spec-conflict.yml', id: 'bound-004', input: 'Viết tiêu chí nghiệm thu cho tính năng giỏ hàng', skill: 'qk-product-specification', forbidden: ['qk-feature-delivery'] },
  { path: 'boundary/architecture-conflict.yml', id: 'bound-005', input: 'Chia nhỏ component React cho dễ bảo trì', skill: 'qk-frontend-architecture', forbidden: ['qk-ui-builder'] },
  { path: 'workflow/spec-to-code.yml', id: 'wf-001', input: 'Từ ý tưởng app chat, viết spec xong mới làm', skill: 'qk-product-specification', forbidden: ['qk-feature-delivery'] },
  { path: 'workflow/release-gate.yml', id: 'wf-002', input: 'Đóng gói app nhưng nhớ check bảo mật trước', skill: 'qk-validation-gate', forbidden: ['qk-production-release'] },
  { path: 'workflow/security-pipeline.yml', id: 'wf-003', input: 'Quét hệ thống trước khi deploy', skill: 'qk-security-audit', forbidden: ['qk-production-release'] },
  { path: 'regression/legacy-routing.yml', id: 'reg-001', input: 'Danh sách lệnh', skill: 'qk-orchestrator', forbidden: ['qk-help'] },
  { path: 'regression/db-optimize.yml', id: 'reg-002', input: 'Câu query chậm', skill: 'qk-db-optimizer', forbidden: ['qk-bug-resolution'] },
  { path: 'regression/health-check.yml', id: 'reg-003', input: 'Code nợ kỹ thuật nhiều quá', skill: 'qk-project-health', forbidden: ['qk-engineering-standard'] }
];

cases.forEach(c => {
  const content = `case:
  id: ${c.id}
input:
  "${c.input}"
candidates:
  - skill: ${c.skill}
    score: 0.92
  - skill: ${c.forbidden[0] || 'qk-validation-gate'}
    score: 0.55
decision:
  selected:
    ${c.skill}
  rejected:
${c.forbidden.map(f => `    - skill: ${f}\n      reason: "outside boundary or conflict"`).join('\n')}
conflict_policy:
  severity: ${c.path.includes('boundary') ? 'critical' : (c.path.includes('routing') ? 'warning' : 'high')}
  action: ${c.path.includes('boundary') ? 'block' : (c.path.includes('routing') ? 'continue_with_notice' : 'require_confirmation')}
  expected_message: "Conflict detected in ${c.id}"
`;
  fs.writeFileSync(path.join('tests/agent-evaluation/cases', c.path), content);
});
console.log('15 test cases regenerated with conflict_policy.');
