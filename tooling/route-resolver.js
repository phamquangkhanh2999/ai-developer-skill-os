/**
 * Intent & Skill Routing Resolver
 * Prioritizes: User Constraints (Limits & Modes) → Core Task Goal → Domain References
 * Conforming to .agents/AGENTS.md (§1) and .agents/skill-aliases.yml.
 */

export function resolveSkillRoute(prompt) {
  const p = prompt.trim().toLowerCase();

  // ── LAYER 1: USER CONSTRAINTS & RESTRICTED MODES (Giới hạn người dùng) ──────

  // 1.1 Review-only constraint or Review intent
  const isReviewRequested =
    p.includes('chỉ review') ||
    p.includes('đừng sửa') ||
    p.includes('review code') ||
    p.includes('code review') ||
    p.includes('security audit') ||
    p.includes('audit code') ||
    p.includes('đánh giá code') ||
    p.includes('review auth');

  if (isReviewRequested) {
    let ref = null;
    if (p.includes('postman') || p.includes('api')) ref = 'references/api-discovery.md';
    else if (p.includes('database') || p.includes('sql') || p.includes('query')) ref = 'references/backend-data.md';
    else if (p.includes('ui') || p.includes('css') || p.includes('spacing')) ref = 'references/ui.md';
    return { skill: 'qk-code-review', mode: 'review', reference: ref };
  }

  // 1.2 Prompt-authoring only
  if (p.includes('viết lại prompt') || p.includes('đừng chạy nó') || p.includes('chuẩn hóa prompt') || p.includes('qk-prompt-compiler')) {
    return { skill: 'qk-feature-delivery', mode: 'prompt-only', reference: 'references/prompt-authoring.md' };
  }

  // 1.3 Discovery-only (API analysis without implementation)
  if (p.includes('chưa viết') || p.includes('chỉ khám phá') || p.includes('discovery-only') || (p.includes('qk-api-data-discovery') && !p.includes('tích hợp'))) {
    return { skill: 'qk-feature-delivery', mode: 'discovery-only', reference: 'references/api-discovery.md' };
  }

  // 1.4 Plan-only (Spec/PRD without code)
  if (p.includes('chỉ viết prd') || p.includes('chỉ viết spec') || p.includes('qk-product-spec')) {
    return { skill: 'qk-feature-delivery', mode: 'plan-only', reference: 'references/requirements.md' };
  }

  // 1.5 Intake & System Help
  if (p.includes('qk-orchestrator') || p.includes('bộ này dùng thế nào') || p.includes('hướng dẫn sử dụng') || p.includes('chọn skill gì') || p.includes('help')) {
    return { skill: 'intake', mode: 'help', reference: 'references/context-discovery.md' };
  }

  // ── LAYER 2: CORE TASK INTENT (Mục tiêu cốt lõi) ───────────────────────────

  // 2.1 DevOps & CI/CD & Documentation (qk-devops-release)
  // Environment issues (CI, docker, pipeline) take precedence over general app bugs
  const isDevOpsIntent =
    p.includes('sửa ci') ||
    p.includes('ci bị lỗi') ||
    /\bci\b/i.test(p) ||
    p.includes('ci/cd') ||
    p.includes('docker') ||
    p.includes('pipeline') ||
    p.includes('github actions') ||
    p.includes('release');

  if (isDevOpsIntent) {
    return { skill: 'qk-devops-release', mode: 'ci', reference: null };
  }
  if (p.includes('cập nhật readme') || p.includes('viết docs') || p.includes('tài liệu') || p.includes('swagger')) {
    return { skill: 'qk-devops-release', mode: 'docs', reference: null };
  }

  // 2.2 Bug Resolution (Lỗi, sai lệch contract/thiết kế, crash, exception, spacing)
  // Higher priority than legacy skill aliases or generic build keywords!
  const isBugIntent =
    p.includes('sửa lỗi') ||
    p.includes('fix lỗi') ||
    p.includes('lỗi') ||
    p.includes('bug') ||
    p.includes('crash') ||
    p.includes('exception') ||
    p.includes('spacing') ||
    p.includes('lệch') ||
    p.includes('sai lệch') ||
    p.includes('not working') ||
    p.includes('hỏng');

  if (isBugIntent) {
    const isClarify = p.includes('không log') || p.includes('chưa rõ') || p.includes('chưa có log');
    let ref = null;
    if (p.includes('spacing') || p.includes('lệch') || p.includes('mobile') || p.includes('ui') || p.includes('qk-ui-engineer') || p.includes('css')) {
      ref = 'references/ui.md';
    } else if (p.includes('backend') || p.includes('database') || p.includes('query') || p.includes('migration') || p.includes('qk-backend-data')) {
      ref = 'references/backend-data.md';
    }
    return { skill: 'qk-bug-resolution', mode: isClarify ? 'clarify' : 'fix', reference: ref };
  }

  // 2.3 Refactoring & Maintenance (qk-code-cleaner)
  if (p.includes('nâng dependency') || p.includes('upgrade') || p.includes('breaking change') || p.includes('update package')) {
    return { skill: 'qk-code-cleaner', mode: 'upgrade', reference: null };
  }
  if (p.includes('tách hàm') || p.includes('giữ nguyên hành vi') || p.includes('refactor') || p.includes('tái cấu trúc') || p.includes('clean code')) {
    return { skill: 'qk-code-cleaner', mode: 'refactor', reference: null };
  }

  // 2.4 API Discovery & Integration
  if (p.includes('postman') || p.includes('tích hợp api') || p.includes('khám phá api')) {
    return { skill: 'qk-feature-delivery', mode: 'discovery', reference: 'references/api-discovery.md' };
  }

  // ── LAYER 3: FEATURE DELIVERY & DOMAIN EXPERTISE (Làm mới & Chuyên môn) ────

  // Broad / Unclarified business requirements
  if (p.includes('làm hệ thống') || p.includes('hệ thống quản lý') || p.includes('viết spec') || p.includes('viết prd')) {
    return { skill: 'qk-feature-delivery', mode: 'clarify', reference: 'references/requirements.md' };
  }

  // UI features (thêm nút, giao diện, CSS, qk-ui-engineer)
  if (p.includes('thêm nút') || p.includes('nút xuất') || p.includes('giao diện') || p.includes('ui') || p.includes('qk-ui-engineer') || p.includes('component')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/ui.md' };
  }

  // Backend & Data features (phí ship, đơn cũ, database, migration, qk-backend-data)
  if (p.includes('đổi phí ship') || p.includes('giữ đơn cũ') || p.includes('database') || p.includes('migration') || p.includes('qk-backend-data') || p.includes('sql') || p.includes('query')) {
    return { skill: 'qk-feature-delivery', mode: 'build', reference: 'references/backend-data.md' };
  }

  // Default fallback
  return { skill: 'qk-feature-delivery', mode: 'build', reference: null };
}
