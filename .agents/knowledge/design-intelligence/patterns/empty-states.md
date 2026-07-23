# Empty States (Trạng thái rỗng)

Màn hình trống không được phép chỉ hiển thị "Chưa có dữ liệu". Phải luôn dẫn dắt người dùng.

## 1. Cấu trúc chuẩn
- **Hình ảnh/Icon**: Một hình minh họa tinh tế hoặc Icon lớn màu xám nhạt (`text-slate-300`).
- **Tiêu đề chính**: Giải thích rõ tại sao không có dữ liệu (Vd: "Bạn chưa có dự án nào").
- **Mô tả phụ**: Hướng dẫn người dùng phải làm gì tiếp theo.
- **Primary CTA (Nút)**: Nút hành động nổi bật (Vd: "Tạo dự án mới").

## 2. Các trường hợp sử dụng
- **Lần đầu sử dụng (Onboarding)**: Giới thiệu tính năng.
- **Xóa sạch dữ liệu (Cleared)**: Khi user đã hoàn thành công việc (Vd: Inbox Zero). Khen ngợi user!
- **Lỗi tìm kiếm (No Results)**: Cung cấp tùy chọn xóa bộ lọc (Clear Filters).

## 3. Visual Styling
- Nằm ở trung tâm khu vực hiển thị (Center-aligned).
- Giới hạn chiều rộng (`max-w-sm`) để text không bị dàn mỏng.