---
# ── Identity ───────────────────────────────────────────────
name: qk-ui-system-builder
version: 9.2.0
status: stable
description: "Xây dựng Design System và token library từ DESIGN.md — không tự đặt ra token ngoài contract. Dùng skill này khi user nhắc đến: design system, token, setup css, ui system, tạo design system, cấu hình token — kể cả khi chỉ nói 'tạo file tailwind tokens từ bảng màu này'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - ui-system-design
  - frontend-development

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "design system"
  - "token"
  - "setup css"
  - "ui system"
  - "tạo design system"
  - "cấu hình token"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-ui-builder

knowledge_scope:
  owns:
    - design-tokens
    - ui-system
  references:
    - design-system

decision_boundary:
  owns:
    - tokens
    - ui-system
  does_not_own:
    - page implementation
    - visual direction
  conflicts_with:
    - qk-design-system-engineering

knowledge_dependencies:
  - design-intelligence

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: edit_files
produces: [code, tokens]
consumes: [design-md]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ui-system-builder — Design System & Token Constructor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm hiện thực hóa hệ thống Design Tokens (màu sắc, typography, spacing, shadows, radius) thành mã nguồn (CSS Variables, Tailwind Config, hoặc TypeScript Tokens) dựa trên tài liệu thiết kế (`DESIGN.md`). **Tuyệt đối không tự ý bịa đặt token ngoài hợp đồng thiết kế.**

---

## Preconditions

Trước khi tạo hoặc sửa đổi file token, AI BẮT BUỘC kiểm tra:

- [ ] Tìm và đọc file đặc tả thiết kế (`DESIGN.md` hoặc styleguide document).
- [ ] Xác định CSS framework đang sử dụng từ `.agents/DEV_PROFILE.md` (Tailwind CSS, CSS Modules, Styled Components, Vanilla CSS).
- [ ] Kiểm tra xem đã có hệ thống tokens cũ chưa (tránh ghi đè làm vỡ giao diện đang chạy).
- [ ] Nếu không có `DESIGN.md` và user không cung cấp giá trị màu sắc/kích thước cụ thể:
  → **EXIT: BLOCKED**
  → Báo cáo user yêu cầu cung cấp bảng màu (Palette) hoặc file quy chuẩn thiết kế trước.

---

## Scope

✅ Skill này làm:
- Chuyển đổi mã màu Hex/HSL thành semantic CSS custom properties (`--color-primary`, `--color-surface-base`).
- Cấu hình file `tailwind.config.js` / `tailwind.config.ts` khớp chính xác với Design Tokens.
- Khai báo token cho Spacing (bội số của 4px/8px), Font sizes, Border Radius, Shadows, Transitions.
- Tạo theme hỗ trợ Light/Dark mode qua CSS variables.
- Xuất type definition TypeScript cho autocomplete token trong code.

❌ Skill này KHÔNG làm:
- Dựng các màn hình hay component hoàn chỉnh (→ `qk-ui-builder`).
- Định nghĩa chiến lược quy chuẩn thiết kế cấp cao (→ `qk-design-system-engineering`).
- Sửa đổi business logic backend.

---

## Execution Steps

### Step 1 — Parse Design Specs & Contracts
```
Inputs:  DESIGN.md, Bảng màu từ user
Actions:
  - Trích xuất: Primitive tokens (Brand colors, Neutrals, Font families).
  - Trích xuất: Semantic tokens (Background, Foreground, Border, Primary, Destructive).
  - Phân loại thang đo Spacing, Radius và Elevation (box-shadow).
Output: Structured Token Contract
```

### Step 2 — CSS Variable & Theme Definition
```
Inputs:  Structured Token Contract
Actions:
  - Khởi tạo `:root` chứa biến màu Light mode.
  - Khởi tạo `.dark` hoặc `[data-theme="dark"]` chứa biến màu Dark mode tương ứng.
  - Bảo đảm tỉ lệ tương phản đạt chuẩn WCAG AA giữa Foreground và Background.
Output: globals.css / theme.css
```

### Step 3 — Framework Config Integration
```
Inputs:  globals.css, Tailwind config (hoặc tương đương)
Actions:
  - Mở rộng (extend) theme của Tailwind: colors, spacing, borderRadius, fontSize.
  - Ánh xạ trực tiếp sang `var(--...)` để tận dụng tính năng theme switching động.
Output: tailwind.config.ts / tokens.ts
```

### Step 4 — Verification & Type Generation
```
Inputs:  Generated config files
Actions:
  - Kiểm tra cú pháp config file.
  - Đảm bảo token types được export rõ ràng cho IDE autocomplete.
Exit: SUCCESS
```

---

## Prompt Template

```
Tài liệu thiết kế: [Đường dẫn DESIGN.md hoặc paste bảng màu]
Framework CSS:     [Tailwind CSS / CSS Modules / Vanilla CSS]
Dark Mode:         [Có hỗ trợ không — class / data-theme / media query]
Yêu cầu riêng:     [Cần bổ sung font chữ mới, radius đặc biệt, ...]
```
