---
name: qk-bug-resolution
version: 13.1.0
status: stable
subtitle: "Debug & Fix Bug"
description: "Dùng khi cần chẩn đoán hoặc sửa hành vi sai: crash, lỗi UI/API, lỗi dữ liệu hoặc logic trong pipeline. Lỗi thiết lập CI/image dùng qk-devops-release."
platforms: [antigravity]
runtime_version: 1
references:
  - ../../references/ui.md
  - ../../references/backend-data.md
rules:
  - global
  - coding
  - safety
  - subagent-orchestration
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

# QK — sửa hành vi sai

Dùng [global.md](../../rules/global.md) cho nhịp thực thi, phạm vi, quyền, tầng kiểm chứng và báo cáo; skill này chỉ bổ sung cách điều tra lỗi.

1. Ghi nhận triệu chứng và kết quả đúng từ yêu cầu/contract. Tìm tín hiệu phân biệt lỗi với đúng: reproduction, request/readback, log có ngữ cảnh hoặc test sát hành vi. Nếu không thể tái hiện, dùng source để xây giả thuyết và nói rõ giới hạn.
2. Truy vết nơi tạo giá trị/hành vi sai, caller và dependency bị ảnh hưởng. Khi bằng chứng đã đủ, sửa ở nguồn; không cần dựng thêm số lượng giả thuyết hình thức.
3. Kiểm chứng theo nhịp trong [global.md](../../rules/global.md): mặc định chạy reproduction/typecheck/unit test sát triệu chứng (Tầng 1) và hoãn full `build`/suite sang mốc chốt khi sửa nối tiếp nhiều lỗi; chỉ chạy Tầng 2 khi chốt đợt sửa hoặc lỗi ở cấu hình build/contract rộng. Expected result phải có căn cứ độc lập; test tự viết không thay thế UI/runtime/readback khi tiêu chí yêu cầu những lớp đó.

Thiếu log không tự chặn sửa nếu source/reproduction chứng minh lỗi. Lỗi logic dữ liệu trong ingestion/pipeline thuộc skill này; lỗi thiết lập runner/image thuộc DevOps. Đổi skill nội bộ khi xác định đúng nơi sở hữu lỗi, giữ nguyên context task.

Nếu thử lại không có bằng chứng mới, dùng cơ chế đổi hướng trong global.md; không chồng workaround chỉ để làm biến mất error. Với request lưu chưa biết kết quả, đọc lại trạng thái trước khi gửi mutation lần nữa.

Chỉ nạp [ui.md](../../references/ui.md) cho lỗi UI/layout hoặc [backend-data.md](../../references/backend-data.md) cho contract/API/data liên quan. Trả checkpoint ngắn nếu còn sửa tiếp theo chuỗi, hoặc báo cáo theo global.md khi khép việc (phân biệt root cause với workaround).
