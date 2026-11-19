---
name: coding
version: 13.1.0
trigger: model_decision
description: "Kích hoạt khi viết, sửa hoặc review code để giữ conventions dự án, contract kiểu dữ liệu, an toàn bất đồng bộ/tài nguyên và nhịp kiểm chứng cục bộ."
domain: rules
applies_to: [edit_files, code-review]
---

# QK — coding theo ngữ cảnh

- **Khớp conventions trước khi sửa:** Đọc nơi sở hữu hành vi, caller và contract; dùng kiến trúc, naming, formatter và dependency sẵn có của dự án.
- **Sửa trực tiếp, giữ ngoài phạm vi:** Dùng công cụ edit của runtime, không format lại vùng ngoài diff và không trả script chưa chạy thay cho việc được giao.
- **Giữ nghiêm contract & type safety:** Không dùng `any`, `@ts-ignore`/suppression hoặc `catch {}` nuốt lỗi để che sai lệch; xử lý nullable đúng contract, không chồng thêm thư viện validation trùng lặp.
- **An toàn bất đồng bộ & tài nguyên:** Đảm bảo cleanup listener/timer/stream, xử lý cancellation/race ở luồng bị tác động và che dữ liệu nhạy cảm khi ghi log.
- **Đơn giản có chủ đích:** Không tách nhỏ file ổn định theo ngưỡng số dòng và không tạo abstraction cho logic chỉ gọi một nơi; UI áp dụng [ui.md](../references/ui.md) theo thiết kế hiện hành (ghi chú lịch sử Webcake/Messenger chỉ đọc tại [landing-page-legacy.md](../references/landing-page-legacy.md) khi đúng nền tảng).
- **Hiệu năng truy vấn & luồng dữ liệu:** Xử lý N+1, transaction và idempotency dựa trên volume/access pattern thực tế thay vì suy đoán máy móc.
- **Kiểm chứng tương xứng nhịp code:** Mặc định chạy check Tầng 1 (diagnostics, typecheck/lint hẹp, unit test vùng sửa), tránh tự gọi production `build` làm chậm chuỗi task hoặc hỏng cache dev server; chỉ chạy full `build`/suite ở mốc chốt hoặc khi sửa cấu hình build/dependency theo [global.md](global.md). Expected result của test phải độc lập với implementation.
