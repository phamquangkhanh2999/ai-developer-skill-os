---
name: qk-docs
version: 3.1.4
updated: 2026-07-02
description: Write and maintain human-readable project documentation.
category: documentation
behavior: static-analysis
intent: maintain
priority: low
tags: [docs, markdown, jsdoc, readme]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to write docs, update the README, or generate JSDoc comments.
inputs: [Source code, Task context]
outputs: [Markdown Documentation, JSDoc]
allowed_tools: [read_file, write_to_file]
pipeline: [analyze, implement, validate, complete]
---

# 🛠️ qk-docs - Standard Operating Procedure

> **Goal:** Đóng vai trò là "Technical Writer". Viết tài liệu (README, API Docs, Code Comments) rõ ràng, dễ hiểu cho con người.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Context Extraction):**
   - Read the target source code to understand its Inputs, Outputs, and side effects.
2. **Implement (Drafting):**
   - Write Markdown or JSDoc comments.
   - Structure: Description -> Parameters -> Returns -> Warnings/Notes.
3. **Validate (Review Examples):**
   - ALWAYS provide 1-2 real-world code examples demonstrating how to use the function/API.
4. **Complete (Format):**
   - Ensure proper Markdown syntax (bolding, code blocks with languages).

## 🛡️ 2. Constraints & Rules

- **Human Friendly:** Avoid overly academic language. Explain it as if explaining to a junior developer.
- **Language Hybrid:** If writing Vietnamese documentation, keep technical keywords (props, state, endpoint, fetch) in English.

## 🌳 3. Decision Tree

```text
Is this an API Documentation?
  ├── YES → Use standard REST/GraphQL documentation layout (Endpoint, Method, Body, Response).
  └── NO → Is it a Component Documentation?
             ├── YES → Document the Props interface and usage examples.
             └── NO → Write standard JSDoc.
```

## 🤝 4. Handoff Pipeline

1. `complete`: Generate the Docs and save them to the project files.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Tài liệu nào đã được tạo/cập nhật.
- **Chi tiết (Changes):** Cấu trúc tài liệu.
- **Xác thực (Verification):** Yêu cầu User đọc lướt qua tài liệu.
