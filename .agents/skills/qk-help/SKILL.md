---
# ── Identity ───────────────────────────────────────────────
name: qk-help
version: 8.3.1
status: deprecated
description: "Hiển thị danh sách skills V8 và hướng dẫn dùng lệnh ./qk-[skill-name]."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - skill-discovery
  - command-help

complexity:
  level: low
  criteria:
    files_affected: "1"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "help"
  - "có những skill nào"
  - "danh sách skill"
  - "làm sao để dùng"
  - "qk-help"

# ── V8: References ─────────────────────────────────────────
workflow: documentation

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-orchestrator

knowledge_scope:
  owns:
    - skill-directory
  references:
    - registry

# ── V8: Verification ───────────────────────────────────────
verification:
  required: false
  strategy: none

selection:
  priority: low
  confidence_threshold: 0.75

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: none
produces: [skill-recommendation]
consumes: [registry]

token_budget:
  max_files_read: 1
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS]
---

# 🆘 V8.3 Skill System Help

> Lệnh: `./qk-help`

Hệ thống AI Developer Skin V8.3 (Zero-Trust & Anti-Slop Architecture) sử dụng kiến trúc **Governed Capabilities** thay vì Prompt Engineering truyền thống. Mỗi kỹ năng (skill) là một module độc lập, có Decision Boundary (giới hạn quyền hạn) và Token Budget (ngân sách thực thi) riêng.

## 🛠 Cách Kích Hoạt Kỹ Năng
Gõ `./qk-[tên-skill] [yêu cầu của bạn]`

**Ví dụ:**
- `./qk-ui-builder tạo trang login với Tailwind`
- `./qk-feature-delivery thêm tính năng quên mật khẩu`
- `./qk-bug-resolution fix lỗi hydration mismatch ở trang chủ`
- `./qk-project-health đánh giá codebase`

## 🚦 V8.3 Quality Gates
Hệ thống áp dụng các checkpoint nghiêm ngặt. Nếu không qua được, AI sẽ tự động Block:
1. **Validation Gate:** `qk-validation-gate` chạy lint/test/type-check.
2. **Release Gate:** `qk-production-release` kiểm tra 8 cổng trước khi deploy.
3. **Web Quality Gate:** `qk-web-quality-gate` check A11y, SEO, Performance.
4. **UI Audit Gate:** `qk-ui-audit` check Anti-Slop (R-C-09).
5. **Security Gate:** Tất cả các luồng phải tuân thủ Zero-Trust (R-SEC-04).

## 📋 Xem Danh Sách Kỹ Năng
Các kỹ năng được chia theo nhóm (Capabilities).
Đọc file `.agents/skills/skills.json` hoặc thư mục `.agents/skills/` để xem toàn bộ danh sách.

*Mẹo: Nếu không biết dùng skill nào, hãy nhờ `qk-orchestrator` phân tích yêu cầu của bạn.*
