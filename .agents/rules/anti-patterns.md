---
name: anti-patterns
version: 1.1.0
trigger: model_decision
description: "Quy tắc cốt lõi (R-C-09) về các Anti-patterns và AI Slop cần tuyệt đối tránh trong quá trình Code và Design."
domain: rules
applies_to: [code-quality, ui-design]
---

# R-C-09: Khung kiểm soát Anti-patterns và AI Slop

Dùng các dấu hiệu dưới đây để đánh giá phần code liên quan theo tác động thực tế. Tuân theo design system, accessibility và kiến trúc hiện có. Không coi sở thích thẩm mỹ hoặc ngưỡng số học là lỗi bảo mật hay lý do tự mở rộng phạm vi.

## 1. UI & Design Slop (Tuyệt đối cấm)

AI thường có xu hướng sinh ra giao diện "chung chung", "xám xịt". Đây gọi là AI Slop.

- **Phân cấp thị giác:** Đánh giá card/nhóm nội dung theo design system và khả năng phân biệt nội dung; border hoặc shadow không phải yêu cầu bắt buộc cho mọi thiết kế.
- **Trạng thái tĩnh chết (Dead interaction):** Các element tương tác (Button, Link, Card) KHÔNG CÓ `:hover`, `:focus`, `:active` states.
- **Văn bản mù (Micro-typography):** Font size cho body text nhỏ hơn `14px` hoặc chữ xám nhạt trên nền trắng (Contrast ratio < 4.5:1).
- **Design tokens:** Tái sử dụng token có sẵn cho màu/khoảng cách lặp lại. Giá trị px/hex cục bộ có chủ đích không tự động là lỗi; không tạo token hoặc refactor diện rộng chỉ để thay literal.
- **Khoảng trắng hỗn loạn:** Margin/Padding không tuân theo spacing scale (4px/8px base).

## 2. Code Architecture Anti-patterns

- **God Files / God Objects:** Một file đảm nhiệm quá nhiều vai trò (vd: Component UI chứa cả lời gọi API, quản lý State phức tạp và tính toán Logic).
  - *Xem xét:* Tách trách nhiệm khi có lợi ích cụ thể và nằm trong phạm vi; không tách mọi component chỉ để đạt số dòng.
- **Circular Dependencies (Phụ thuộc chéo):** File A import File B, và File B lại import ngược lại File A. 
  - *Dấu hiệu:* Lỗi "Cannot read property of undefined" lúc runtime do module resolution thất bại.
- **State coupling:** Xem xét dependency và độ khó bảo trì; số tầng props không tự buộc thêm Context/Zustand hoặc một dependency mới.

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

**Nguyên tắc thực thi:** Gán severity theo tác động, điều kiện xảy ra và bằng chứng. Lỗi gây mất dữ liệu/bảo mật có thể HIGH/CRITICAL; vấn đề style là góp ý hoặc mức thấp khi có tác động rõ. Chỉ sửa trong phạm vi được giao; không tự chặn toàn bộ nhiệm vụ hoặc buộc refactor phần không liên quan.
