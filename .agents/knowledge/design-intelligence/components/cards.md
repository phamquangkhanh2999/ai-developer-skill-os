# Cards (Thẻ thông tin) Intelligence

Card là đơn vị chứa (container) linh hoạt nhất để nhóm các thông tin liên quan.

## 1. Cấu trúc chuẩn (Anatomy)
- **Header**: Icon, Hình ảnh (Cover image), hoặc Tiêu đề + Badge.
- **Body**: Tiêu đề chính, đoạn văn mô tả ngắn (thường truncate 2-3 dòng).
- **Footer**: Nút hành động (CTA), thông tin Metadata (Thời gian, tác giả).
- Khoảng cách (Padding) trong Card phải đồng nhất (ví dụ: `p-5` hoặc `p-6` cho mọi phía).

## 2. Borders & Shadows (Viền & Đổ bóng)
Có hai trường phái chính, không nên trộn lẫn lộn xộn trong cùng 1 project:
- **Trường phái Flat (SaaS/Modern)**: Không bóng, viền mỏng. 
  - *Tailwind: `bg-white border border-slate-200 rounded-xl`*
- **Trường phái Elevated (App/Ecom)**: Không viền, đổ bóng đa lớp.
  - *Tailwind: `bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl`*

## 3. Trạng thái tương tác (Interactive Cards)
Nếu toàn bộ Card có thể click (Vd: Link tới bài viết, Sản phẩm):
- Khi hover: Bóng đổ lớn hơn một chút (`hover:shadow-md`), viền đổi màu (`hover:border-blue-500`), hoặc nhích nhẹ card lên trên (`hover:-translate-y-1 transition-transform`).
- Con trỏ phải là bàn tay (`cursor-pointer`).