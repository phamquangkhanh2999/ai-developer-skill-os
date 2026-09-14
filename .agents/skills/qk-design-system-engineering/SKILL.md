---
# ── Identity ───────────────────────────────────────────────
name: qk-design-system-engineering
version: 9.2.0
status: experimental
description: "Quản trị hệ thống thiết kế (Định nghĩa quy tắc hệ thống, tokens, các biến thể component). Dùng skill này khi user nhắc đến: định nghĩa design system, cấu trúc token, quy chuẩn ui, design tokens, component variants, quản trị thiết kế — kể cả khi chỉ nói 'chuẩn hóa lại cách đặt tên tokens và variants của nút'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - design-system
  - tokens
  - component-library
  - accessibility

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "định nghĩa design system"
  - "cấu trúc token"
  - "quy chuẩn ui"
  - "design tokens"
  - "component variants"
  - "quản trị thiết kế"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-ui-system-builder
  - qk-ui-builder

knowledge_scope:
  domain:
    - design-system
    - tokens
  concepts:
    - visual-consistency
    - components-rules
  references:
    - architecture
    - anti-patterns

decision_boundary:
  owns:
    - tokens
    - components rules
    - design governance
  does_not_own:
    - page implementation
    - business logic
  conflicts_with:
    - qk-ui-system-builder

knowledge_dependencies:
  - design-intelligence
  - accessibility-guidelines
  - component-patterns

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
side_effects: read_only
produces: [report, tokens_definition]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-design-system-engineering — Design System Governance & Architecture

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm quản trị kiến trúc hệ thống thiết kế (Design System Governance), định nghĩa các tầng abstraction của Token (Global → Semantic → Component-scoped), chuẩn hóa Component API (Props, Variants theo CVA - Class Variance Authority) và thiết lập quy tắc mở rộng dài hạn.

---

## Preconditions

Trước khi định nghĩa quy chuẩn design system, AI BẮT BUỘC kiểm tra:

- [ ] Xác định triết lý thiết kế và framework UI hiện tại (React, Vue, Web Components) từ `.agents/DEV_PROFILE.md`.
- [ ] Kiểm tra hệ thống tokens và component library hiện hữu (nếu có).
- [ ] Xác định phương pháp quản lý variant (CVA, Stitches, Vanilla CSS, Tailwind).
- [ ] Nếu có sự xung đột giữa các biến thể hoặc phá vỡ tính nhất quán cốt lõi:
  → **EXIT: BLOCKED**
  → Báo cáo user ma trận xung đột và đề xuất nguyên tắc chuẩn hóa trước khi ban hành spec.

---

## Scope

✅ Skill này làm:
- Thiết kế hệ thống phân cấp Tokens 3 tầng:
  1. Primitive / Global Tokens: Giá trị thô (`blue-500: #3b82f6`, `spacing-4: 16px`).
  2. Semantic / System Tokens: Ý nghĩa sử dụng (`color-intent-primary`, `surface-background-elevated`).
  3. Component Tokens: Riêng cho component (`button-primary-bg`, `card-border-radius`).
- Định nghĩa Component Variant Matrix (Primary, Secondary, Outline, Ghost, Destructive; Sizes: sm, md, lg).
- Thiết lập quy tắc kế thừa (Design Governance) và tài liệu hóa `DESIGN.md`.
- Hướng dẫn cấu trúc props component theo hướng composable (Compound Components).

❌ Skill này KHÔNG làm:
- Tự động dựng giao diện các màn hình nghiệp vụ cụ thể (→ `qk-ui-builder`).
- Trực tiếp generate các file cấu hình build như tailwind.config (→ `qk-ui-system-builder`).
- Viết API hoặc truy vấn cơ sở dữ liệu.

---

## Execution Steps

### Step 1 — Token Hierarchy & Taxonomy Design
```
Inputs:  Yêu cầu quy chuẩn, Brand Identity
Actions:
  - Thiết lập quy ước đặt tên (Naming convention: category-context-property-variant-state).
  - Phân tách rạch ròi 3 tầng: Primitive → Semantic → Component.
  - Đảm bảo tính linh hoạt khi thay đổi chủ đề (Theming / Multi-brand).
Output: Token Taxonomy Specification
```

### Step 2 — Component Variant & API Matrix
```
Inputs:  Token Taxonomy, Target UI Components (Button, Input, Card, Modal)
Actions:
  - Định nghĩa ma trận biến thể (Variants: intent, size, state).
  - Soạn thảo hợp đồng TypeScript Props cho từng component chuẩn (sử dụng Class Variance Authority).
Output: Component API Contracts
```

### Step 3 — Governance & Documentation
```
Inputs:  Taxonomy & Component Contracts
Actions:
  - Cập nhật hoặc khởi tạo file `DESIGN.md` ở root dự án.
  - Viết hướng dẫn sử dụng (Do's and Don'ts) cho các lập trình viên khác tuân theo.
Output: DESIGN.md & Usage Guide
```

### Step 4 — Verification & Peer Review
```
Inputs:  Specification Draft
Actions:
  - Kiểm tra tính tương thích ngược với các component cũ đang chạy.
  - Xác nhận tính khả thi với UI developer.
Exit: SUCCESS
```

---

## Prompt Template

```
Hệ thống thiết kế: [Tên design system hoặc đối tượng cần quy chuẩn]
Mục tiêu:          [Định nghĩa cấu trúc token 3 tầng / Chuẩn hóa variants cho Button & Input]
Công nghệ:         [React + Tailwind + CVA / Vue + SCSS / ...]
Quy tắc hiện tại:  [Tài liệu DESIGN.md cũ hoặc mô tả cách team đang dùng]
```