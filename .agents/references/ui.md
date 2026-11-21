# UI Engineering & Design Tokens Reference

> **Tài liệu tham khảo chuyên môn (On-demand Reference)**
> Dùng khi xây dựng giao diện người dùng, component library, CSS layout, hoặc sửa lỗi giao diện/spacing.

---

## 1. Phác Thảo Khung Giao Diện & Luồng Tương Tác Trực Quan

- **Vẽ trước, giải thích sau:** Khi người dùng yêu cầu phác thảo UI, thiết kế màn hình hoặc hỏi cách thao tác trên giao diện/CMS, **chủ động dựng khung giao diện trực quan** (dùng `generative_ui` HTML widget hoặc xuất artifact HTML/SVG tương tác có đầy đủ styling, input, button, table badge; **tuyệt đối không dùng bảng vẽ ký tự ASCII thô sơ**) kèm sơ đồ luồng (`mermaid`) thay vì chỉ trả lời bằng text thuần.
- **Đủ thành phần nghiệp vụ trên khung:** Thể hiện rõ vị trí trường nhập, nút bấm chính/phụ, trạng thái rỗng/loading/lỗi và luồng chuyển màn hình để người dùng đối chiếu ngay.
- **Chuẩn hóa Container khi nhúng SVG/Diagram:**
  - Để tránh biểu đồ SVG bị co dúm font chữ trên màn hình nhỏ hoặc bị cắt cụt mất thanh cuộn, luôn bọc SVG trong container `width: 100%; overflow-x: auto;`.
  - Thiết lập SVG với `min-width` bằng đúng chiều rộng của `viewBox` (ví dụ: `min-width: 960px; display: block;`). Khi in hoặc xuất tài liệu (`@media print`), đặt lại `overflow-x: visible; min-width: 0;`.
  - Tách bạch typography: Tên khối/nút dùng font Sans-serif (Geist/Inter, weight 600), thông số kỹ thuật/route/schema dùng font Mono. Khi cần vẽ biểu đồ xuất bản chất lượng cao, nạp `diagram-spec.md`.

---

## 2. Nguyên Tắc Cốt Lõi & Chống Over-Engineering

- **Co-location over Micro-splitting:** Giữ các phần tử liên kết chặt chẽ trong cùng một file component (ví dụ: `CardHeader`, `CardBadge` trong `Card.tsx`). Không xé nhỏ component 70 dòng thành 5 file con riêng rẽ nếu chúng chỉ dùng nội bộ.
- **Tận dụng CSS thuần trước thư viện:** Ưu tiên CSS transitions (`transition: all 150ms ease-in-out`) cho các hiệu ứng hover/focus cơ bản thay vì cài đặt các package animation cồng kềnh (Framer Motion, GSAP) khi chưa được yêu cầu.
- **Kỷ luật Laser Focus:** Chỉ sửa style và markup của component được giao; không tự ý đổi theme màu toàn cục hoặc reformat các layout không liên quan.

---

## 3. Design system và trạng thái theo loại control

- **Design tokens theo dự án:** Tái sử dụng token/theme có sẵn cho giá trị dùng chung. Giá trị cục bộ có chủ đích được giữ khi phù hợp thiết kế; không tạo token hoặc refactor ngoài phạm vi chỉ để loại bỏ px/hex.
- **Trạng thái liên quan:** Chọn theo loại control và luồng đang làm; nội dung tĩnh không cần trạng thái tương tác, loading chỉ khi có thao tác bất đồng bộ:
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

## 4. Xử Lý Sự Cố Giao Diện (Layout Bug Resolution)

- **Sửa nguyên nhân tràn:** Truy phần tử gây tràn trước. Không dùng overflow để giấu nội dung cần truy cập; scroll-lock của modal hoặc clipping có chủ đích được đánh giá theo thiết kế thực tế.
- **Truy tìm và sửa tận gốc:**
  - Tìm phần tử có `width: 100vw`, fixed `width: 600px`, hoặc chuỗi text dài thiếu `break-words`.
  - Khắc phục bằng `max-w-full`, `min-w-0`, `flex-wrap`, hoặc `grid-cols-1 md:grid-cols-2`.

---

## 5. Kiểm Chứng Giao Diện Thực Tế Trên Antigravity

- Khi dự án có dev server hoặc trang web đang chạy và runtime cung cấp `browser` subagent, ưu tiên ủy quyền kiểm chứng trạng thái hiển thị/tương tác thật thay vì chỉ đoán qua CSS tĩnh.
- Khi cần đối chiếu ảnh thiết kế/mockup, sao chép file tham chiếu vào `browser_sandbox/references/` trong thư mục artifact của phiên và đối chiếu thông điệp `BROWSER_HOST_FACTS` trước khi ghi nhận bằng chứng UI. Nếu không mở trình duyệt thật, giữ lớp kiểm chứng UI runtime ở trạng thái `NOT_RUN`.
