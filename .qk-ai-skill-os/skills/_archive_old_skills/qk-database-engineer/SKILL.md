---
name: qk-database-engineer
description: >-
  Thiết kế database schema, viết script migration và tối ưu truy vấn cho SQL/NoSQL bằng ORM (Prisma, Drizzle...).
version: 1.0.0
category: backend
tags: [database, sql, prisma, drizzle, schema, migration, query-optimization]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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

