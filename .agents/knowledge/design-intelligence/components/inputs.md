# Inputs (Trường nhập liệu) Intelligence

## 1. Cấu trúc Input 
- Input phải có chiều cao tương ứng với Button (sm: 32px, md: 40px, lg: 48px).
- Nền trắng (`bg-white`), viền nhạt (`border-slate-300`), chữ đen nhạt (`text-slate-900`).
- Trạng thái Focus: Viền đổi sang màu Primary và có tỏa bóng nhẹ. (Tailwind: `focus:border-blue-500 focus:ring-1 focus:ring-blue-500`).

## 2. Placeholder
- Không dùng Placeholder để thay thế cho Label.
- Chữ Placeholder phải mờ (`text-slate-400`) để không bị nhầm là đã nhập liệu.

## 3. Cấu trúc phức tạp
- Input có Icon bên trái (Search) hoặc bên phải (Show Password). Icon phải cùng màu với Placeholder.
- Input Group (Có tiền tố, vd: "https://", hoặc hậu tố ".com") cần nền xám nhạt cho phần tiền tố.