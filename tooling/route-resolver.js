/**
 * Offline routing aid, not an Antigravity runtime hook.
 * User intent/mode precedes domain keywords. Unclear intent stays at intake.
 * Never use this heuristic as permission to mutate files or services.
 */
export function resolveSkillRoute(prompt) {
  const p = String(prompt ?? '').normalize('NFC').trim().toLowerCase();
  const has = (...terms) => terms.some(term => p.includes(term));
  const result = (skill, mode, reference = null) => ({ skill, mode, reference });
  const feature = (mode, ref = null) => result('qk-feature-delivery', mode, ref);
  const domain = () => {
    if (has('database', 'sql', 'query', 'backend', 'ingestion', 'dữ liệu', 'migration', 'qk-backend-data')) return 'references/backend-data.md';
    if (/\b(ui|css|mobile|component)\b/.test(p) || has('giao diện', 'spacing', 'qk-ui-engineer', 'nút ')) return 'references/ui.md';
    return null;
  };

  if (!p) return result('intake', 'clarify');
  // The requested artifact stays the same even when implementation is forbidden.
  if (has('viết lại prompt', 'viết prompt', 'chuẩn hóa prompt', 'tối ưu prompt', 'qk-prompt-compiler', 'đừng chạy nó')) {
    return feature('prompt-only', 'references/prompt-authoring.md');
  }
  if (has('chỉ viết prd', 'chỉ viết spec', 'viết spec', 'viết prd', 'qk-product-spec')) {
    return feature('plan-only', 'references/requirements.md');
  }
  if (has('chỉ review', 'review code', 'code review', 'security audit', 'audit code', 'đánh giá code', 'review auth', 'review ')) {
    return result('qk-code-review', 'review', has('postman') ? 'references/api-discovery.md' : domain());
  }
  if (has('giải thích', 'bộ này dùng thế nào', 'hướng dẫn sử dụng', 'chọn skill gì', 'qk-orchestrator') || /\bhelp\b/.test(p)) {
    return result('intake', 'help', 'references/context-discovery.md');
  }
  if (has('discovery-only', 'chỉ khám phá', 'chỉ khảo sát', 'phân tích postman', 'phân tích collection', 'khám phá api') || (has('qk-api-data-discovery') && !has('tích hợp'))) {
    return feature('discovery-only', has('api', 'postman', 'collection') ? 'references/api-discovery.md' : null);
  }
  // A write restriction by itself does not identify review vs explanation vs planning.
  if (has('đừng sửa', 'không sửa code', 'chưa viết code', 'chưa viết')) return result('intake', 'clarify');

  const bug = has('sửa lỗi', 'fix lỗi', 'lỗi', 'bug', 'crash', 'exception', 'not working', 'hỏng', 'sai lệch', 'bị lệch', 'ghi trùng', 'spacing');
  const appLogic = has('nghiệp vụ', 'ingestion', 'dedup', 'ghi trùng', 'logic code', 'unit test fail', 'test logic', 'response sai', 'dữ liệu sai');
  const environment = has('docker', 'dockerfile', 'github actions', 'ci/cd', 'sửa ci', 'ci bị lỗi', 'runner', 'build image', 'release', 'deploy', 'pipeline ci') || /\bci\b/.test(p);
  if (bug && (appLogic || !environment)) return result('qk-bug-resolution', has('chưa rõ', 'chưa có log', 'không log') ? 'clarify' : 'fix', domain());
  if (environment) return result('qk-devops-release', 'ci');
  if (has('cập nhật readme', 'viết docs', 'tài liệu', 'swagger', 'project memory')) return result('qk-devops-release', 'docs');
  if (has('nâng dependency', 'upgrade', 'breaking change', 'update package')) return result('qk-code-cleaner', 'upgrade');
  if (has('viết test', 'unit test', 'integration test', 'bổ sung test')) return result('qk-code-cleaner', 'test', domain());
  if (has('tách hàm', 'tách file', 'giữ nguyên hành vi', 'refactor', 'tái cấu trúc', 'clean code')) return result('qk-code-cleaner', 'refactor', domain());
  if (has('tích hợp api', 'consume api', 'bind data')) return feature('build', 'references/backend-data.md');
  if (has('postman')) return feature('discovery-only', 'references/api-discovery.md');
  if (has('làm hệ thống', 'hệ thống quản lý')) return feature('clarify', 'references/requirements.md');
  if (has('thêm ', 'tạo ', 'xây dựng', 'làm tính năng', 'đổi ', 'qk-ui-engineer', 'qk-backend-data')) return feature('build', domain());
  return result('intake', 'clarify');
}
