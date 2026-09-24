# Accessibility (A11y) Intelligence

## 1. Focus Management
- KHÔNG BAO GIỜ loại bỏ `outline: none` mà không có trạng thái thay thế (như `box-shadow`).
- Tailwind: Luôn dùng `focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500` để Focus Ring chỉ hiện khi dùng phím Tab (bàn phím), không hiện khi dùng chuột click.

## 2. Screen Readers
- Những icon chỉ có tính trang trí (decorative) phải có `aria-hidden="true"`.
- Nút bấm chỉ chứa Icon phải có `aria-label="Tên hành động"` (Vd: aria-label="Đóng").

## 3. Tương phản (Contrast)
- Sử dụng công cụ đo tương phản để đảm bảo Text/Background đạt chuẩn WCAG AA (Tương phản >= 4.5:1).
- Chữ xám trên nền xám nhạt là kẻ thù của người cận thị. Luôn dùng ít nhất `text-slate-600` trên nền trắng.