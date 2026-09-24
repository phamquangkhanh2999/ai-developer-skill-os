# Color Intelligence (Hệ thống màu sắc & Tương phản)

## 1. Quy tắc 60-30-10
Áp dụng cho mọi giao diện để tạo cân bằng thị giác:
- **60% (Màu nền - Background)**: Thường là trắng, xám nhạt (Light mode) hoặc đen, xám đậm (Dark mode). Tailwind: `bg-white` / `bg-slate-900`.
- **30% (Màu phụ - Secondary/Surface)**: Các thành phần phân cách như Card background, Sidebar, Border. Tailwind: `bg-slate-50` / `border-slate-200`.
- **10% (Màu nhấn - Primary/Accent)**: CTA Buttons, link, icon đang active. Tạo sự thu hút chú ý ngay lập tức.

## 2. Semantic Colors (Màu ngữ nghĩa)
Không bao giờ dùng màu đỏ cho nút OK, không dùng xanh lá cho Cảnh báo.
- **Primary**: Brand color (Vd: Blue-600).
- **Success**: Green (Tailwind: `emerald-500`).
- **Warning**: Yellow/Orange (Tailwind: `amber-500`).
- **Danger/Destructive**: Red (Tailwind: `rose-500` hoặc `red-500`).
- **Info**: Blue (Tailwind: `blue-500`).

## 3. Quản lý Dark Mode (SaaS Trend)
Thay vì dùng màu đen tuyền `#000000`, hãy dùng các tone xám ám màu nhẹ (Tinted Grays) để bớt chói mắt:
- **Slate** (Ám xanh dương) - Phù hợp Tech/SaaS.
- **Zinc** (Xám trung tính) - Phù hợp Minimal/Editorial.
- Text trong Dark Mode không bao giờ dùng trắng tinh (`#ffffff`), nên dùng xám rất nhạt (Tailwind: `text-slate-200`).

## 4. Accessibility (Độ tương phản A11y)
Luôn đảm bảo độ tương phản giữa Text và Background đạt tối thiểu **4.5:1** (WCAG AA). Text nhỏ cần tương phản cao hơn text lớn.