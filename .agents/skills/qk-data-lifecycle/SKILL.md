---
# ── Identity ───────────────────────────────────────────────
name: qk-data-lifecycle
version: 9.2.0
status: stable
description: "Quản lý Schema và Migration cơ sở dữ liệu an toàn — schema freeze, backward-compatible migrations, data transformation, zero-downtime deployment. Dùng skill này khi user nhắc đến: sửa schema, migration, database model, db schema, cập nhật database, đổi model, thêm cột, alter table — kể cả khi chỉ nói 'thêm trường phone vào bảng users'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - schema-management
  - database-migration

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "sửa schema"
  - "migration"
  - "database model"
  - "db schema"
  - "cập nhật database"
  - "đổi model"
  - "thêm cột"
  - "alter table"


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
  - qk-db-optimizer
  - qk-api-lifecycle

knowledge_scope:
  owns:
    - schema
    - migrations
    - data-contracts
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: migration-safety

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, schema]
consumes: [context-graph, user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-data-lifecycle — Database Schema & Migration Guardian

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm quản lý vòng đời Schema DB và Migration an toàn theo nguyên tắc: **Freeze schema → Backward-compatible migration (Expand & Contract) → Cleanup**. Tuyệt đối không làm đứt gãy runtime hoặc gây mất mát dữ liệu live.

---

## Preconditions

Trước khi thay đổi bất kỳ file schema hay migration nào, AI BẮT BUỘC kiểm tra:

- [ ] Xác định ORM/Tool đang dùng từ `DEV_PROFILE.md` (Prisma, Drizzle, TypeORM, Alembic, Knex, v.v.).
- [ ] Xác định Database engine (PostgreSQL, MySQL, SQLite, MongoDB).
- [ ] **Destructive check**: Thay đổi có chứa thao tác xóa/đổi tên cột (`DROP COLUMN`, `RENAME COLUMN`, thay đổi type thu hẹp dữ liệu) không?
- [ ] Nếu là thay đổi Destructive:
  → **EXIT: BLOCKED**
  → Báo cáo user: Cảnh báo rủi ro downtime và đề xuất áp dụng **Expand & Contract Pattern** thay vì drop/rename trực tiếp.

---

## Scope

✅ Skill này làm:
- Cập nhật file định nghĩa Schema (ví dụ `schema.prisma`, `schema.ts`, model files).
- Tạo migration scripts (SQL hoặc ORM-generated) có tính lũy tiến, an toàn.
- Thiết kế chiến lược **Expand & Contract** khi đổi tên cột hoặc tách bảng (Giai đoạn 1: Thêm cột mới + dual write; Giai đoạn 2: Backfill data; Giai đoạn 3: Deprecate & remove cột cũ).
- Đảm bảo các cột mới có `DEFAULT` value hoặc `NULLABLE` để tránh khóa bảng (table lock) hoặc lỗi insert từ code cũ đang chạy.
- Cập nhật types/interfaces tương ứng trong ứng dụng.

❌ Skill này KHÔNG làm:
- Chạy lệnh phá hủy tự động (`prisma migrate reset`, `drop database`, `truncate table`).
- Viết câu query phân tích hiệu năng/EXPLAIN (→ `qk-db-optimizer`).
- Viết API endpoint xử lý request/response (→ `qk-api-lifecycle`).

---

## Execution Steps

### Step 1 — Phân tích Schema Diff & Đánh giá rủi ro
```
Inputs:  Schema hiện tại, Yêu cầu thay đổi từ user
Actions:
  - So sánh schema cũ và mới.
  - Phân loại:
    - Safe: Thêm bảng mới, thêm nullable column, thêm column có default an toàn.
    - Caution: Thêm index trên bảng lớn (cần CONCURRENTLY nếu Postgres).
    - Dangerous: Xóa cột, đổi tên cột, đổi kiểu dữ liệu (Int -> String hoặc ngược lại).
Exit: BLOCKED nếu gặp Dangerous change mà chưa có kế hoạch Expand & Contract
```

### Step 2 — Áp dụng Expand & Contract (nếu có Breaking Change)
```
Quy trình chuẩn:
  1. Expand: Thêm cột mới song song (nullable). Code ứng dụng ghi đồng thời cả 2 cột.
  2. Migrate Data: Chạy batch script chuyển dữ liệu từ cột cũ sang cột mới.
  3. Contract: Chuyển code đọc từ cột mới. Sau 1 release ổn định mới xóa cột cũ.
```

### Step 3 — Sinh Migration Script & Cập nhật ORM
```
Actions:
  - Sửa file schema chính (`schema.prisma`, Drizzle `schema.ts`, SQLAlchemy model).
  - Tạo migration file có timestamp rõ ràng (VD: `20260914_add_phone_to_users.sql`).
  - Đi kèm cả script Rollback (Down migration) nếu framework hỗ trợ.
  - Chạy code generation cho types (VD: `npx prisma generate`).
```

### Step 4 — Verification
```
Actions:
  - Kiểm tra cú pháp SQL của migration file.
  - Kiểm tra tính tương thích ngược: Code cũ vẫn insert/query được mà không crash.
  - Kiểm tra Type definitions trong app có bị type error không (chạy tsc/type-check).
```

---

## Prompt Template

```
DB Engine:    [PostgreSQL / MySQL / SQLite / MongoDB]
ORM/Tool:     [Prisma / Drizzle / TypeORM / Alembic / Knex]
Thay đổi:     [Thêm bảng mới / Thêm trường / Sửa quan hệ / Đổi kiểu dữ liệu]
Mục đích:     [Mô tả nghiệp vụ cần lưu trữ]
Dữ liệu live: [Có dữ liệu production đang chạy không?]
```

### Ví dụ theo Stack:

**Prisma (PostgreSQL)**
```
DB Engine:    PostgreSQL
ORM:          Prisma
Thay đổi:     Thêm trường `phoneNumber` vào model `User`, không bắt buộc nhưng phải unique nếu có.
Dữ liệu live: Có (hơn 100k users)
```
→ AI cập nhật: `phoneNumber String? @unique` trong `schema.prisma`, sinh migration SQL với `CREATE UNIQUE INDEX CONCURRENTLY` (nếu cần), chạy `prisma generate`.

**Drizzle ORM (MySQL)**
```
DB Engine:    MySQL
ORM:          Drizzle
Thay đổi:     Tạo bảng `AuditLog` lưu lịch sử hành động người dùng (id, userId, action, metadata JSON, createdAt).
```
→ AI tạo: `auditLogs` table definition trong `src/db/schema.ts`, sinh migration file với Drizzle Kit, export type `AuditLog` và `NewAuditLog`.

