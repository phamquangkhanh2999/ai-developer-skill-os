---
# ── Identity ───────────────────────────────────────────────
name: qk-ui-audit
version: 9.2.0
status: stable
description: "Kiểm toán chất lượng thiết kế UI với 57-check Anti-Slop checklist: spacing nhất quán, contrast ratio, component polish, interaction states. Output là nhận xét thiết kế và danh sách cần cải thiện. Dùng skill này khi user nhắc đến: review ui, audit giao diện, kiểm tra ui, ui quality, component spacing, design consistency, anti-slop — KHÔNG dùng cho đo hiệu năng hay SEO."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - ui-audit
  - codebase-health

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "review ui"
  - "audit giao diện"
  - "kiểm tra ui"
  - "ui quality"
  - "component spacing"
  - "design consistency"
  - "anti"


# ── V8: References ─────────────────────────────────────────
workflow: code-review

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
    - ui-standards
    - anti-slop
  references:
    - design-system
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

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
produces: [report]
consumes: [design-md, source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ui-audit — Anti-Slop UI Inspector

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm kiểm toán chi tiết tính thẩm mỹ, sự nhất quán và độ hoàn thiện thị giác của giao diện người dùng theo bộ **57-Check Anti-Slop Checklist**. Ngăn chặn triệt để tình trạng giao diện AI cẩu thả (AI-generated slop): lệch nhịp spacing, độ tương phản kém, thiếu states tương tác.

---

## Preconditions

Trước khi audit giao diện, AI BẮT BUỘC kiểm tra:

- [ ] Xác định các file UI component hoặc trang cần audit (`.tsx`, `.vue`, `.svelte`, `.html`, `.css`).
- [ ] Đọc file cấu hình thiết kế nếu có (`DESIGN.md`, `tailwind.config.js`, tokens file) để lấy chuẩn so sánh.
- [ ] Kiểm tra xem component có mã nguồn rõ ràng để phân tích styling không.
- [ ] Nếu component sử dụng inline style hoặc cấu trúc quá rối loạn không thể đọc được layout:
  → **EXIT: PARTIAL**
  → Báo cáo user tình trạng code kèm khuyến nghị refactor trước khi audit chi tiết.

---

## Scope

✅ Skill này làm:
- Rà soát 4 nhóm kiểm tra chính theo chuẩn Anti-Slop:
  1. Spacing & Grid System (4px/8px grid alignment, nhất quán padding/margin, không dùng giá trị arbitrary tùy tiện).
  2. Color & Contrast (Tỉ lệ tương phản văn bản/nền theo WCAG AA, tính nhất quán của bảng màu token).
  3. Typography & Hierarchy (Phân cấp kích cỡ font chữ, line-height, font-weight có trật tự).
  4. Interactive States (Đầy đủ hover, active, focus-visible, disabled, loading, skeleton states).
- Xuất danh sách các điểm vi phạm (Slop items) kèm vị trí dòng code cụ thể.
- Đề xuất mã CSS / Tailwind class sửa đổi chuẩn chỉnh.
- Chế độ hoạt động: **Read-Only / Inspection Report** (không tự sửa code khi chưa duyệt).

❌ Skill này KHÔNG làm:
- Đo lường hiệu năng kỹ thuật web, Core Web Vitals, SEO tags (→ `qk-web-quality-gate`).
- Xây dựng component mới từ bản vẽ Figma (→ `qk-ui-builder`).
- Định nghĩa lại toàn bộ hệ thống Design Tokens từ gốc (→ `qk-design-system-engineering`).

---

## Execution Steps

### Step 1 — Target Ingestion & Design Baseline
```
Inputs:  Danh sách file UI, DESIGN.md / Tailwind config
Actions:
  - Nạp source code component.
  - Xác định Design Tokens chuẩn của dự án (màu sắc, spacing scales, border-radius).
Output: Component AST / Markup map
```

### Step 2 — 57-Check Anti-Slop Audit
```
Inputs:  Component code, Design tokens
Actions:
  - Quét Spacing: Phát hiện các giá trị cứng (hardcoded px) thay vì dùng token (ví dụ: mt-[13px]).
  - Quét Visual Hierarchy: Đảm bảo tiêu đề và nội dung có sự phân biệt rõ ràng.
  - Quét Interactive States: Kiểm tra các button, input, link xem có `:focus-visible` và `:disabled` chuẩn không.
  - Quét Layout Bugs: Xử lý tràn chữ (overflow, text truncation), co giãn responsive.
Output: Audit findings categorized by severity
```

### Step 3 — Remediation Formulation
```
Inputs:  Audit findings
Actions:
  - Viết giải thích ngắn gọn lý do vi phạm.
  - Cung cấp đoạn code so sánh Before/After cụ thể.
Output: Anti-Slop Audit Report
```

### Step 4 — Verification & Delivery
```
Inputs:  Anti-Slop Audit Report
Actions:
  - Đảm bảo các khuyến nghị tuân thủ 100% stack khai báo trong DEV_PROFILE.md.
  - Bàn giao báo cáo cho kỹ sư frontend.
Exit: SUCCESS
```

---

## Prompt Template

```
UI Component / Trang: [Đường dẫn file component hoặc page cần kiểm tra]
Design Tokens:       [File cấu hình tailwind.config / css tokens / DESIGN.md]
Vấn đề nghi ngờ:    [Bị lệch spacing, nút bấm xấu, thiếu hover state, ...]
```