---
# ── Identity ───────────────────────────────────────────────
name: qk-context-loader
version: 9.2.0
status: stable
description: "Khảo sát kiến trúc codebase, phân tích import graph, lập bản đồ phụ thuộc và tải context chính xác trước khi code — ngăn hallucination kiến trúc. Dùng skill này khi user nhắc đến: load context, understand project, vẽ dependency graph, analyze architecture, giải thích kiến trúc dự án, tìm hiểu codebase — kể cả khi chỉ hỏi 'dự án này tổ chức thế nào'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - context-loading
  - project-understanding
  - repository-analysis

complexity:
  level: low
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "load context"
  - "understand project"
  - "vẽ dependency graph"
  - "analyze architecture"
  - "giải thích kiến trúc dự án"
  - "tìm hiểu codebase"


selection:
  priority: high
  confidence_threshold: 0.75

# ── V8: References ─────────────────────────────────────────
workflow: context-discovery

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-feature-delivery
  - qk-orchestrator
  - qk-project-memory

knowledge_scope:
  owns:
    - project-context
    - architecture-discovery
    - dependency-mapping
  references:
    - coding
    - repository-structure

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: read_only
produces: [context-graph]
consumes: [source-code]

token_budget:
  max_files_read: 10
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-context-loader — Dependency Graph & Architecture Discovery

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thấu hiểu cấu trúc dự án và thiết lập bản đồ phụ thuộc (Dependency Graph) chuẩn xác trước khi viết bất kỳ dòng code nào. **Mục tiêu tối thượng: Ngăn chặn triệt để AI hallucination về kiến trúc, conventions và vị trí đặt file**.

---

## Preconditions

Trước khi chạy khảo sát, AI BẮT BUỘC kiểm tra:

- [ ] Workspace chứa mã nguồn thực tế (tồn tại ít nhất 1 file manifest: `package.json`, `go.mod`, `pyproject.toml`, `Cargo.toml`, `pom.xml`, v.v.).
- [ ] Xác định rõ phạm vi cần load: Toàn bộ repo (Full system) hay Module / Feature cụ thể.
- [ ] Đọc `.ai-local/knowledge/index.yaml` (nếu có) để tái sử dụng kiến thức đã lưu thay vì quét lại từ đầu.

*Nếu thư mục dự án hoàn toàn trống:*
→ **EXIT: BLOCKED**
→ Gợi ý: "Dự án chưa có mã nguồn. Vui lòng chạy `./qk-project-bootstrap` để khởi tạo framework và scaffolding ban đầu."

---

## Scope

✅ Skill này làm:
- Đọc các tệp manifest và xác định chính xác Tech Stack, Runtime, State library, CSS framework, ORM.
- Khảo sát cây thư mục theo độ sâu hợp lý (Max depth = 3) để nhận diện mô hình tổ chức (Modular, Layered, Feature-sliced, Domain-driven, Monorepo).
- Phân tích Entry Point (`main`, `index`, `server`, `App`, router configuration).
- Lập sơ đồ phụ thuộc (Dependency Flow / Architecture Diagram bằng Mermaid) từ Controller/Route → Service/UseCase → Repository/Model.
- Trích xuất Conventions: đặt tên file, patterns xử lý lỗi, cơ chế Dependency Injection.
- Cập nhật thông tin vào bộ nhớ phiên làm việc của AI.

❌ Skill này KHÔNG làm:
- Sửa đổi bất kỳ file nào trong dự án (`side_effects: read_only`).
- Dump toàn bộ code files vào context làm cạn kiệt token budget.
- Đánh giá chất lượng chi tiết code smells (thuộc `qk-project-health`).

---

## Execution Steps

### Step 1 — Nhận diện Tech Stack & Manifest
```
Inputs:  Thư mục gốc của project
Actions:
  - Đọc file manifest chính (package.json, pyproject.toml, go.mod...).
  - Trích xuất: ngôn ngữ chính, runtime version, framework, ORM, state library, test runner.
  - Đối chiếu với DEV_PROFILE.md nếu có.
Outputs: Stack Profile tóm tắt
```

### Step 2 — Khảo sát Cấu trúc Thư mục & Entry Points
```
Actions:
  - Chạy `list_dir` hoặc `find_by_name` với MaxDepth=2 trên src/ hoặc app/.
  - Xác định vị trí các tầng:
    - Routes / Controllers / API Handlers
    - Business Logic / Services / Use Cases
    - Data Access / Repositories / Entities / Models
    - Shared / Utils / Components / Middleware
  - Đọc entry point file chính (max 80 dòng đầu).
Outputs: Sơ đồ phân tầng kiến trúc (Architectural Layers)
```

### Step 3 — Phân tích Luồng phụ thuộc (Dependency Tracing)
```
Actions:
  - Chọn 1 feature tiêu biểu, trace import statements từ UI/Controller xuống DB.
  - Xác định:
    - Có dùng Dependency Injection không?
    - Shared types/DTOs nằm ở đâu?
    - Data fetching pattern: Client-side hook, Server Component, hay REST client?
Outputs: Dependency Graph (Mermaid flowchart)
```

### Step 4 — Tổng hợp Context Report
```
Actions:
  - Xuất báo cáo ngắn gọn, súc tích (dưới 40 dòng) gồm:
    1. Kiến trúc tổng quan (Pattern & Style).
    2. Quy ước đặt file & Naming conventions.
    3. Đường đi của luồng dữ liệu (Data Flow).
    4. Sơ đồ Mermaid trực quan.
```

---

## Prompt Template

```
Phạm vi:      [Toàn bộ dự án / Module X / Tính năng Y]
Mục tiêu:     [Tìm hiểu kiến trúc trước khi thêm feature / refactor / debug]
Câu hỏi cần:  [Data flow đi như thế nào? / Types đặt ở đâu? / Service kết nối DB ra sao?]
```

### Ví dụ theo Role:

**role: fullstack (Khảo sát Next.js 14 Monorepo)**
```
Phạm vi:      apps/web và packages/api
Mục tiêu:     Nắm rõ cách web gọi API và chia sẻ types giữa FE và BE.
```
→ AI trace: `packages/api/src/routers` → xuất `tRPC router` → `apps/web/src/utils/trpc.ts` → import types trong `apps/web/src/app/page.tsx`.
→ AI vẽ sơ đồ Mermaid luồng type-safe RPC từ client tới DB query.

**role: be (Khảo sát Clean Architecture NestJS)**
```
Phạm vi:      src/modules/orders
Mục tiêu:     Hiểu luồng xử lý Order: DTO -> Controller -> UseCase -> Prisma Repository.
```
→ AI liệt kê cấu trúc layers, quy ước DTO validation, và cách inject repository vào service.