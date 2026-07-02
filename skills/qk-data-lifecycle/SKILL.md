---
name: qk-data-lifecycle
purpose: Quản lý Schema, Migration, Repository, Query Tuning.
mode_supported: [enterprise]
input: [Data requirement]
output: [Schema, Migration files]
workflow: [1. Schema -> 2. Migration -> 3. Repository -> 4. Index]
allowed_tools: [write_to_file, run_command]
handoff_to: [qk-validation-gate]
---

# 🛠️ qk-data-lifecycle - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Quản lý Schema, Migration, Repository, Query Tuning.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-validation-gate`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Database Engineer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User says "create a new table", "add a column", "design the schema"
- Writing complex data retrieval logic (joins, aggregations)
- A query is running slowly and needs optimization (indexing)
- Running or generating database migrations

---

## Scope

- ✅ **Schema Design:** Model tables, relations (1:1, 1:N, N:M), and constraints (Unique, FK).
- ✅ **ORM Integration:** Generate code for Prisma, Drizzle, TypeORM, Sequelize, or Mongoose.
- ✅ **Migrations:** Generate SQL or ORM migration files safely.
- ✅ **Query Optimization:** Prevent N+1 queries, add indexes, use efficient aggregations.

---

## Non-goals

- ❌ Do NOT execute destructive migrations (DROP TABLE) on production environments without extreme warnings and approval.
- ❌ Do NOT mix raw SQL into ORM logic unless necessary for performance.

---

## Workflow

### Phase 1 — Schema Design

Understand the business entities and relations.
- Identify primary keys (UUID vs Auto-increment ID).
- Identify foreign keys and cascade rules (`ON DELETE CASCADE`).
- Ensure proper normalization (usually 3NF) or denormalization (if NoSQL).

### Phase 2 — ORM / Migration Generation

Map the design to the project's tool:
- **Prisma:** Update `schema.prisma`.
- **Drizzle:** Update `schema.ts`.
- **Raw SQL:** Write `V1__create_table.sql`.

### Phase 3 — Query Implementation

Write the data access methods (Repository pattern or direct ORM calls).
- Avoid fetching `SELECT *` if only 2 columns are needed.
- Batch queries or use joins to prevent N+1 issues.

---

## Decision Tree

```
Is the project using an ORM?
  ├── Prisma  → Modify `schema.prisma`, use `prisma.entity.findMany()`
  ├── Drizzle → Modify schema TS files, use Drizzle query builder
  └── No      → Write raw SQL or use query builder (Knex)

Does the schema change drop data or alter existing columns?
  ├── Yes → Flag as High Risk. Provide rollback strategy. Ask for approval.
  └── No  → Standard migration (e.g., adding a nullable column).
```

---

## Output Format

```
🗄️ Database Engineering Report
─────────────────────────────────────────────────
Action:     [Schema Update / Query Optimization]
Tooling:    [Prisma / Raw SQL / etc.]

Changes:
  ✅ Added model: `User` (1:N with `Post`)
  ✅ Added index on `User.email`
  ✅ Generated query: `getUserWithPosts`

⚠️ Risk Assessment:
  [Low / High — e.g., "Safe addition, no data loss"]

🔗 Next Steps:
  Run `npx prisma migrate dev` to apply these changes locally.
```
