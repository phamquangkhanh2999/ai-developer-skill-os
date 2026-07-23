# E-commerce Design Intelligence

## 1. Core Principles
- **Conversion-Optimized**: Mục tiêu tối thượng là tăng tỉ lệ chuyển đổi (Click to Cart, Checkout).
- **Visual Hierarchy**: Hình ảnh sản phẩm là vua, nút "Mua hàng" phải là thứ nổi bật nhất màn hình.
- **Scarcity & Urgency**: Sử dụng các pattern như đếm ngược, số lượng còn lại, đánh giá (Reviews).

## 2. Visual Language
- **Màu sắc**: Màu nhấn (Brand color) hoặc các màu kích thích hành động (Cam/Đỏ/Đen tuyền). Các nút phụ (Thêm vào wishlist) phải mờ nhạt hẳn so với nút Mua.
- **Typography**: Giá tiền thường dùng font weight đậm, giá khuyến mãi đi kèm giá gốc bị gạch ngang.
- **Hình ảnh**: Product card cần aspectRatio vuông (1:1) hoặc chữ nhật (4:5) có nền trắng/xám đồng nhất.

## 3. Component Patterns
- **Product Card**: Chứa Ảnh (có tag Giảm giá nổi bật), Tên sản phẩm (truncate 2 dòng), Đánh giá (Số sao vàng), Giá tiền, và nút Add to Cart dạng Icon hoặc Full Width.
- **Sticky CTA**: Trên Mobile, nút Mua/Thanh toán thường ghim chặt (Sticky) ở cạnh dưới màn hình.
- **Badges**: Các tem "Bán chạy", "Freeship", "Mới" dùng màu sắc sặc sỡ, font size rất nhỏ (`text-[10px]` hoặc `text-xs` uppercase font-bold).