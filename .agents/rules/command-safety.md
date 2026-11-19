---
version: 10.3.0
trigger: model_decision
description: "Kiểm tra mục tiêu và tác động lệnh shell, áp dụng quyền đã được cấp theo safety.md."
domain: rules
applies_to: [shell_exec]
---

# Kiểm tra lệnh shell

Áp dụng [safety.md](safety.md); file này không đặt thêm cổng xác nhận.

- Lệnh chỉ đọc: thực hiện khi liên quan đến tác vụ; giới hạn output để tránh lộ dữ liệu nhạy cảm.
- Lệnh có side effect: kiểm tra cwd, đường dẫn, flags và đối tượng trước khi chạy. Cài package, sửa config hoặc xóa cache được yêu cầu rõ có thể thực hiện trong đúng phạm vi quyền đã cấp.
- DROP/TRUNCATE, reset --hard, force push, terraform destroy, xóa dữ liệu hoặc đổi quyền truy cập diện rộng cần quyền rõ cho tác động cụ thể. Yêu cầu sửa bug hoặc tối ưu chung không cấp quyền cho các thao tác này.
- Phân biệt xóa đúng thư mục cache đã được giao với xóa hệ thống/volume/dữ liệu người dùng. Tránh wildcard rộng; không dựa riêng vào chuỗi "rm -rf" hay "Remove-Item" để suy mức rủi ro.
- Không thay toàn bộ quyền truy cập bằng chmod 777 hoặc tương đương để chữa lỗi permission. Dùng quyền tối thiểu đúng với nhu cầu.
- Commit/push/deploy chỉ thực hiện khi được giao tương ứng; không suy quyền publish từ quyền sửa file local.
