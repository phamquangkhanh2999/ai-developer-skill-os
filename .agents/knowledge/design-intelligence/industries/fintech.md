# Fintech Design Intelligence

## 1. Core Principles
- **Trust & Security**: Giao diện phải mang lại cảm giác an toàn tuyệt đối.
- **Data Density**: Hiển thị nhiều dữ liệu (bảng biểu, số liệu) nhưng không lộn xộn.
- **Precision**: Các con số tiền tệ cần căn lề phải (right-aligned) và sử dụng tabular numbers (Tailwind: `tabular-nums`) để không bị giật khi số thay đổi.

## 2. Visual Language
- **Màu sắc**: Xanh dương (Blue/Indigo) tạo sự chuyên nghiệp và tin cậy; Xanh lá (Emerald) cho lợi nhuận/thành công; Đỏ (Rose) cho thua lỗ/chi tiêu.
- **Typography**: Phông chữ gọn gàng, rõ ràng (Inter, Roboto). Chú ý đặc biệt đến trọng lượng chữ cho các con số tổng tiền (Balance) thường dùng `font-semibold` hoặc `font-bold`, kích thước lớn.
- **Bảng (Tables)**: Không viền dọc, chỉ dùng viền ngang (horizontal dividers) nhạt (`border-slate-100`) với padding rộng rãi để dễ dò hàng.

## 3. Component Patterns
- **Cards**: Ít dùng shadow lớn. Thường dùng border 1px nhạt (`border border-slate-200`) hoặc shadow cực mỏng (`shadow-sm`).
- **Data Visualization**: Biểu đồ (Sparklines) đơn giản, dùng gradient mờ ảo.
- **Empty States**: Rất quan trọng để hướng dẫn người dùng liên kết thẻ, nạp tiền.