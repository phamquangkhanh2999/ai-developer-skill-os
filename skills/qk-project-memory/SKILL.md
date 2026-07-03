---
name: qk-project-memory
version: 5.0.0
updated: 2026-07-03
description: Lưu trữ và truy xuất ngữ cảnh dự án dài hạn qua các phiên làm việc.
category: utilities
tags: [memory, context, storage]
platforms: [claude-code, cursor, windsurf, gemini-cli]
---

# 🛠️ qk-project-memory

> **Inheritance:** Kỹ năng này tuân thủ Kiến trúc v5.0 của `framework/KERNEL.md`.
> Output bắt buộc là Decision Summary.

---

## 🎯 Mission (Scope)
- ✅ Lưu trữ các Rule, ADR, và cấu hình bất biến vào memory.
- ❌ Do NOT dump toàn bộ file mã nguồn hoặc hội thoại vào memory gây phình to token.

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
  - id: hallucinated-tools
```

---

## 🛫 Ship Criteria
```yaml
Rules:
  - id: minimal-diff
```
