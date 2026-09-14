---
# ── Identity ───────────────────────────────────────────────
name: qk-api-lifecycle
version: 9.2.0
status: stable
description: "Thiết kế và implement API endpoint mới với Zero-Trust — contract trước, code sau. Dùng skill này khi user nhắc đến: viết api, tạo endpoint, thiết kế api, build api, rest, graphql, trpc, route handler, controller, request/response schema — kể cả khi chỉ hỏi \"API này nên nhận input gì, trả output gì\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - api-design
  - backend-development

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "viết api"
  - "tạo endpoint"
  - "thiết kế api"
  - "build api"
  - "rest"
  - "graphql"
  - "trpc"
  - "route handler"
  - "controller"
  - "request/response schema"


# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-data-lifecycle

knowledge_scope:
  owns:
    - api-contracts
    - endpoints
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: api-change

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [context-graph, user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-api-lifecycle — API Design & Implementation

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế và triển khai API endpoints mới hoặc nâng cấp endpoint hiện hữu theo triết lý **Zero-Trust: Contract First (Schema & Validation) → Route/Controller → Service/Business Logic → Error Handling & Documentation**.

---

## Preconditions

Trước khi viết code API mới, AI BẮT BUỘC kiểm tra:

- [ ] Xác định backend framework và routing pattern từ `.agents/DEV_PROFILE.md` (Express, Next.js API Routes, FastAPI, NestJS, Go Fiber, v.v.).
- [ ] Xác định cơ chế Authentication & Authorization cần thiết (Public, JWT, Session, API Key, RBAC).
- [ ] Định nghĩa rõ ràng Request schema (headers, params, body) và Response schema (success + error cases).
- [ ] Nếu vi phạm quy ước REST/HTTP status codes hoặc thiếu validation schema:
  → **EXIT: BLOCKED**
  → Báo cáo user đề xuất chuẩn hóa contract trước khi implement.

---

## Scope

✅ Skill này làm:
- Thiết kế Request/Response DTO và validation schema (Zod, Joi, Pydantic, Class-validator).
- Cài đặt Route handlers, Controllers, Middlewares xử lý request.
- Tích hợp Service layer và xử lý logic nghiệp vụ an toàn.
- Chuẩn hóa HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500) và error response envelope.
- Đảm bảo sanitized inputs chống SQL Injection, XSS, mass assignment.

❌ Skill này KHÔNG làm:
- Thay đổi cấu trúc bảng database hoặc migration (→ `qk-data-lifecycle`).
- Viết giao diện Frontend để gọi API này (→ `qk-api-consumer`).
- Tối ưu câu query SQL bên dưới (→ `qk-db-optimizer`).

---

## Execution Steps

### Step 1 — Contract & Schema Definition
```
Inputs:  Yêu cầu endpoint từ user, DEV_PROFILE.md
Actions:
  - Khai báo Schema cho Request (Path params, Query params, Request body).
  - Khai báo Schema cho Response (Success payload, Error payload).
  - Áp dụng các rules kiểm tra tính hợp lệ dữ liệu đầu vào.
Output: Type-safe Schema definitions
```

### Step 2 — Route & Middleware Setup
```
Inputs:  Schema definitions
Actions:
  - Khai báo route path và HTTP method tương ứng.
  - Gắn các middlewares bảo vệ: Auth, Rate-limiting, Input validation.
Output: Secure Route registration
```

### Step 3 — Controller & Service Implementation
```
Inputs:  Validated input data
Actions:
  - Gọi Service/Repository để xử lý nghiệp vụ.
  - Bọc trong khối try/catch hoặc error boundary trung tâm của framework.
  - Tuyệt đối không để lộ sensitive data (passwords, tokens, internal stack traces) ra client.
Output: Completed API endpoint
```

