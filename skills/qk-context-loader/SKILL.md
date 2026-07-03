---
name: qk-context-loader
version: 5.0.0
updated: 2026-07-03
description: Tải các file liên quan và vẽ biểu đồ phụ thuộc (dependency graph) cho một tác vụ.
category: utilities
tags: [context, filesystem, dependencies, graph]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-context-loader

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Tìm và nạp các file phụ thuộc (Dependencies, Imports).
- ❌ Do NOT nạp toàn bộ repo hoặc thư mục `node_modules` gây phình Context Window.

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
  - id: complexity-budget
```

---

## 🛡️ Biases (Sửa lỗi mặc định)
```yaml
Biases:
  - id: hallucinated-tools # (Đoán mò tên file thay vì tìm kiếm thật)
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: delegation-only # (Chỉ thu thập thông tin, cấm chỉnh sửa code)
```
