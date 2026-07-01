---
name: bug-fix
description: >-
  Chẩn đoán và sửa bug một cách an toàn, có hệ thống cho nhiều loại dự án.
  Dùng khi người dùng báo lỗi qua stack trace, exception, behavior sai, test
  fail, crash, regression hoặc bất kỳ vấn đề nào cần tìm nguyên nhân gốc rồi
  sửa tối thiểu và có bằng chứng trước/sau.
version: 1.1.0
---

# Bug Fix — Diagnose & Repair

Tìm nguyên nhân gốc rồi sửa bằng thay đổi tối thiểu và có bằng chứng rõ ràng.
Không đoán mò, không vá triệu chứng, không refactor vượt phạm vi.

## Nguyên tắc cốt lõi

1. **Reproduce first** — phải tái hiện được bug trước khi sửa.
2. **Root cause over symptom** — sửa nguyên nhân, không che lỗi bằng `try/catch` rỗng hay `?.` bừa.
3. **Minimal diff** — chỉ thay đổi những gì cần thiết để fix đúng vấn đề.
4. **Evidence-based** — mọi kết luận phải có bằng chứng từ log, test, repro hoặc diff.
5. **Verify before done** — chỉ báo hoàn tất khi đã chứng minh lỗi đã hết và không gây regression.

## Khi nào dùng skill này

- Stack trace / exception / error message
- Hành vi sai so với kỳ vọng
- Test fail / CI đỏ
- Crash, hang, memory leak, race condition
- Regression sau khi đổi code
- Bug khó tái hiện hoặc chập chờn

## Phạm vi áp dụng

Skill này phù hợp cho web app, backend service, library, CLI, script, automation,
API integration, data pipeline và các hệ thống khác có thể bị lỗi logic hoặc runtime.

## Quy trình 7 bước

### 1 — Triage & understand the report

Nắm rõ: triệu chứng, môi trường, bước tái hiện, expected vs actual, mức nghiêm trọng,
phạm vi ảnh hưởng. Nếu thiếu thông tin quan trọng, hãy hỏi trước khi sửa.

### 2 — Reproduce the issue

- Dựng lại bug bằng test, script hoặc lệnh cụ thể.
- Ghi lại lệnh tái hiện và điều kiện cần thiết.
- Nếu bug chập chờn, chạy nhiều lần và cô lập yếu tố như timing, data, environment, thứ tự.
- Nếu repo có test, ưu tiên viết một failing test thể hiện bug.

### 3 — Localize the problem

- Đọc stack trace từ trên xuống, theo frame trong code dự án.
- Giới hạn phạm vi bằng log, breakpoint, git blame, git bisect.
- Xác định file/line nghi ngờ và đường đi dữ liệu dẫn tới lỗi.

### 4 — Analyze the root cause

- Trả lời: tại sao lỗi xảy ra? điều kiện nào kích hoạt?
- Phân loại lỗi: logic sai, off-by-one, null/undefined, async/race, type mismatch,
  stale state/cache, boundary case, config/env, API contract change, dependency issue.
- Dùng kỹ thuật 5 Whys tới khi chạm nguyên nhân thật, không dừng ở triệu chứng.

### 5 — Apply the fix

- Sửa đúng chỗ, đúng nguyên nhân, đúng mức cần thiết.
- Giữ đúng style và convention hiện có; không đổi public API trừ khi bắt buộc.
- Xử lý các edge case liên quan để tránh lặp lại lỗi tương tự.
- Không để lại debug code thừa, log rác hoặc exception bị nuốt.

### 6 — Verify the result

- Failing test ở bước 2 phải pass.
- Chạy lại test suite liên quan + lint/type-check nếu có.
- Kiểm tra lại kịch bản tái hiện ban đầu: lỗi đã hết và không tạo regression.
- Nếu thay đổi behavior, nêu rõ side-effects.

### 7 — Report and prevent recurrence

- Tóm tắt: root cause, fix, evidence trước/sau.
- Đề xuất phòng ngừa: thêm test, guard, kiểm tra nơi tương tự, ghi chú về issue hệ thống nếu cần.

## Output bắt buộc

Sau khi sửa, trình bày ngắn gọn theo cấu trúc:

```text
🐛 Triệu chứng:   <mô tả + cách tái hiện>
🔎 Root cause:    <nguyên nhân gốc tại file:line, vì sao>
🔧 Fix:           <thay đổi gì, vì sao tối thiểu>
✅ Verify:        <test/lệnh đã chạy + kết quả pass, no regression>
🛡️ Phòng ngừa:    <test thêm / guard / nơi tương tự cần xem>
```

## Quy tắc PHẢI / KHÔNG

**PHẢI:** tái hiện trước khi sửa · tìm root cause · viết/cập nhật test nếu có · diff tối thiểu · verify bằng test/lint/type-check · báo bằng chứng trước/sau.

**KHÔNG:** sửa mò khi chưa hiểu nguyên nhân · vá triệu chứng bằng try/catch rỗng, `?.` hoặc `!` bừa · refactor/format ngoài phạm vi · đổi public API khi không cần · bỏ qua bước verify · để lại debug code.

## Checklist trước khi đóng bug

- [ ] Đã tái hiện được bug ban đầu
- [ ] Có failing test thể hiện bug (nếu repo có test)
- [ ] Đã xác định root cause cụ thể (file:line + lý do)
- [ ] Diff tối thiểu, đúng style dự án
- [ ] Failing test giờ PASS
- [ ] Test liên quan + lint + type-check sạch (no regression)
- [ ] Không còn debug code / log thừa / code chết
- [ ] Đã nêu side-effects và gợi ý phòng ngừa