### Step 4 — Verification & Contract Testing
```
Inputs:  Endpoint implementation
Actions:
  - Kiểm tra status codes trả về ứng với từng kịch bản (success, missing field, unauthorized).
  - Chạy linter và typecheck.
Exit: SUCCESS nếu endpoint tuân thủ 100% schema contract và coding standards.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để biết backend stack + auth pattern. Mô tả API contract — AI lo phần còn lại.

```
Endpoint:    [Method + Path — vd: POST /api/orders]
Mục đích:    [API này làm gì trong business context]
Auth:        [Public / user JWT / admin only / service-to-service]
Input:       [Request body / query params / path params]
Output:      [Response shape khi success + khi lỗi]
Rules:       [Business rules, validation, side effects quan trọng]
```

---

### Theo Role — AI thiết kế theo chiều sâu khác nhau:

**role: be**
```
Endpoint:    POST /api/orders
Mục đích:    Tạo đơn hàng mới, trừ stock, gửi email xác nhận
Auth:        User JWT (phải login)
Input:       { items: [{ productId, quantity }], shippingAddressId, paymentMethod }
Output:      201 { orderId, totalAmount, estimatedDelivery }
             400 nếu product hết hàng, 404 nếu product không tồn tại
Rules:       Transaction: trừ stock + tạo order phải atomic. Stock < 0 thì rollback.
             Email gửi async (không block response). Idempotency key từ client.
```
→ AI thiết kế: DB transaction scope, optimistic vs pessimistic locking cho stock,
  idempotency key pattern, async job queue cho email, error taxonomy (4xx vs 5xx),
  OpenAPI spec trước khi code.

**role: fullstack**
```
Endpoint:    GET /api/dashboard/stats
Mục đích:    Trả thống kê cho dashboard — revenue, orders, users hôm nay
Auth:        Admin JWT
Input:       ?from=2024-01-01&to=2024-01-31&timezone=Asia/Ho_Chi_Minh
Output:      { revenue: number, orders: number, newUsers: number, topProducts: [] }
Rules:       Cache 5 phút. Timezone-aware aggregation. Chỉ admin mới gọi được.
```
→ AI thiết kế: query aggregation strategy, DB index cho date range,
  timezone handling (store UTC, convert at query time), cache layer (Redis vs in-memory),
  type-safe response contract cho FE (zod schema hoặc OpenAPI codegen).

**role: fe** *(khi FE cần hiểu API để tích hợp đúng)*
```
Endpoint:    GET /api/products (đã có — cần hiểu contract để tích hợp)
Mục đích:    Lấy danh sách sản phẩm với filter + pagination
Input:       ?page=1&limit=20&category=shoes&minPrice=100&sort=price_asc
Output:      { data: Product[], total: number, page: number, hasNextPage: boolean }
Rules:       Cần biết: khi nào trả 404 vs data rỗng? Error shape là gì?
```
→ AI phân tích: type generation từ API response, error boundary design,
  loading state granularity, stale-while-revalidate strategy, mock data cho dev.

**role: data** *(API nhận dữ liệu từ pipeline)*
```
Endpoint:    POST /api/ingest/events (webhook từ data pipeline)
Mục đích:    Nhận batch events từ Kafka consumer, validate và lưu vào DB
Auth:        Service-to-service API key
Input:       { events: [{ type, payload, timestamp, source }], batchId }
Output:      202 { accepted: N, rejected: M, errors: [] }
Rules:       Idempotent theo batchId. Reject invalid schema nhưng không fail toàn batch.
             Rate limit: 1000 events/request, 100 req/min.
```
→ AI thiết kế: bulk insert strategy, partial failure handling,
  schema validation per-row vs batch-level, idempotency key indexing,
  backpressure mechanism khi DB chậm.

**role: devops** *(API health + observability endpoints)*
```
Endpoint:    GET /health, GET /metrics, GET /ready
Mục đích:    Kubernetes liveness/readiness probe + Prometheus scraping
Auth:        Internal only (không expose ra public)
Output:      /health: { status: "ok", uptime, version }
             /metrics: Prometheus format
             /ready: 200 nếu DB connected, 503 nếu không
Rules:       /health không check DB (liveness). /ready check DB (readiness).
             /metrics không cần auth nhưng chỉ bind localhost.
```
→ AI thiết kế: liveness vs readiness semantics, graceful shutdown handling,
  metric naming convention (RED method), scrape security, k8s probe config.
