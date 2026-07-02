---
name: qk-ui-audit
version: 3.1.0
updated: 2026-07-02
description: Audit UI for Consistency, Accessibility, Responsive, and Performance.
category: validation
behavior: static-analysis
intent: review-code
priority: medium
tags: [ui, audit, frontend, a11y, responsive]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to check the UI, review styling, or run an audit on a component.
inputs: [Target UI component, File path]
outputs: [UI Audit Score, Fix recommendations]
allowed_tools: [grep_search, read_file]
pipeline: [analyze, review, validate, complete]
---

# 🛠️ qk-ui-audit - Standard Operating Procedure

> **Goal:** Kiểm toán chất lượng Giao diện Người dùng (UI QA). Tìm ra các lỗi hiển thị, sự thiếu đồng nhất và vi phạm Accessibility (a11y).

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Scan UI):**
   - Read the UI component's source code.
   - Look for inline styles (`style={{...}}`) and hardcoded magic numbers (e.g., `px`, `%` instead of standard tokens).
2. **Review (Consistency & Responsive):**
   - Check if standard Design System tokens (e.g., Tailwind classes like `p-4`, `text-lg`) are used.
   - Check for mobile-first implementation (e.g., base classes for mobile, `md:` for desktop).
3. **Validate (Accessibility - A11y):**
   - Verify `<img>` tags have `alt` attributes.
   - Verify `<button>` tags without text have `aria-label`.
   - Verify interactive `<div>` elements have `role="button"` and `tabIndex`.
4. **Complete (Report):**
   - Calculate a rough score (0-100) based on violations.

## 🛡️ 3. Constraints & Rules

- **Audit Only:** Do not modify the code automatically unless the user explicitly requests you to apply the fixes.
- **Evidence Based:** Point out the exact line number where the violation occurs.

## 🌳 3. Decision Tree

```text
Does the component contain hardcoded `#hex` colors or `px` values?
  ├── YES → Deduct Consistency score. Recommend using Design Tokens.
  └── NO → Pass.

Does the component have clickable `<div>` elements?
  ├── YES → Deduct A11y score. Recommend using `<button>` or adding roles.
  └── NO → Pass.
```

## 🤝 4. Handoff Pipeline

1. `complete`: Generate the UI Audit Report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Chấm điểm Giao diện (Score: X/100).
- **Chi tiết (Changes):** Liệt kê các lỗi Consistency, A11y, Responsive (ghi rõ dòng).
- **Nguyên nhân (Reasoning):** Tại sao lại đánh lỗi điểm đó.
- **Hành động tiếp (Next Action):** Hỏi User có muốn tự động sửa các lỗi này không.
