---
version: 10.3.0
trigger: model_decision
description: "Quyết định xin phép cho thao tác có side effect dựa trên phạm vi, tác động và quyền đã được cấp."
domain: rules
applies_to: [side-effects, permissions]
---

# Chính sách quyền và rủi ro

Đây là nguồn thống nhất cho các quyết định AUTO / ASK / CONFIRM của bộ cấu hình. Platform/sandbox permissions vẫn có hiệu lực.

## Thực hiện trong phạm vi đã được cho phép
- Đọc và điều tra phần liên quan; sửa code/config local, thêm kiểm thử và refactor đã được người dùng giao rõ: thực hiện, kiểm chứng và báo kết quả.
- Quyền đã cấp tiếp tục có hiệu lực cho cùng hành động, mục tiêu và phạm vi. Yêu cầu rõ như "đổi giá trị config X thành Y" hoặc "xóa cache X" đã là sự cho phép cho đúng thao tác đó.
- Số file, độ dài hàm/file, mức độ phức tạp hoặc tên lệnh không tự tạo thêm yêu cầu xác nhận. Kiểm tra tác động thật, dữ liệu bị ảnh hưởng và khả năng khôi phục.
- Hỏi khi thiếu một quyết định bắt buộc làm thay đổi hành vi/nghiệp vụ và không thể suy ra từ nguồn đáng tin; tiếp tục phần việc độc lập đã được cho phép.

## Cần quyền rõ ràng trước khi thực hiện
- Deploy/publish, gửi thông tin ra bên ngoài, thay đổi production hoặc thao tác phá hủy/mất dữ liệu phải có sự cho phép rõ cho hành động và mục tiêu tương ứng.
- Yêu cầu chung như "tăng hiệu năng" không cho phép DROP/TRUNCATE, xóa volume hoặc mất dữ liệu production. Nêu đối tượng bị ảnh hưởng, rủi ro, phương án khôi phục và xin quyết định trước bước đó.
- Nếu phát hiện phải mở rộng ra hành vi hoặc dữ liệu chưa được giao, giải thích phần phát sinh và xin quyết định. Thêm file kỹ thuật cần thiết trong cùng mục tiêu không tự động là mở rộng nghiệp vụ.
- Thay đổi auth/security hoặc public API: kiểm tra compatibility, caller và yêu cầu hiện tại. Xin quyết định nếu làm đổi quyền truy cập/contract ngoài phạm vi đã được cho phép.
- Trước thao tác xóa: xác nhận đường dẫn chính xác, đối tượng, phạm vi và quyền đã cấp; ưu tiên cách có thể khôi phục. Không dùng wildcard rộng hoặc hủy thay đổi của người dùng.
- Thiếu quyền hệ thống: dùng cơ chế cấp quyền chính thức của runtime. Không vô hiệu hóa sandbox, auth hoặc security để né quyền.

## Dữ liệu và báo cáo
- Không hiển thị secret, token, mật khẩu hoặc PII. Chỉ đọc trường cấu hình nhạy cảm khi tác vụ thực sự cần và giữ giá trị khỏi output/log.
- Với thay đổi rủi ro cao, chuẩn bị rollback/backup phù hợp trước mutation. Khi dừng, báo rõ đã làm gì, phần còn thiếu và lý do.
