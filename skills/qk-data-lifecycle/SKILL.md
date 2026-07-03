---
name: qk-data-lifecycle
version: 5.0.0
updated: 2026-07-03
description: Quản lý Database Schema, Migrations, và Repositories.
category: database
tags: [database, schema, migrations, orm]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-data-lifecycle

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Thiết kế cấu trúc CSDL và viết file Migration an toàn.
- ❌ Do NOT xóa cột hoặc đổi tên cột đang dùng (DROP/RENAME) mà không dùng cơ chế "Expand & Contract".

---

## ⚙️ Capabilities (Cognitive Pipeline)
```yaml
Pipeline:
  - inference
  - planning
  - execution
  - bias-review
  - ship-check
```

---

## 🎛️ Dials (Hành vi)
```yaml
Dials:
  - id: strictness
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: over-indexing # (Chống thói quen đánh index bừa bãi)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff
```
