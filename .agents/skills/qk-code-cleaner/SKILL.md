---
name: qk-code-cleaner
version: 13.1.0
status: stable
subtitle: "Refactor & Viết Test"
description: "Dùng khi refactor giữ contract, nâng dependency hoặc bổ sung unit/integration test. Thay đổi hành vi nghiệp vụ thuộc qk-feature-delivery."
platforms: [antigravity]
runtime_version: 1
references:
  - ../../references/backend-data.md
  - ../../references/ui.md
rules:
  - global
  - coding
  - safety
triggers:
  - "refactor"
  - "tái cấu trúc"
  - "tách file"
  - "tách hàm"
  - "clean code"
  - "giảm complexity"
  - "upgrade thư viện"
  - "update package"
  - "viết test"
  - "unit test"
---

# QK — bảo trì và kiểm thử

Kiểm chứng theo tầng và báo cáo theo [global.md](../../rules/global.md) cho bằng chứng, quyền và nghiệm thu.

- **Refactor:** giữ contract/hành vi được yêu cầu; ghi nhận baseline ở phần liên quan, sửa cấu trúc có lợi ích cụ thể, rồi đối chiếu kết quả. Khi refactor theo chuỗi nhiều bước, kiểm Tầng 1 ở từng bước và hoãn full `build`/suite tới mốc chốt. Không tách file hoặc thêm abstraction chỉ để đạt ngưỡng dòng.
- **Nâng dependency:** đọc changelog/migration chính chủ, kiểm compatibility và lockfile; chạy kiểm chứng Tầng 2 (`build`, checks bắt buộc và hồi quy liên quan). Khi đổi behavior là mục tiêu người dùng đã giao, chuyển feature nội bộ và giữ task; không dừng chỉ vì đổi nhãn skill.
- **Bổ sung test:** lấy expected result từ yêu cầu, contract, dữ liệu hoặc quan sát được xác nhận. Ưu tiên case có thể phát hiện sai lệch thật, không assertion chỉ sao chép implementation hoặc mock. Mô tả giới hạn test.

Với thay đổi có rủi ro, có cách khôi phục delta đã làm. Test pass chỉ chứng minh các case và lớp đã chạy; chưa kiểm runtime thì ghi rõ. Tái sử dụng check còn hiệu lực, kiểm lại khi input/source liên quan đổi hoặc có concern mới.

Chỉ đọc [ui.md](../../references/ui.md) hoặc [backend-data.md](../../references/backend-data.md) khi vùng bảo trì thực sự cần. Trả checkpoint ngắn giữa chuỗi hoặc báo cáo theo global.md khi chốt mốc.
