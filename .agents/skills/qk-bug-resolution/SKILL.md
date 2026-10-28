---
name: qk-bug-resolution
version: 10.4.0
status: stable
subtitle: "Debug & Fix Bug"
description: "Chẩn đoán nguyên nhân gốc rễ và khắc phục lỗi mã nguồn theo chu trình khép kín: Observe → Evidence → Cause → Minimal Fix → Verify. Dùng khi: fix bug, sửa lỗi, crash, error, exception, trace lỗi, điều tra nguyên nhân bug, not working, lỗi UI, lỗi API."
platforms: [antigravity, claude, opencode]
runtime_version: 1
references:
  - ../../references/ui.md
  - ../../references/backend-data.md
rules:
  - global
  - coding-standards
  - safety
workflow: bug-resolution
triggers:
  - "fix bug"
  - "sửa lỗi"
  - "crash"
  - "error"
  - "exception"
  - "not working"
  - "bị lỗi"
  - "debug"
  - "trace lỗi"
  - "điều tra nguyên nhân bug"
---

# qk-bug-resolution — Chẩn Đoán & Khắc Phục Lỗi Mã Nguồn

> **Hợp đồng cốt lõi:** Tuân thủ [.agents/rules/global.md](../../rules/global.md). Dòng mở đầu bắt buộc: `Dùng qk-bug-resolution vì <lỗi hoặc triệu chứng cụ thể>.`

---

## 1. Chu Trình 5 Bước Khép Kín (Observe ➔ Evidence ➔ Cause ➔ Fix ➔ Verify)

```text
[1. Quan sát (Observe)]    ── Ghi nhận triệu chứng & ngữ cảnh kích hoạt lỗi
           │
           ▼
[2. Bằng chứng (Evidence)]  ── Trích dẫn file:dòng, stack trace, hoặc reproduction
           │
           ▼
[3. Nguyên nhân (Cause)]    ── Chỉ rõ cơ chế gây lỗi (hoặc nêu giả thuyết nếu đang điều tra)
           │
           ▼
[4. Sửa tối thiểu (Fix)]   ── Sửa đúng điểm lỗi, loại trừ nguyên nhân gốc rễ
           │
           ▼
[5. Kiểm chứng (Verify)]    ── Chạy lệnh kiểm thử thực tế và đối chiếu kết quả
```

### Nguyên tắc điều tra:
- **Thiếu log hoặc triệu chứng mơ hồ:** DỪNG LẠI và hỏi một câu làm rõ (clarify) để lấy thông tin log/reproduction thiết yếu, tuyệt đối KHÔNG đoán mò nguyên nhân gốc rễ.
- **Không ép giả thuyết thừa:** Nếu bằng chứng stack trace và code đã chỉ rõ 100% dòng lỗi, đi thẳng vào nguyên nhân gốc; không cần ép dựng đủ 3 giả thuyết hình thức.
- **Không dùng hack che giấu:**
  - CẤM dùng `as any`, `@ts-ignore`, hoặc `try/catch` rỗng để nuốt exception.
  - Optional chaining `?.` chỉ hợp lệ khi contract cho phép giá trị nullable. Không lạm dụng `?.` để che đậy việc API trả sai schema hợp đồng.

---

## 2. Nạp Kiến Thức Chuyên Môn Theo Nhu Cầu

- **Khi lỗi UI / Layout / Spacing:** Đọc [ui.md](../../references/ui.md) — Truy vết phần tử tràn ngang, kiểm tra mobile viewport (< 375px), touch target. Tuyệt đối KHÔNG hack `overflow: hidden` trên toàn bộ thẻ `<body>`.
- **Khi lỗi API / Backend / Database:** Đọc [backend-data.md](../../references/backend-data.md) — Kiểm tra contract response, data types, nullability, eager loading và transaction rollback.

---

## 3. Báo Cáo Kết Quả Chuẩn (5 Trường Bắt Buộc)

Sau khi sửa xong, BẮT BUỘC báo cáo đầy đủ 5 trường theo chuẩn `global.md`:
1. **Lỗi và điều kiện xảy ra:** Mô tả hành vi sai và điều kiện kích hoạt.
2. **Nguyên nhân + bằng chứng:** Đường dẫn `file:dòng`, log hoặc reproduction chứng minh cơ chế gây lỗi.
3. **Sửa gì + vị trí thay đổi:** Tóm tắt code đã sửa và vị trí cụ thể.
4. **Vì sao thay đổi loại bỏ nguyên nhân:** Phân tích vì sao sửa đổi giải quyết triệt để gốc rễ (phân biệt rõ nếu chỉ là workaround).
5. **Kiểm chứng:** Lệnh thực chạy, kết quả thu được (PASS/FAIL), và các phần chưa kiểm tra (`NOT_RUN`).
