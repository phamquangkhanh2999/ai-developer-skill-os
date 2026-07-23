# Skill Quality Rule

Tiêu chuẩn định nghĩa, duy trì và loại bỏ skill trong V8.

## Tiêu chuẩn tồn tại (Survival Standard)
Mỗi skill khi được add hoặc duy trì phải thỏa mãn:
1. **Decision Boundary Rõ Ràng**: Skill không được overlap scope với skill khác. Một task cụ thể chỉ nên resolve về đúng một skill duy nhất.
2. **Metadata Đầy Đủ**: Bắt buộc tuân thủ schema V8 (có `intent`, `trigger`, `verification`, `workflow`).
3. **Giá Trị Bền Vững**: Không tạo skill cho những snippet cấu hình đơn giản. Skill phải đại diện cho một "capability" (năng lực xử lý) có tính mở rộng.

## Quy trình Audit Skill
- **Đánh giá định kỳ**: Các skill sẽ được rà soát để đảm bảo không bị phình (bloat).
- **Phát hiện trùng lặp**: Nếu phát hiện 2 skill có chung mục đích, cần tiến hành gộp (merge) lại và phân định ranh giới (ví dụ: chia implementation và governance).
- **Loại bỏ**: Nếu skill không còn giá trị sử dụng hoặc đã được cover bởi core logic, đánh dấu `status: deprecated`. Không xóa ngay lập tức để giữ backward compatibility.
