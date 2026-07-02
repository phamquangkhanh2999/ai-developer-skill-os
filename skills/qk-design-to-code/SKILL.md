---
name: qk-design-to-code
version: 3.1.2
updated: 2026-07-02
description: Convert Figma/Images to semantic, pixel-perfect code components.
category: frontend
behavior: development
intent: implement-feature
priority: high
tags: [ui, figma, frontend, styling, css]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User uploads an image mockup or provides a design requirement for a UI component.
inputs: [Image/Mockup, Framework choice]
outputs: [Code component, CSS/Tailwind classes]
allowed_tools: [write_to_file, read_file]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-design-to-code - Standard Operating Procedure

> **Goal:** Dịch thiết kế (Mockups/Images) thành mã nguồn (React, Vue, HTML/CSS) với độ chính xác Pixel-Perfect.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Deconstruct Design):**
   - Look at the provided mockup.
   - Break it down from Outside-In (Container -> Rows -> Columns -> Elements).
2. **Plan (Token Mapping):**
   - Map colors, fonts, and spacings to existing Design System Tokens (e.g., Tailwind classes `text-primary-500`, `gap-4`).
3. **Implement (Code Construction):**
   - Write the semantic HTML (`<article>`, `<section>`, `<nav>`).
   - Apply styling.
4. **Validate (Responsive Check):**
   - Ensure the component uses relative units where necessary and scales on mobile.

## 🛡️ 2. Constraints & Rules

- **No Magic Values:** Do not use random hex codes or pixel values if a Design System is available.
- **Accessibility:** Always include `alt` for images and `aria-label` for icon-only buttons.

## 🤝 3. Handoff Pipeline

1. `engineering-standard`: Ensure the UI component has no business logic.
2. `validate`: Trigger `qk-ui-audit` checks.
3. `complete`: Generate the UI Component Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Tên Component vừa tạo.
- **Chi tiết (Changes):** File chứa component.
- **Rủi ro (Risks):** Vấn đề responsive nếu có.
