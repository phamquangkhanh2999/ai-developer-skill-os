---
name: qk-[skill-name]
version: 11.0.0
status: stable
subtitle: "[Tên ngắn gọn]"
description: "[Một câu — skill này làm gì và dành cho ai]"
platforms: [antigravity, claude, opencode]
runtime_version: 1
references: []
rules:
  - global
  - coding-standards
  - safety
workflow: [workflow-name]
triggers:
  - "[trigger phrase 1]"
  - "[trigger phrase 2]"
---

# qk-[skill-name] — [Tên đầy đủ]

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-[skill-name] vì <mục tiêu cụ thể>.`

---

## 1. Nguyên Tắc Cốt Lõi & Phạm Vi Kỹ Thuật

- [Mô tả nguyên tắc cốt lõi của skill này]
- [Những việc BẮT BUỘC làm]
- [Những việc TUYỆT ĐỐI KHÔNG làm]

---

## 2. Quy Trình Thực Thi & Kiểm Chứng

```text
[Bước 1] ── Khảo sát phạm vi & điều kiện
   ↓
[Bước 2] ── Thực hiện thay đổi tối thiểu
   ↓
[Bước 3] ── Tự review diffs & chạy kiểm chứng thực tế
   ↓
[Bước 4] ── Báo cáo kết quả theo chuẩn global.md
```

- **Verification:** Chạy các lệnh kiểm thử thực tế và ghi nhận `PASS`, `FAIL`, hoặc `NOT_RUN`.
