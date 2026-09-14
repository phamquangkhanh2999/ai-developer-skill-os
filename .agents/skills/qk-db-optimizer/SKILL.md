---
# ── Identity ───────────────────────────────────────────────
name: qk-db-optimizer
version: 9.2.0
status: stable
description: "Tối ưu hiệu năng Database dựa trên bằng chứng kỹ thuật: phân tích EXPLAIN/ANALYZE, phát hiện N+1 queries, thiết kế Composite/Partial Index, refactor câu truy vấn chậm. Dùng skill này khi user nhắc đến: tối ưu query, query chậm, optimize db, thêm index, explain, slow query, n+1 query, lag database — kể cả khi chỉ nói 'câu SQL này chạy mất 5 giây'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - database-optimization
  - performance-tuning

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "tối ưu query"
  - "query chậm"
  - "optimize db"
  - "thêm index"
  - "explain"
  - "slow query"
  - "n+1 query"
  - "lag database"


# ── V8: References ─────────────────────────────────────────
workflow: refactor

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-data-lifecycle
  - qk-refactor

knowledge_scope:
  owns:
    - database-performance
    - query-optimization
    - index-engineering
  references:
    - architecture
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: performance-regression

selection:
  priority: medium
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
consumes: [query-log, source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-db-optimizer — Evidence-Based Database Performance Tuner

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm chẩn đoán và khắc phục điểm nghẽn hiệu năng cơ sở dữ liệu dựa trên **bằng chứng đo lường thực tế**: `EXPLAIN (ANALYZE, BUFFERS)` → tìm root cause → đề xuất Index / Query Rewrite — **tuyệt đối không đoán mò**.

---

## Preconditions

Trước khi đề xuất tối ưu, AI BẮT BUỘC xác nhận:

- [ ] Đoạn query cụ thể (SQL thô hoặc câu gọi ORM) đang bị chậm.
- [ ] Schema định nghĩa bảng và **danh sách index hiện có** trên các cột liên quan.
- [ ] Output `EXPLAIN` hoặc `EXPLAIN ANALYZE` (nếu môi trường cho phép chạy query).
- [ ] Quy mô dữ liệu ước tính (e.g. bảng có 1.000 rows hay 50.000.000 rows).

*Nếu user yêu cầu "tối ưu database" mà không cung cấp query cụ thể hoặc slow log:*
→ **EXIT: BLOCKED**
→ Phản hồi: "Vui lòng cung cấp câu query bị chậm hoặc output log EXPLAIN để phân tích chính xác."

---

## Scope

✅ Skill này làm:
- Phân tích Execution Plan: Xác định `Seq Scan` trên bảng lớn, `Nested Loop` kém hiệu quả, `Temporary disk spill`, hoặc `Filter cost` cao.
- Phát hiện và giải quyết triệt để **N+1 queries** trong ORM (Prisma, Drizzle, Hibernate, ActiveRecord).
- Thiết kế Index chính xác: Composite Index (tuân thủ quy tắc Left-to-Right prefix), Partial Index (lọc `WHERE is_deleted = false`), Covering Index (`INCLUDE`).
- Tái cấu trúc câu truy vấn (Query rewrite): Chuyển `OFFSET` lớn sang Keyset Pagination (Cursor-based), thay `NOT IN` bằng `NOT EXISTS` hoặc `LEFT JOIN ... IS NULL`.
- Báo cáo định lượng trước và sau (Before / After Cost & Execution Time).

❌ Skill này KHÔNG làm:
- Thêm index bừa bãi vào mọi cột (làm chậm `INSERT`, `UPDATE`, tăng dung lượng đĩa).
- Tự ý thay đổi cấu trúc bảng hoặc drop cột (thuộc `qk-data-lifecycle`).
- Can thiệp phần cứng DB hoặc tune memory server nếu không có file cấu hình repo.

---

## Execution Steps

### Step 1 — Thu thập Query & Phân tích EXPLAIN Plan
```
Inputs:  Slow query SQL/ORM, Schema & Existing Indexes
Actions:
  - Đọc câu query: xác định predicates (WHERE, JOIN, ORDER BY, GROUP BY).
  - Đọc EXPLAIN output (nếu có):
    - Tìm Node có `Cost` cao nhất.
    - Kiểm tra `Rows Removed by Filter` (dấu hiệu thiếu index).
    - Kiểm tra Sort method (in-memory quicksort hay external merge on disk).
```

### Step 2 — Chẩn đoán Root Cause
```
Xác định vấn đề cốt lõi:
  - Missing Index: Cột lọc không có index dẫn tới Full Table Scan.
  - Sub-optimal Index: Có index nhưng sai thứ tự cột trong Composite Index.
  - Implicit Type Casting: So sánh varchar với int làm database vô hiệu hóa index.
  - N+1 Query: Gọi loop query con thay vì batch load.
  - Expensive Pagination: `OFFSET 100000` quét qua 100.000 dòng rồi vứt bỏ.
```

### Step 3 — Thiết kế Giải pháp Tối ưu
```
Actions:
  - Chiến lược Index:
    - Composite Index: Đặt cột equality (`=`) trước, cột range (`<`, `>`, `BETWEEN`) sau.
    - Partial Index: Khi chỉ query tập con dữ liệu (VD: `WHERE status = 'PENDING'`).
  - Chiến lược Query Rewrite:
    - Viết lại sang Cursor Pagination (`WHERE id > :last_id LIMIT 20`).
    - Dùng CTE hoặc Window functions thay cho multiple subqueries lặp lại.
  - Chiến lược ORM: Thêm `include`/`select` cụ thể, tránh `SELECT *`, áp dụng batch loader.
```

### Step 4 — Verification & So sánh định lượng
```
Actions:
  - Đối chiếu Expected Cost trước và sau tối ưu:
    Before: Seq Scan on orders (cost=0.00..45210.00 rows=1200000)
    After:  Index Scan using idx_orders_customer_created (cost=0.43..8.45 rows=20)
  - Đảm bảo câu query sau khi rewrite trả về đúng 100% dữ liệu như câu query cũ.
```

---

## Prompt Template

```
DB Engine:    [PostgreSQL / MySQL / SQLite / MongoDB]
Slow Query:   [Câu SQL hoặc đoạn code ORM cần tối ưu]
Schema:       [Định nghĩa bảng và index hiện tại]
Triệu chứng:  [Chạy mất bao lâu / Execution Plan nếu có]
Volume:       [Số lượng bản ghi trong các bảng liên quan]
```

### Ví dụ theo Stack:

**PostgreSQL (Composite Index & Keyset Pagination)**
```
DB Engine:    PostgreSQL 15
Slow Query:   SELECT * FROM orders WHERE customer_id = 123 AND status = 'COMPLETED' ORDER BY created_at DESC LIMIT 20 OFFSET 50000;
Volume:       Bảng orders có 10 triệu records. Hiện có index trên (customer_id).
```
→ AI chẩn đoán:
  1. Offset 50.000 buộc engine quét qua 50.000 index entries.
  2. Index hiện tại thiếu `status` và `created_at`.
→ AI giải pháp:
  1. Đề xuất Composite Index: `CREATE INDEX CONCURRENTLY idx_orders_cust_stat_created ON orders (customer_id, status, created_at DESC);`
  2. Rewrite sang Cursor Pagination: `SELECT id, total, created_at FROM orders WHERE customer_id = 123 AND status = 'COMPLETED' AND created_at < :last_created_at ORDER BY created_at DESC LIMIT 20;`

**Prisma ORM (Khắc phục N+1 Query)**
```
ORM:          Prisma
Code:         
  const users = await prisma.user.findMany({ take: 50 });
  for (const user of users) {
    user.posts = await prisma.post.findMany({ where: { authorId: user.id } });
  }
```
→ AI sửa thành single query batching với eager load:
  `const users = await prisma.user.findMany({ take: 50, include: { posts: { select: { id: true, title: true } } } });`

