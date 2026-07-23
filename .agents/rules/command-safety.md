# Command Safety Rule

Bảo vệ hệ thống khỏi các lệnh nguy hiểm (Destructive Commands). 

## Mức độ Rủi ro (Risk Classification)

### 🔴 Nguy hiểm cấp độ 1 (CẤM HOẶC BẮT BUỘC CONFIRM TỪ USER)
Tuyệt đối không chạy tự động các lệnh sau. Phải có sự đồng ý rõ ràng từ user:
- `rm -rf /`, `rm -rf *`, `rm -rf node_modules` (trừ khi chắc chắn context).
- Xóa database: `drop database`, `drop table`, `TRUNCATE`.
- Lệnh Git phá hủy lịch sử: `git reset --hard`, `git push --force`.
- Lệnh liên quan đến hạ tầng: `terraform destroy`, `aws nuke`.

### 🟡 Nguy hiểm cấp độ 2 (CẦN KIỂM TRA TRƯỚC)
Có thể chạy nhưng phải verify kỹ file path và scope:
- Các lệnh thao tác file hàng loạt: `find . -name "*.js" -delete`.
- Lệnh cài đặt ảnh hưởng toàn cầu: `npm install -g`, `pip install`.
- Khởi động lại service hệ thống: `systemctl restart`.

## Action Plan
Trước khi đề xuất chạy một command thuộc nhóm Nguy hiểm, hãy dừng lại và yêu cầu xác nhận.
