---
name: qk-data-lifecycle
version: 3.1.0
updated: 2026-07-02
description: Manage Database Schema, Migrations, and Repositories.
category: database
behavior: development
intent: implement-feature
priority: medium
tags: [database, sql, migration, schema, orm]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to create a new database table, modify schema, or write complex queries.
inputs: [Data model requirements]
outputs: [Migration scripts, Models, Repositories]
allowed_tools: [run_command, read_file, write_to_file]
pipeline: [analyze, design, implement, engineering-standard, validate, complete]
---

# 🛠️ qk-data-lifecycle - Standard Operating Procedure

> **Goal:** Quản lý an toàn vòng đời dữ liệu, đảm bảo Schema chuẩn xác, Migration có thể Rollback và Query tối ưu.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Requirements):**
   - Understand the entities and their relationships (1:1, 1:N, N:N).
   - Identify the ORM/Query Builder used in the project (e.g., Prisma, TypeORM, Drizzle).
2. **Design (Schema & Normalization):**
   - Design the schema. Ensure foreign keys and indices are applied to frequently queried columns.
   - Always include audit columns (`created_at`, `updated_at`).
3. **Implement (Migration & Models):**
   - Write the Migration script. MUST include both `up` (apply) and `down` (rollback) logic.
   - Write/Update the Model/Entity files.
   - Create Repository layer functions if necessary.
4. **Verify (Safety Check):**
   - Review the migration script for destructive operations (e.g., `DROP TABLE`, `DROP COLUMN`).

## 🛡️ 2. Constraints & Rules

- **No Data Loss:** NEVER execute a migration that drops data on Production without explicit User approval and a backup plan.
- **Decoupling:** Do not write SQL queries directly in Controllers. Always use the Repository or DAO pattern.
- **Index Rule:** Any column used in a `WHERE`, `JOIN`, or `ORDER BY` clause should be evaluated for an index.

## 🌳 3. Decision Tree

```text
Is this modifying an existing table in Production?
  ├── YES → Does it drop a column or change a data type destructively?
  │       ├── YES → STOP. Create a new column, migrate data, then drop the old one (Expand & Contract Pattern).
  │       └── NO → Proceed with safe migration (e.g., ADD COLUMN).
  └── NO (New Table) → Ensure Primary Key, Timestamps, and Foreign Keys are defined.
```

## 🤝 4. Handoff Pipeline

1. `engineering-standard`: Verify naming conventions (e.g., snake_case for DB columns if required).
2. `validate`: Run dry-run migrations or unit tests.
3. `complete`: Generate the Database report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Bảng nào được tạo/sửa.
- **Chi tiết (Changes):** File migration và Model đã sinh ra.
- **Kiến trúc (Reasoning):** Lý do thiết kế quan hệ bảng và các Index.
- **Rủi ro (Risks):** Đánh giá mức độ an toàn của Migration (Có làm mất data không?).
- **Hành động tiếp (Next Action):** Hướng dẫn user chạy lệnh migrate.
