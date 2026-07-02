---
name: qk-api-lifecycle
version: 3.1.0
updated: 2026-07-02
description: Design, implement, and integrate API endpoints.
category: engineering
behavior: development
intent: implement-feature
priority: high
tags: [api, backend, frontend-integration, endpoints]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User wants to create a new API, fix an API, or integrate frontend with backend API.
inputs: [API requirements, JSON schema, or Backend URL]
outputs: [API routes, Service classes, API Hooks]
allowed_tools: [run_command, read_file, write_to_file, grep_search]
pipeline: [analyze, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-api-lifecycle - Standard Operating Procedure

> **Goal:** Quản lý toàn bộ vòng đời của một API, từ việc thiết kế Spec (Swagger/Types) cho đến khi Backend code xong và Frontend gọi thành công.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Contract Definition):**
   - Read the user requirements.
   - Define the exact API contract (Request Body, Query Params, Response DTO) in TypeScript interfaces or OpenAPI spec.
2. **Plan (Architecture Selection):**
   - Determine if the task is Backend (creating the endpoint) or Frontend (consuming the endpoint).
   - If Frontend: Load `knowledge/frontend/react.md` to decide between React Query vs raw fetch.
   - If Backend: Choose the appropriate layer (Controller -> Service -> Repository).
3. **Execute (Implementation):**
   - Write the backend handler/controller with strict validation (e.g., Zod, Class Validator).
   - Write the frontend API client (e.g., Axios instance wrapper).
4. **Verify (Validation):**
   - Handle Error Status Codes (400, 401, 403, 404, 500) gracefully.
   - Ensure loading states are managed on the frontend.

## 🛡️ 2. Constraints & Rules

- **No Hardcoded URLs:** Never hardcode `http://localhost:3000` inside frontend components. Always use environment variables (`process.env.API_URL`).
- **Separation of Concerns:** Do NOT write `fetch` or `axios.get` directly inside a React UI component. Extract it to a custom hook or an API service file.

## 🌳 3. Decision Tree

```text
Is this a Backend or Frontend task?
  ├── BACKEND → Does the API need Database access?
  │       ├── YES → Handoff to `qk-data-lifecycle` to create models first.
  │       └── NO → Write Controller and Service.
  └── FRONTEND → Are we fetching data to display or mutating data?
          ├── FETCH → Use React Query `useQuery` or equivalent.
          └── MUTATE → Use React Query `useMutation` or equivalent.
```

## 🤝 4. Handoff Pipeline

1. `engineering-standard`: Verify API naming conventions (e.g., `GET /users` instead of `POST /getUsers`).
2. `validate`: Run API tests and Type-checks.
3. `complete`: Generate the final report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt. Sử dụng template chuẩn của hệ thống:

- **Tóm tắt (Summary):** Các endpoint đã tạo hoặc tích hợp.
- **Chi tiết (Changes):** File nào chứa logic API.
- **Kiến trúc (Reasoning):** Lý do chọn thư viện hoặc cách bắt lỗi (Error handling).
- **Xác thực (Verification):** Cách gọi thử API.
- **Rủi ro (Risks):** Vấn đề bảo mật CORS hoặc Rate Limit (nếu có).
