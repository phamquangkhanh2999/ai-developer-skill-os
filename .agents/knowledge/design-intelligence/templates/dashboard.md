# Dashboard Template Intelligence

## 1. Cấu trúc Layout phổ biến
- **Sidebar Navigation**: Menu bên trái, nội dung bên phải. Sidebar thường rộng 240px-280px.
- **Top Navigation**: Menu nằm ngang phía trên. Phù hợp cho app ít tính năng.
- **Hybrid**: Sidebar cho các module chính, Topbar cho Search, Notifications, và Profile.

## 2. Kích thước & Lưới
- Dùng CSS Grid cho các thẻ thống kê (Stats Cards): `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`.
- Khu vực hiển thị (Main Content): Cần có padding cố định (Vd: `p-6` hoặc `p-8`), nền xám rất nhạt (`bg-slate-50`) để tách biệt với nền trắng của các Card.

## 3. Phân cấp thông tin
- Dòng trên cùng: Các con số KPI quan trọng nhất (Doanh thu, Người dùng).
- Dòng thứ 2: Biểu đồ xu hướng (Charts).
- Phía dưới: Bảng dữ liệu chi tiết (Data Table) hoặc Hoạt động gần đây (Recent Activity).