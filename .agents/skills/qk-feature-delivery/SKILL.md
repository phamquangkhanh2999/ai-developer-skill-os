---
# ── Identity ───────────────────────────────────────────────
name: qk-feature-delivery
version: 9.2.0
status: stable
description: "Phát triển tính năng mới end-to-end: Requirements → Context → Design → Implement → Self-audit. Dùng skill này khi user nhắc đến: add feature, build new, implement, phát triển tính năng, tạo mới, thêm chức năng — kể cả khi mô tả bằng ngôn ngữ tự nhiên như \"tôi muốn có tính năng X\" hoặc \"làm cho app có thể Y\"."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - feature-building
  - end-to-end-development
  - implementation

complexity:
  level: high
  criteria:
    files_affected: "5+"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "add feature"
  - "build new"
  - "implement"
  - "phát triển tính năng"
  - "tạo mới"
  - "thêm chức năng"


selection:
  priority: medium
  confidence_threshold: 0.85

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader
  - qk-test-engineering

knowledge_scope:
  owns:
    - feature-implementation
    - requirement-analysis
  references:
    - testing
    - security
    - anti-patterns
    - design-system

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [context-graph, design-md, user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-feature-delivery — End-to-End Feature Builder

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm triển khai tính năng mới end-to-end theo luồng tiêu chuẩn: **Requirements → Context → Design → Implement → Self-audit**. Bảo đảm code viết ra tích hợp mượt mà vào hệ thống hiện hữu, chuẩn theo role và conventions từ `DEV_PROFILE.md`.

---

## Preconditions

Trước khi bắt đầu implement bất kỳ tính năng nào, AI BẮT BUỘC kiểm tra:

- [ ] Đọc `.agents/DEV_PROFILE.md` để lấy role, primary stack, coding conventions và constraints.
- [ ] Xác định scope thay đổi (màn hình, module, schema, API liên quan).
- [ ] Kiểm tra tính rõ ràng của yêu cầu: Có acceptance criteria rõ ràng chưa? Đã rõ input/output chưa?
- [ ] Nếu yêu cầu mơ hồ hoặc có quyết định kiến trúc lớn chưa thống nhất:
  → **EXIT: BLOCKED**
  → Báo cáo user câu hỏi làm rõ trước khi can thiệp vào mã nguồn.

---

## Scope

✅ Skill này làm:
- Phân tích yêu cầu và định hình kiến trúc tính năng tương thích với codebase.
- Định nghĩa type-safe contracts, schemas và dữ liệu liên quan.
- Triển khai code tính năng hoàn chỉnh qua các tầng (FE UI, BE controller/service, routing).
- Xử lý đầy đủ các trạng thái biên: loading, error, empty data, pagination, boundary conditions.
- Tự kiểm toán (Self-audit) sau khi implement: linting, typecheck, và format code.

❌ Skill này KHÔNG làm:
- Sửa lỗi crash phát sinh đột xuất không nằm trong phạm vi feature mới (→ `qk-bug-resolution`).
- Tái cấu trúc quy mô lớn codebase không phục vụ feature (→ `qk-refactor`).
- Chạy đợt audit bảo mật tổng thể toàn dự án (→ `qk-security-audit`).

---

## Execution Steps

### Step 1 — Context Loading & Gap Analysis
```
Inputs:  Yêu cầu tính năng từ user, DEV_PROFILE.md, mã nguồn hiện tại
Actions:
  - Khảo sát các modules, components, services hiện có liên quan đến tính năng.
  - Lập danh sách các files cần tạo mới và files cần chỉnh sửa.
  - Xác định dependency mới (nếu có) và đối chiếu với constraints trong DEV_PROFILE.md.
Output: Feature Implementation Plan
```

### Step 2 — Contract & Architecture Design
```
Inputs:  Feature Implementation Plan
Actions:
  - Thiết kế interface/types, DTO, data contracts giữa các tầng.
  - Xác định state management và data flow (Client state, Server cache, DB model).
  - Dự phòng các kịch bản ngoại lệ (empty data, network failure, unauthorized).
Output: Type definitions & Contract drafts
```

### Step 3 — Incremental Implementation
```
Inputs:  Type definitions, Contract drafts
Actions:
  - Viết code theo thứ tự từ lõi (Core/Domain/Model) → Service/Logic → Presentation/UI.
  - Tuân thủ quy ước đặt tên (naming conventions) và design system tokens của dự án.
  - Không hardcode các giá trị cấu hình, URL hay magic numbers.
Output: Functional implementation
```

### Step 4 — Self-Audit & Quality Gate
```
Inputs:  Modified & Created files
Actions:
  - Kiểm tra lint và type checking.
  - Rà soát edge cases: null/undefined checks, error boundary handling.
  - Đảm bảo không làm hỏng các tính năng cũ lân cận (regressions).
Exit: SUCCESS nếu code pass types/lint và đạt mọi acceptance criteria.
```

---

## Prompt Template

AI đọc `DEV_PROFILE.md` để lấy role + stack. Bạn chỉ cần mô tả **WHAT**, không cần nhắc lại stack.

```
Tính năng:   [Tên / mục đích tính năng]
Màn hình:    [Trang / route / component liên quan — hoặc "mới hoàn toàn"]
Done khi:    [User thấy gì / hệ thống làm gì — tiêu chí cụ thể]
Edge cases:  [Điều kiện đặc biệt, dữ liệu rỗng, lỗi cần xử lý]
Không được:  [Ràng buộc — không đổi API này, không xóa field kia]
```

---

### Theo Role — AI sẽ phân tích kỹ thuật như sau:

**role: fe**
```
Tính năng:   Infinite scroll cho danh sách sản phẩm
Màn hình:    /products — ProductList.tsx đã có
Done khi:    Scroll đến cuối → tự load thêm 20 sản phẩm, có loading indicator
Edge cases:  Hết data → hiện "Đã xem tất cả", lỗi API → hiện retry button
Không được:  Không đổi ProductCard component
```
→ AI phân tích: intersection observer vs scroll event, React Query `useInfiniteQuery`,
  cache invalidation, skeleton vs spinner, bundle impact của thư viện.

**role: be**
```
Tính năng:   API pagination cho /products với cursor-based paging
Màn hình:    GET /api/products — route đã có nhưng chỉ trả toàn bộ
Done khi:    Trả { data, nextCursor, hasMore }, tối đa 20 items/page
Edge cases:  cursor không hợp lệ → 400, không có data → { data: [], hasMore: false }
Không được:  Không đổi response shape của existing fields
```
→ AI phân tích: cursor vs offset trade-off, index strategy trên DB,
  validation middleware, backward compatibility của response schema.

**role: fullstack**
```
Tính năng:   Thêm chức năng export danh sách đơn hàng ra CSV
Màn hình:    /orders — có table hiện tại, cần thêm nút Export
Done khi:    Click Export → tải file CSV với đúng cột, chỉ export filtered data
Edge cases:  > 10k rows → stream response, không có data → disable button
Không được:  Không thêm dependency mới nếu native API đủ dùng
```
→ AI phân tích: FE trigger + progress UX, BE streaming response vs buffer,
  type-safe contract giữa FE-BE, memory safety khi dataset lớn.

**role: data**
```
Tính năng:   Pipeline load daily sales data từ PostgreSQL → BigQuery
Màn hình:    DAG mới trong Airflow — incremental load
Done khi:    Chạy hàng ngày 2AM, chỉ load data của ngày hôm trước, idempotent
Edge cases:  Re-run phải cho kết quả giống nhau, source schema thay đổi → alert
Không được:  Không truncate table, chỉ upsert
```
→ AI phân tích: watermark strategy, partition pruning, schema evolution handling,
  idempotency key design, data quality assertion trước khi load.

**role: ai-engineer**
```
Tính năng:   RAG pipeline trả lời câu hỏi từ tài liệu nội bộ
Màn hình:    Chat UI mới — /chat route
Done khi:    User hỏi → AI trả lời có citation từ đúng document
Edge cases:  Câu hỏi ngoài scope → "Tôi không tìm thấy thông tin liên quan"
Không được:  Không hallucinate khi không có context
```
→ AI phân tích: chunking strategy, embedding model choice, retrieval (BM25 vs dense),
  reranking, context stuffing vs summarization, eval metrics (faithfulness, relevance).

**role: devops**
```
Tính năng:   CI pipeline tự động chạy test + deploy lên staging khi merge PR
Màn hình:    .github/workflows/ — chưa có file nào
Done khi:    PR merge → test pass → deploy staging → notify Slack
Edge cases:  Test fail → stop pipeline, notify người tạo PR
Không được:  Không auto-deploy production
```
→ AI phân tích: workflow triggers, secrets management, caching strategy,
  environment isolation, rollback mechanism, notification integration.
