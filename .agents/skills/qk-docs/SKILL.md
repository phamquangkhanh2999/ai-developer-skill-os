---
# ── Identity ───────────────────────────────────────────────
name: qk-docs
version: 9.2.0
status: stable
description: "Khởi tạo và duy trì tài liệu kỹ thuật chuẩn xác — README, API docs, architecture guides, JSDoc/Docstrings — cam kết đồng bộ 100% với code thực tế, không bịa đặt. Dùng skill này khi user nhắc đến: viết docs, tài liệu, readme, document, jsdoc, swagger, viết hướng dẫn, tài liệu api — kể cả khi chỉ nói 'viết hướng dẫn cài đặt và chạy project này'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - documentation
  - technical-writing

complexity:
  level: low
  criteria:
    files_affected: "1-3"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "viết docs"
  - "tài liệu"
  - "readme"
  - "document"
  - "jsdoc"
  - "swagger"
  - "viết hướng dẫn"
  - "tài liệu api"


# ── V8: References ─────────────────────────────────────────
workflow: documentation

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-project-memory
  - qk-api-lifecycle

knowledge_scope:
  owns:
    - code-documentation
    - architecture-docs
    - api-documentation
  references:
    - source-code

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: documentation

selection:
  priority: medium
  confidence_threshold: 0.75

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [docs, report]
consumes: [source-code]

token_budget:
  max_files_read: 6
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-docs — Technical Writer & Documentation Guardian

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm khởi tạo, nâng cấp và đồng bộ tài liệu kỹ thuật trong dự án. **Nguyên tắc cốt lõi: Tài liệu PHẢI phản ánh chính xác 100% code thực tế — cấm bịa đặt, cấm suy đoán tham số hay lệnh chạy.**

---

## Preconditions

Trước khi viết hoặc sửa tài liệu, AI BẮT BUỘC:

- [ ] Xác định rõ đối tượng độc giả và mục đích tài liệu:
  - Developer Onboarding → `README.md`
  - Client / Frontend Consumer → `API docs` / OpenAPI / Swagger
  - Kỹ sư nội bộ → Architecture Decision Records (ADR) hoặc Code Docstrings
- [ ] Đọc trực tiếp file mã nguồn liên quan (đọc `package.json` để lấy scripts thật, đọc `.env.example` để lấy biến môi trường thật, đọc interface/DTO để lấy payload thật).
- [ ] Nếu mã nguồn chưa được triển khai hoặc thông tin nghiệp vụ chưa rõ:
  → **EXIT: BLOCKED**
  → Yêu cầu: "Vui lòng implement code hoặc cung cấp đặc tả trước khi lập tài liệu."

---

## Scope

✅ Skill này làm:
- Viết/cập nhật `README.md` chuẩn công nghiệp: Giới thiệu ngắn gọn, Architecture overview, Yêu cầu môi trường (Node, Go, Python, Docker), Hướng dẫn cài đặt, Cấu hình biến môi trường, Các lệnh chạy thường dùng (dev, test, build, lint).
- Viết tài liệu API: Bảng endpoints, Headers, Request Body, Response Shapes (200, 400, 401, 403, 500) và Curl examples có thể copy-paste chạy thật.
- Bổ sung JSDoc / TSDoc / Docstrings cho các hàm xử lý nghiệp vụ phức tạp, public SDK methods hoặc utility functions.
- Soạn thảo Architecture Decision Records (ADR) khi có quyết định kỹ thuật lớn.

❌ Skill này KHÔNG làm:
- Thay đổi logic thực thi của mã nguồn (`side_effects: edit_files` chỉ áp dụng cho files `.md` hoặc docstrings comments).
- Viết tài liệu dài dòng dạng lý thuyết suông không áp dụng được.
- Bịa đặt các endpoints, env vars hoặc test credentials không tồn tại.

---

## Execution Steps

### Step 1 — Khảo sát Mã nguồn Thật (Source of Truth Audit)
```
Inputs:  Source files, manifest, config files
Actions:
  - Nếu viết README: Đọc `package.json` (dependencies, scripts), đọc `.env.example`, đọc Dockerfile.
  - Nếu viết API docs: Đọc route handlers, schema validators (Zod/Joi/Pydantic/DTOs).
  - Trích xuất: Port mặc định, Auth headers, format ngày tháng, error responses.
Outputs: Bảng thông số kỹ thuật đã kiểm chứng
```

### Step 2 — Lập cấu trúc tài liệu theo tiêu chuẩn
```
Tiêu chuẩn trình bày:
  - Heading phân cấp rõ ràng (`#`, `##`, `###`).
  - Dùng bảng (Markdown tables) cho env vars, API params, status codes.
  - Code block luôn có tag ngôn ngữ (`bash`, `ts`, `json`, `yaml`).
  - Cung cấp lệnh CLI cụ thể và kết quả mong đợi.
```

### Step 3 — Soạn thảo nội dung (Drafting)
```
Quy tắc hành văn:
  - Ngắn gọn, trực diện, hướng hành động (action-oriented).
  - Định dạng cảnh báo theo GitHub Alerts (`> [!IMPORTANT]`, `> [!WARNING]`).
  - Hướng dẫn troubleshooting cho các lỗi cài đặt thường gặp.
```

### Step 4 — Verification & Fact-check
```
Actions:
  - Đối chiếu từng biến môi trường trong tài liệu với code thực tế.
  - Chạy thử lệnh build/test (dry-run) nếu cần xác nhận.
  - Kiểm tra các link nội bộ trong repo (không để link chết).
```

---

## Prompt Template

```
Loại tài liệu:  [README / API Reference / Architecture Doc / JSDoc]
Scope:          [Toàn bộ repo / Module payments / Component Button]
Độc giả:        [New developer / Frontend dev / External partner]
Yêu cầu đặc biệt:[Kèm curl mẫu / giải thích env vars / sơ đồ luồng]
```

### Ví dụ theo nhu cầu:

**Viết README cho Fullstack Web App**
```
Loại tài liệu:  README.md
Scope:          Toàn bộ repo (Next.js + Prisma + PostgreSQL)
Độc giả:        Developer mới vào dự án
```
→ AI đọc `package.json`, `.env.example`, `schema.prisma`.
→ AI tạo `README.md` gồm: Quickstart 3 bước (install, migrate, dev), bảng biến môi trường bắt buộc, tài liệu các lệnh test/lint, kiến trúc thư mục.

**Viết API Docs cho Endpoint Đặt hàng**
```
Loại tài liệu:  API Reference
Scope:          POST /api/v1/orders
Độc giả:        Mobile App Developer
```
→ AI đọc controller + validation schema.
→ AI tạo Markdown: Headers (`Authorization: Bearer <token>`), Request JSON schema kèm chú thích kiểu dữ liệu, Bảng response codes (201 Created, 400 Bad Request kèm chi tiết lỗi validation, 401 Unauthorized), Curl command mẫu hoàn chỉnh.

