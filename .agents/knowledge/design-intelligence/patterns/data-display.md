# Data Display Patterns

## 1. Tables (Bảng dữ liệu)
- **Thiết kế**: Dùng cho dữ liệu có cấu trúc. Bỏ viền dọc, giữ viền ngang nhạt (`border-b border-slate-200`).
- **Căn lề**: 
  - Text: Trái (Left).
  - Số lượng, Tiền tệ: Phải (Right).
  - Trạng thái (Status): Giữa hoặc Trái (Dùng Badge/Tag).
- **Phản hồi**: Hover vào từng hàng (`hover:bg-slate-50`) để người dùng không nhìn nhầm dòng.

## 2. Lists & Feeds (Danh sách)
- Thay vì dùng Card, các list item nên phân cách bằng border nhạt hoặc một khoảng trắng lớn (`gap-6`).
- Avatar, Tiêu đề, và Thời gian (Metadata) là 3 thứ bắt buộc phải có hệ thống phân cấp rõ ràng (Avatar lớn nhất, Tiêu đề đậm, Thời gian mờ).

## 3. Data Visualization (Biểu đồ)
- Không dùng quá 4 màu trong 1 biểu đồ tròn (Pie chart).
- Line chart nên có gradient fill phía dưới đường kẻ để tạo chiều sâu.
- Các trục (Axes) nên dùng màu mờ (`text-slate-400`) để không cạnh tranh với dữ liệu.