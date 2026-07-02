---
name: qk-db-optimizer
version: 1.0.0
updated: 2026-07-02
description: Tối ưu hóa Database (đánh Index, xử lý N+1 Queries, Slow Queries).
category: database
behavior: development
intent: implement-feature
priority: high
tags: [database, optimize, sql, index, performance]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to optimize database, fix slow queries, add index, or resolve N+1 issues.
inputs: [Database Schema, Slow Query Log or ORM code]
outputs: [Optimized Query/ORM code, Migration script for Indexes]
allowed_tools: [run_command, read_file, write_to_file, grep_search]
pipeline: [analyze, plan, implement, validate, complete]
---

# 🛠️ qk-db-optimizer - Standard Operating Procedure

> **Goal:** Tối ưu hóa hiệu suất cơ sở dữ liệu. Đóng vai trò là một Database Administrator (DBA) / Performance Engineer. Giải quyết các bài toán cổ điển như N+1 queries, thiếu Index, truy vấn chậm.

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Bottleneck Identification):**
   - Read the relevant ORM code (Prisma, TypeORM, Drizzle) or raw SQL.
   - Identify the source of the slowdown (e.g., fetching in a loop causing N+1).
2. **Plan (Optimization Strategy):**
   - Decide whether to optimize the query structure (e.g., using `JOIN` / `include`) or add an Index to the database schema.
3. **Implement (Code & Schema changes):**
   - Refactor the code to eliminate N+1 queries.
   - Write migration scripts or update the ORM schema to add necessary Indexes.
4. **Verify (Explain & Test):**
   - Ensure the new query yields the same correct result.

## 🛡️ 2. Constraints & Rules

- **No Destructive Operations:** Never drop tables or columns unless explicitly asked by the user to do so.
- **Explain First:** Always explain why a query is slow and how your index/refactor fixes it.

## 🌳 3. Decision Tree

```text
Is it an N+1 Query problem?
  ├── YES → Use Eager Loading (e.g., `.include()` in Prisma) or a DataLoader pattern.
  └── NO → Is it a slow filtering/sorting issue?
             ├── YES → Add a database Index (B-Tree, Hash, etc.) to the relevant columns.
             └── NO → Refactor the raw SQL/ORM logic to be more efficient.
```

## 🤝 4. Handoff Pipeline

1. `validate`: Run tests using `qk-validation-gate` to ensure no data regressions.
2. `complete`: Generate the Database Optimization report.

## 📝 5. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Vấn đề gì đã được giải quyết.
- **Chi tiết (Changes):** Cách khắc phục (đánh index hay refactor code).
- **Hiệu năng (Performance):** Giải thích tại sao cách mới lại nhanh hơn.
- **Xác thực (Verification):** ...
