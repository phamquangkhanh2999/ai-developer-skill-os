# Buttons (Nút bấm) Intelligence

Nút bấm là thành phần tương tác quan trọng nhất. Phải luôn tuân thủ phân cấp và trạng thái.

## 1. Phân cấp thị giác (Hierarchy)
- **Primary Button**: Nổi bật nhất (Background màu nhấn, Text trắng). Chỉ có 1 nút Primary trên một khu vực/màn hình.
  - *Tailwind: `bg-blue-600 text-white hover:bg-blue-700`*
- **Secondary / Default Button**: Nền nhạt hoặc xám, chữ đen/xám. Dành cho các hành động phụ (Hủy, Quay lại).
  - *Tailwind: `bg-slate-100 text-slate-900 hover:bg-slate-200`*
- **Outline Button**: Viền màu, nền trong suốt. Thường dùng thay thế Secondary.
  - *Tailwind: `border border-slate-300 text-slate-700 hover:bg-slate-50`*
- **Ghost / Text Button**: Không nền, không viền, chỉ hiện nền khi hover. Dùng cho hành động ít quan trọng.
  - *Tailwind: `text-slate-600 hover:bg-slate-100 hover:text-slate-900`*

## 2. Trạng thái (States) - BẮT BUỘC
- **Hover**: Thay đổi sắc thái màu (đậm hơn hoặc nhạt hơn), thay đổi shadow.
- **Focus / Focus-visible**: Vô cùng quan trọng cho Accessibility (Bàn phím). Phải có Focus Ring mờ.
  - *Tailwind: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`*
- **Disabled**: Nền xám mờ, mờ chữ (`opacity-50`), con trỏ không cho phép (`cursor-not-allowed`).
- **Loading**: Bắt buộc khóa nút (`disabled`) và thay icon bằng Spinner xoay tròn.

## 3. Kích thước chuẩn
- **Size sm**: Chiều cao 32px (`h-8 px-3 text-sm`).
- **Size md (Base)**: Chiều cao 40px (`h-10 px-4 text-sm font-medium`).
- **Size lg**: Chiều cao 48px (`h-12 px-6 text-base`).