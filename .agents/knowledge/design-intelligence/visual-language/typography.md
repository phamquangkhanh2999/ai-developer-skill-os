# Typography Intelligence (Font Scale & Pairing)

## 1. Hệ thống tỉ lệ (Scale System)
Dựa trên nguyên lý phổ biến của thị trường (như Tailwind, Radix UI):
- **Base (16px / 1rem)**: Nội dung đoạn văn mặc định. (Tailwind: `text-base`)
- **Small (14px / 0.875rem)**: Chú thích, phụ đề nhỏ, label form. (Tailwind: `text-sm`)
- **Tiny (12px / 0.75rem)**: Badge, tag, footnote. (Tailwind: `text-xs`)
- **H3 / Subheading (20px / 1.25rem)**: Tiêu đề phụ, card title. (Tailwind: `text-xl`)
- **H2 / Section Title (24px / 1.5rem)**: Tiêu đề mục lớn. (Tailwind: `text-2xl`)
- **H1 / Hero Title (36px+ / 2.25rem+)**: Tiêu đề trang, landing page hero. (Tailwind: `text-4xl` hoặc `text-5xl`)

## 2. Line Height (Chiều cao dòng)
- Tiêu đề (H1, H2): Dùng `1.1` đến `1.2` (Tailwind: `leading-tight`) để tránh khoảng trống thừa.
- Đoạn văn (Paragraph): Dùng `1.5` đến `1.6` (Tailwind: `leading-relaxed`) để dễ đọc.

## 3. Font Pairing (Ghép cặp font chuẩn)
- **Modern SaaS**: Inter (Sans-serif) cho toàn bộ, hoặc Cal Sans cho tiêu đề + Inter cho nội dung.
- **Editorial / Blog**: Merriweather (Serif) cho tiêu đề + Roboto (Sans-serif) cho nội dung.
- **Developer / Tech**: Fira Code hoặc JetBrains Mono cho code/badge + System UI (San Francisco/Segoe UI) cho UI.

## 4. Trọng lượng chữ (Font Weight)
- Tránh dùng Semibold (600) tràn lan. Dùng Medium (500) cho button/label và Bold (700) cho tiêu đề.
- Body text luôn là Regular (400).