---
name: qk-ui-audit
purpose: Kiểm toán giao diện (Consistency, Accessibility, Responsive).
mode_supported: [standard]
input: [UI Code]
output: [Audit Report]
workflow: [1. Check Radius/Color -> 2. Check A11y -> 3. Check Mobile]
allowed_tools: [read_file]
handoff_to: [none]
---

# 🛠️ qk-ui-audit - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Kiểm toán giao diện (Consistency, Accessibility, Responsive).

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `none`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Accessibility (A11y) Audit

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User asks to "make this accessible", "fix a11y", or "audit accessibility"
- Building complex interactive components (modals, dropdowns, tabs, sliders)
- Preparing an app for production or public release
- Project audit flags missing semantic HTML or ARIA issues

---

## Scope

- ✅ **Keyboard Navigation:** Ensure all interactive elements are reachable via `Tab`, and operable via `Enter`/`Space`/Arrows. Focus management (trapping focus in modals).
- ✅ **Screen Reader Support:** Add proper `aria-` attributes, `alt` text, and visually hidden text (`sr-only`).
- ✅ **Semantic HTML:** Replace `div` soups with `<nav>`, `<main>`, `<article>`, `<button>`, etc.
- ✅ **Color Contrast:** Verify text vs. background contrast meets WCAG AA (4.5:1 for normal text).
- ✅ **Form Labels:** Ensure all inputs have associated `<label>`s or `aria-label`s.

---

## Non-goals

- ❌ Do NOT completely redesign the UI visually (unless fixing a severe contrast issue, and even then, ask first).
- ❌ Do NOT overuse ARIA. The first rule of ARIA is: "No ARIA is better than bad ARIA." Use semantic HTML first.

---

## Workflow

### Phase 1 — Semantic HTML Check

Scan the component for basic HTML semantics:
- Are buttons actually `<button>` elements (not `<div onClick>`)?
- Are links actually `<a>` elements with `href`s?
- Do images have meaningful `alt` text (or `alt=""` if decorative)?
- Are headings (`h1`-`h6`) in a logical, unbroken hierarchy?

### Phase 2 — Keyboard & Focus Management

- Can the user tab through the component logically?
- Does every interactive element have a visible focus state (`:focus-visible`)?
- For Modals/Dialogs: Is focus trapped inside when open? Is focus restored when closed?
- For custom widgets (Tabs/Dropdowns): Implement correct arrow key navigation per WAI-ARIA authoring practices.

### Phase 3 — Screen Reader (ARIA) Check

- Do custom interactive elements have correct `role`s (e.g., `role="tablist"`)?
- Is dynamic state communicated? (`aria-expanded`, `aria-selected`, `aria-invalid`, `aria-busy`).
- Are icon-only buttons properly labeled? (`aria-label` or `<span className="sr-only">Label</span>`).
- Are dynamic live regions used for important announcements (`aria-live="polite"` or `assertive`)?

### Phase 4 — Contrast & Visuals

- Check text colors against backgrounds.
- Ensure form fields have visible borders or indicators.
- Ensure information is not conveyed *only* by color (e.g., a red border for an error must also have error text).

---

## Decision Tree

```
Is the component a native HTML element (e.g., standard `<button>`)?
  ├── Yes → Ensure it has accessible text/labels. No ARIA roles needed.
  └── No  → (e.g., a custom `div` acting as a checkbox)
              ├── Can it be refactored to use native HTML?
              │     ├── Yes → Refactor to native HTML `<input type="checkbox">`
              │     └── No  → Apply `role="checkbox"`, `tabIndex={0}`, `aria-checked`, and keyboard event handlers.
```

---

## Output Format

```
♿ Accessibility Audit Report
─────────────────────────────────────────────────
Component:  [ComponentName]

Issues Found & Fixed:
  ✅ Semantic HTML: Replaced `<div onClick>` with `<button>`
  ✅ Screen Readers: Added `aria-label` to icon-only close button
  ✅ Keyboard: Added focus trap inside the Modal
  ✅ Forms: Associated `<label htmlFor="email">` with Input

⚠️ Remaining Warnings (Manual Check Required):
  - Please verify color contrast of primary button in light mode (needs 4.5:1 ratio).

🔗 Next Steps:
  Code updated. Recommend testing with a screen reader (VoiceOver/NVDA).
```

---

## Validation Checklist

- [ ] Semantic HTML preferred over ARIA
- [ ] Keyboard navigation (Tab + Enter/Space) works correctly
- [ ] Focus is visible on all interactive elements
- [ ] Forms have proper labels
- [ ] Icon-only buttons have accessible names
