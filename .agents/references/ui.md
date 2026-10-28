# UI Engineering & Design Tokens Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi xây dựng giao diện người dùng, component library, CSS layout, hoặc sửa lỗi giao diện/spacing.

---

## 1. Nguyên Tắc Cốt Lõi & Chống Over-Engineering

- **Co-location over Micro-splitting:** Giữ các phần tử liên kết chặt chẽ trong cùng một file component (ví dụ: `CardHeader`, `CardBadge` trong `Card.tsx`). Không xé nhỏ component 70 dòng thành 5 file con riêng rẽ nếu chúng chỉ dùng nội bộ.
- **Tận dụng CSS thuần trước thư viện:** Ưu tiên CSS transitions (`transition: all 150ms ease-in-out`) cho các hiệu ứng hover/focus cơ bản thay vì cài đặt các package animation cồng kềnh (Framer Motion, GSAP) khi chưa được yêu cầu.
- **Kỷ luật Laser Focus:** Chỉ sửa style và markup của component được giao; không tự ý đổi theme màu toàn cục hoặc reformat các layout không liên quan.

---

## 2. Kỷ Luật Design Tokens & Anti-Slop (57 Tiêu Chí Thị Giác)

- **100% Design Tokens:** Tuyệt đối không dùng magic numbers (`#2371e2` trần trụi hoặc `margin: 19px`). Toàn bộ màu sắc, khoảng cách (spacing), font-size và border-radius phải ánh xạ từ hệ thống token/theme (Tailwind, CSS Variables, Theme provider).
- **Đầy Đủ 6 Interaction States:**
  1. `Default`: Trạng thái bình thường.
  2. `Hover`: Phản hồi con trỏ chuột rõ ràng.
  3. `Focus-visible`: Vòng ring bàn phím sáng rõ phục vụ điều hướng phím (a11y).
  4. `Active`: Trạng thái khi đang nhấn chuột/chạm.
  5. `Disabled`: Giảm opacity, đổi con trỏ `cursor-not-allowed`, chặn click.
  6. `Loading`: Skeleton loader hoặc spinner, không để layout giật nhảy.
- **Mobile-First & Touch Target:**
  - Tuyệt đối không để giao diện bị tràn ngang (horizontal overflow) trên màn hình hẹp (< 375px).
  - Vùng chạm (touch target) trên thiết bị di động tối thiểu 44x44px.
- **Accessibility (a11y) & Semantic HTML:**
  - Dùng đúng thẻ semantic (`<button>`, `<nav>`, `<article>`, `<header>`) thay vì lạm dụng `<div>` gắn `onClick`.
  - Độ tương phản văn bản đạt chuẩn WCAG AA (tối thiểu 4.5:1 cho text thường).

---

## 3. Xử Lý Sự Cố Giao Diện (Layout Bug Resolution)

- **Cấm hack bẩn che lỗi:** Tuyệt đối KHÔNG dùng `overflow: hidden` trên toàn bộ trang `<body>` hoặc root wrapper để che giấu việc vỡ layout/tràn viền ngang.
- **Truy tìm và sửa tận gốc:**
  - Tìm phần tử có `width: 100vw`, fixed `width: 600px`, hoặc chuỗi text dài thiếu `break-words`.
  - Khắc phục bằng `max-w-full`, `min-w-0`, `flex-wrap`, hoặc `grid-cols-1 md:grid-cols-2`.
