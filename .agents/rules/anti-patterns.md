---
name: anti-patterns
description: "Quy tắc cốt lõi (R-C-09) về các Anti-patterns và AI Slop cần tuyệt đối tránh trong quá trình Code và Design."
severity: critical
enforcement: strict
---

# R-C-09: Khung kiểm soát Anti-patterns và AI Slop

Tài liệu này định nghĩa các mẫu code tồi (Anti-patterns) và thiết kế lười biếng của AI (AI Slop). Mọi skills trong hệ thống (đặc biệt là `qk-code-review`, `qk-project-health`, và `qk-ui-audit`) ĐỀU PHẢI dùng bộ quy tắc này làm thước đo. Vi phạm bất kỳ điều nào dưới đây sẽ dẫn đến FAILED ngay lập tức.

## 1. UI & Design Slop (Tuyệt đối cấm)

AI thường có xu hướng sinh ra giao diện "chung chung", "xám xịt". Đây gọi là AI Slop.

- **Vô hình hóa viền & đổ bóng (Washed-out depth):** Thiết kế thẻ Card mà không có box-shadow rõ ràng hoặc border quá nhạt (`opacity < 0.2`) hòa lẫn vào background.
- **Trạng thái tĩnh chết (Dead interaction):** Các element tương tác (Button, Link, Card) KHÔNG CÓ `:hover`, `:focus`, `:active` states.
- **Văn bản mù (Micro-typography):** Font size cho body text nhỏ hơn `14px` hoặc chữ xám nhạt trên nền trắng (Contrast ratio < 4.5:1).
- **Hardcode Pixel & Màu (Hallucinated Tokens):** Sử dụng các mã hex cứng (vd: `#1a1a1a`) hoặc px cứng thay vì dùng biến CSS từ `DESIGN.md` (vd: `var(--color-primary)`).
- **Khoảng trắng hỗn loạn:** Margin/Padding không tuân theo spacing scale (4px/8px base).

## 2. Code Architecture Anti-patterns

- **God Files / God Objects:** Một file đảm nhiệm quá nhiều vai trò (vd: Component UI chứa cả lời gọi API, quản lý State phức tạp và tính toán Logic).
  - *Fix:* Phải tuân thủ kiến trúc phân tầng (UI -> Custom Hooks -> Services/API).
- **Circular Dependencies (Phụ thuộc chéo):** File A import File B, và File B lại import ngược lại File A. 
  - *Dấu hiệu:* Lỗi "Cannot read property of undefined" lúc runtime do module resolution thất bại.
- **Spaghetti State:** Truyền props (Prop-drilling) qua quá 3 tầng component thay vì dùng Context, Zustand, hoặc Composition pattern.

## 3. Code Quality & Type Safety

- **Lạm dụng "Any" (Any-Script):** Sử dụng `any` trong TypeScript. Nếu không biết type rõ ràng, phải dùng `unknown` và tiến hành Type Guard (kiểm tra type) trước khi dùng.
- **Magic Numbers & Strings:** Hardcode các con số hoặc chuỗi ký tự rải rác trong code thay vì đặt thành hằng số (Constants/Enums) ở đầu file hoặc file riêng.
- **Bắt lỗi im lặng (Silent Catch):** Block `catch (error) {}` trống trơn hoặc chỉ `console.log(error)` mà không throw tiếp, không hiển thị UI Toast báo lỗi cho user, hoặc không gửi log lên server.
- **Kế thừa lạm dụng (Deep Inheritance):** Viết Class kế thừa qua hơn 2 cấp độ. *Fix:* Ưu tiên Composition over Inheritance.

## 4. Quản lý Tài nguyên & Performance

- **Memory Leaks trong UI:** Đăng ký sự kiện (addEventListener, setInterval, WebSocket) trong vòng đời khởi tạo (e.g., `useEffect`) nhưng QUÊN dọn dẹp (cleanup function) khi component unmount.
- **N+1 Query Pattern:** Gọi API hoặc chọc DB trong 1 vòng lặp for/map thay vì dùng batch request hoặc SQL JOIN.
- **Quá tải Bundle:** Import toàn bộ một thư viện khổng lồ (vd: `import _ from 'lodash'`) thay vì import đích danh hàm cần dùng (`import { debounce } from 'lodash'`).

---

**Nguyên tắc thực thi:** Bất cứ khi nào Agent tự viết code hoặc review code, nếu phát hiện các dấu hiệu trên, phải đánh dấu là lỗi **HIGH/CRITICAL** và yêu cầu refactor ngay lập tức trước khi cho phép merge hoặc pass validation gate.
