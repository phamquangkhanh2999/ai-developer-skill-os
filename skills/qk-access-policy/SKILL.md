---
name: qk-access-policy
version: 3.1.0
updated: 2026-07-02
description: Manage RBAC, ABAC, and security boundaries.
category: security
behavior: static-analysis
intent: review-code
priority: high
tags: [security, rbac, auth, permissions]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to add roles, restrict access, or implement authentication logic.
inputs: [Auth requirements, RBAC Matrix]
outputs: [Access control logic, Middleware]
allowed_tools: [grep_search, run_command, write_to_file]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-access-policy - Standard Operating Procedure

> **Goal:** "Bảo vệ cổng" (Security Guard). Xác định xem người dùng có đủ thẩm quyền để truy cập vào một Component UI hoặc một Endpoint API hay không.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Role Assessment):**
   - Identify the user roles (Guest, User, Admin, SuperAdmin).
2. **Implement (Boundary Definition):**
   - Implement UI Guards (e.g., hiding a Delete button).
   - Implement API Middleware (e.g., blocking the `/api/delete` endpoint).
3. **Validate (Least Privilege Check):**
   - Ensure you didn't grant broad access by default.

## 🛡️ 2. Constraints & Rules

- **Full Stack Protection:** Never hide UI elements without also securing the corresponding backend API.

## 🤝 3. Handoff Pipeline

1. `validate`: Trigger `qk-validation-gate` to check for security flaws.
2. `complete`: Generate the Access Control Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Các role vừa được setup.
- **Chi tiết (Changes):** UI và API nào đã được bảo vệ.
