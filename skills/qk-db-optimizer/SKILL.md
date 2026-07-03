---
name: qk-db-optimizer
version: 5.0.0
updated: 2026-07-03
description: Tối ưu hóa Database (đánh Index, xử lý N+1 Queries, Slow Queries).
category: database
tags: [database, performance, optimization, queries]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-db-optimizer

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Tìm nguyên nhân gây nghẽn cổ chai DB và đề xuất Query Optimization.
- ❌ Do NOT vội vàng đề xuất Redis/Cache trước khi fix tận gốc câu SQL lỗi.

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
  - id: optimization-strategy
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: over-indexing
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff
```
