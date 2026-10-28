/**
 * Intent & Skill Routing Resolver
 * Maps natural language user prompts to core skills, modes, and required on-demand references
 * conforming to .agents/AGENTS.md (§1) and .agents/skill-aliases.yml.
 */

export function resolveSkillRoute(prompt) {
  const p = prompt.trim().toLowerCase();

  // 1. Direct legacy alias triggers
  if (p.includes('qk-orchestrator')) {
    return { skill: 'intake', mode: 'help', reference: 'references/context-discovery.md' };
  }
  if (p.includes('qk-product-spec')) {
    return { skill: 'qk-feature-delivery', mode: 'plan-only', reference: 'references/requirements.md' };
  }
  if (p.includes('qk-prompt-compiler')) {
    return { skill: 'qk-feature-delivery', mode: 'prompt-only', reference: 'references/prompt-authoring.md' };
  }
  if (p.includes('qk-api-data-discovery')) {
    return { skill: 'qk-feature-delivery', mode: 'discovery-only', reference: 'references/api-discovery.md' };
  }
  if (p.includes('qk-ui-engineer')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/ui.md' };
  }
  if (p.includes('qk-backend-data')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/backend-data.md' };
  }

  // 2. Intake / Help
  if (p.includes('bộ này dùng thế nào') || p.includes('hướng dẫn sử dụng') || p.includes('chọn skill gì')) {
    return { skill: 'intake', mode: 'help', reference: 'references/context-discovery.md' };
  }

  // 3. Prompt authoring (prompt-only)
  if (p.includes('viết lại prompt') || p.includes('đừng chạy nó') || p.includes('chuẩn hóa prompt')) {
    return { skill: 'qk-feature-delivery', mode: 'prompt-only', reference: 'references/prompt-authoring.md' };
  }

  // 4. API Discovery (discovery-only or discovery)
  if (p.includes('phân tích collection') || (p.includes('chưa viết') && p.includes('collection'))) {
    return { skill: 'qk-feature-delivery', mode: 'discovery-only', reference: 'references/api-discovery.md' };
  }
  if (p.includes('tích hợp api từ postman') || p.includes('khám phá api') || p.includes('postman')) {
    return { skill: 'qk-feature-delivery', mode: 'discovery', reference: 'references/api-discovery.md' };
  }

  // 5. Spec / PRD (plan-only)
  if (p.includes('chỉ viết prd') || p.includes('viết prd') || p.includes('viết spec')) {
    return { skill: 'qk-feature-delivery', mode: 'plan-only', reference: 'references/requirements.md' };
  }

  // 6. Review only
  if (p.includes('chỉ review') || p.includes('đừng sửa') || p.includes('review auth') || p.includes('security audit')) {
    return { skill: 'qk-code-review', mode: 'review', reference: null };
  }

  // 7. Refactor & cleaner
  if (p.includes('nâng dependency') || p.includes('upgrade') || p.includes('breaking change')) {
    return { skill: 'qk-code-cleaner', mode: 'upgrade', reference: null };
  }
  if (p.includes('tách hàm') || p.includes('giữ nguyên hành vi') || p.includes('refactor')) {
    return { skill: 'qk-code-cleaner', mode: 'refactor', reference: null };
  }

  // 8. DevOps & Docs
  if (p.includes('sửa ci') || p.includes('ci bị lỗi') || p.includes('docker') || p.includes('pipeline')) {
    return { skill: 'qk-devops-release', mode: 'ci', reference: null };
  }
  if (p.includes('cập nhật readme') || p.includes('viết docs') || p.includes('tài liệu')) {
    return { skill: 'qk-devops-release', mode: 'docs', reference: null };
  }

  // 9. Bug resolution
  if (p.includes('fix lỗi này') && (p.includes('không log') || p.includes('chưa rõ'))) {
    return { skill: 'qk-bug-resolution', mode: 'clarify', reference: null };
  }
  if (p.includes('sửa spacing') || p.includes('lệch trên mobile') || (p.includes('sửa') && p.includes('spacing'))) {
    return { skill: 'qk-bug-resolution', mode: 'fix', reference: 'references/ui.md' };
  }
  if (p.includes('api trả null') || p.includes('crash') || p.includes('lỗi') || p.includes('bug')) {
    return { skill: 'qk-bug-resolution', mode: 'fix', reference: null };
  }

  // 10. Feature delivery
  if (p.includes('làm hệ thống') || p.includes('hệ thống quản lý')) {
    return { skill: 'qk-feature-delivery', mode: 'clarify', reference: 'references/requirements.md' };
  }
  if (p.includes('thêm nút') || p.includes('nút xuất excel') || p.includes('giao diện') || p.includes('ui')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/ui.md' };
  }
  if (p.includes('đổi phí ship') || p.includes('giữ đơn cũ') || p.includes('database') || p.includes('migration')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/backend-data.md' };
  }

  // Default fallback
  return { skill: 'qk-feature-delivery', mode: 'build', reference: null };
}
