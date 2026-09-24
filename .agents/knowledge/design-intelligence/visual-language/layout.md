# Layout Intelligence (Bố cục)

## 1. Container & Max-Width
Không bao giờ để văn bản chạy tràn màn hình siêu rộng (Ultra-wide).
- Đọc tối ưu: Đoạn văn chỉ nên dài từ 60-80 ký tự/dòng. (Tailwind: `max-w-prose` hoặc `max-w-2xl`).
- Main Layout: Thường bọc trong một container có max-width (Tailwind: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).

## 2. Flex vs Grid
- **Flexbox**: Dành cho giao diện 1 chiều (hàng hoặc cột). Ví dụ: Navbar, Danh sách tag, Nhóm nút bấm.
- **CSS Grid**: Dành cho bố cục 2 chiều, các Card đều nhau. (Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).

## 3. Responsive Breakpoints
Tư duy Mobile-First:
- Code mặc định luôn áp dụng cho Mobile (Màn hình dọc).
- `sm:` (640px) - Tablet nhỏ.
- `md:` (768px) - Tablet ngang / iPad.
- `lg:` (1024px) - Desktop / Laptop.
- Tránh dùng quá nhiều breakpoint trên 1 class, chỉ dùng khi layout thực sự vỡ.