---
name: qk-ui-system-builder
version: version: 3.1.5
updated: 2026-07-02
description: Xây dựng và duy trì Design Systems, Token extraction, và các thư viện UI dùng chung.
category: frontend
behavior: development
intent: implement-feature
priority: medium
tags: [design-system, tokens, shared-components, storybook]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to create a shared component (Button, Input) or extract a color palette.
inputs: [UI Requirements]
outputs: [Shared Components, Design Tokens]
allowed_tools: [write_to_file, read_file]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-ui-system-builder - Standard Operating Procedure

> **Goal:** Đảm bảo tính Nhất quán Giao diện (Consistency). Quản lý Design Tokens và xây dựng thư viện Shared Components.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Token Extraction):**
   - Extract raw colors and typography into CSS Variables or Tailwind config.
2. **Implement (Component Factory):**
   - Build foundational components (`<Button>`, `<TextInput>`) using generic polymorphic props if possible (e.g., `as="a"` or `as="button"`).
3. **Validate (Story/Documentation):**
   - Ensure every variation (primary, secondary, disabled) is accounted for.

## 🛡️ 2. Constraints & Rules

- **Stateless:** System UI components should NEVER have their own backend logic or hardcoded strings.
- **Extendable:** Always allow users to pass `className` and `...props` to the base element.

## 🤝 3. Handoff Pipeline

1. `engineering-standard`: Verify naming conventions.
2. `complete`: Output the Design System Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Thư viện Component vừa cập nhật.
- **Chi tiết (Changes):** Liệt kê các variant (màu sắc, kích cỡ).
