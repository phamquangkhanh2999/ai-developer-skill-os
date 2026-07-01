# Chi Tiết 23 Skills — AI Developer Skill OS

**Tác giả:** Quang Khánh  
**Phiên bản:** v1.0.1

Tài liệu này giải thích chi tiết chức năng của từng Skill trong bộ Skill OS.
AI sẽ đọc mô tả (description) bằng tiếng Anh để nhận diện, nhưng bạn có thể đọc tài liệu tiếng Việt này để hiểu AI có thể làm được gì.

---

## 🛠️ Nhóm 1: Engineering Core (Kỹ thuật Cốt lõi)

Đây là các kỹ năng chung quản lý toàn bộ dự án, kiến trúc và mã nguồn.

### 1. `agent-orchestrator` (Người Điều Phối)
- **Mô tả:** AI không tự viết code mà đóng vai trò như một Project Manager. Phân tích yêu cầu phức tạp của bạn, chia nhỏ thành các tác vụ (Task) và quyết định gọi các Skill nào theo thứ tự nào.
- **Khi nào dùng:** Khi bạn giao một việc lớn ("Làm cho tôi tính năng thanh toán") mà không biết bắt đầu từ đâu.

### 2. `context-manager` (Quản Lý Ngữ Cảnh)
- **Mô tả:** Xác định file nào cần đọc, đọc cấu trúc thư mục, ghi nhớ kiến trúc hệ thống để AI không bị "quên" hoặc đọc tràn ngập các file không cần thiết.
- **Khi nào dùng:** Khi bắt đầu một dự án mới tinh, hoặc khi AI cần nắm bắt bức tranh tổng thể.

### 3. `project-audit` (Kiểm Toán Dự Án)
- **Mô tả:** Quét toàn bộ mã nguồn hoặc các file bạn vừa thay đổi để tìm kiếm bug tiềm ẩn, code smell, lỗ hổng bảo mật hoặc nợ kỹ thuật. AI sẽ xuất ra một báo cáo khám bệnh chi tiết.
- **Khi nào dùng:** Trước khi refactor lớn, trước khi release, hoặc muốn kiểm tra code mình viết có sạch không.

### 4. `bug-fix` (Chuyên Gia Sửa Lỗi)
- **Mô tả:** Dò tìm nguyên nhân gốc rễ (root cause) của một lỗi dựa trên stack trace hoặc mô tả của bạn. Không chữa cháy tạm thời, cung cấp bản fix tối thiểu và an toàn nhất.
- **Khi nào dùng:** Khi app bị crash, test fail, màn hình trắng.

### 5. `refactor` (Tái Cấu Trúc Code)
- **Mô tả:** Làm sạch code, tách hàm, tách component, xóa code thừa, dọn dẹp biến mà **không làm thay đổi logic hoạt động**.
- **Khi nào dùng:** Khi code quá rối rắm (spaghetti code), cần dọn dẹp cho dễ bảo trì.

### 6. `api-integration` (Kỹ Sư Tích Hợp API)
- **Mô tả:** Nhận bất kỳ input nào (curl, swagger, postman, backend controller) và sinh ra một lớp gọi API hoàn chỉnh cho Frontend (Type chuẩn, xử lý lỗi, call Axios/Fetch/React Query).
- **Khi nào dùng:** Khi Backend vừa làm xong API và bạn cần nối nó vào Frontend.

### 7. `migration` (Nâng Cấp Hệ Thống)
- **Mô tả:** Nâng cấp an toàn các thư viện cũ (như React 17 lên 19), chuyển đổi thư viện (Moment sang Date-fns) theo mô hình tăng dần, có kế hoạch Rollback.
- **Khi nào dùng:** Khi cần update package có lỗ hổng bảo mật hoặc chuyển framework.

### 8. `git-engineer` (Quản Lý Git & Release)
- **Mô tả:** Viết commit message cực chuẩn theo Conventional Commits, viết mô tả Pull Request, sinh Changelog và Release Notes cho sếp/khách hàng đọc.
- **Khi nào dùng:** Khi code xong và cần đẩy code lên hoặc chuẩn bị release version mới.

---

## 🎨 Nhóm 2: Frontend (Giao Diện)

Nhóm chuyên biệt cho việc xây dựng giao diện người dùng (UI/UX).

### 9. `frontend-architecture` (Kiến Trúc Frontend)
- **Mô tả:** Đọc hiểu và ép AI phải tuân thủ việc đặt file ở đâu cho đúng chuẩn của project (Features-based, Layer-based, DDD...).
- **Khi nào dùng:** Khi không biết nên tạo file component mới ở thư mục nào.

### 10. `design-system` (Hệ Thống Thiết Kế)
- **Mô tả:** Ép AI phải dùng thư viện UI có sẵn (MUI, Shadcn, Tailwind...) thay vì tự viết HTML chay hay CSS inline lộn xộn.
- **Khi nào dùng:** Đi kèm khi xây dựng UI để giữ tính nhất quán.

### 11. `ui-builder` (Xây Dựng Giao Diện)
- **Mô tả:** Lắp ráp các component nhỏ thành một màn hình/trang hoàn chỉnh, xử lý layout (Grid/Flexbox) và responsive (di động/máy tính).
- **Khi nào dùng:** Khi bạn đưa wireframe/mockup và bảo "Làm cho tôi màn hình Dashboard".

### 12. `component-generator` (Tạo Component Đơn Lẻ)
- **Mô tả:** Sinh ra các mảnh ghép UI nhỏ, tái sử dụng được (như Button, Card, Dropdown) với Props Type an toàn.
- **Khi nào dùng:** Khi cần tạo một UI Component dùng chung.

### 13. `state-management` (Quản Lý Trạng Thái)
- **Mô tả:** Phân tích dữ liệu và quyết định nên dùng React Query, Redux, Zustand hay chỉ là useState local. Setup các store hoàn chỉnh.
- **Khi nào dùng:** Khi phải truyền Props quá sâu, hoặc cần lưu cache dữ liệu.

### 14. `form-builder` (Chuyên Gia Làm Form)
- **Mô tả:** Sinh ra các Form phức tạp với validate đầu vào (Zod, Yup) kết hợp React Hook Form. Hiển thị báo lỗi chuẩn mực.
- **Khi nào dùng:** Làm màn hình Đăng ký, Đăng nhập, Tạo mới dữ liệu.

### 15. `table-crud-generator` (Làm Bảng Dữ Liệu)
- **Mô tả:** Sinh ra bảng Data Grid hoàn chỉnh có phân trang (pagination), lọc, sắp xếp và các nút hành động (Thêm/Sửa/Xóa).
- **Khi nào dùng:** Làm trang Admin quản trị.

### 16. `frontend-debug` (Sửa Lỗi Frontend)
- **Mô tả:** Chuyên trị các lỗi khó chịu của UI như: Hydration Error (Next.js), Infinite Re-render (lặp vô tận), lỗi vỡ CSS layout.
- **Khi nào dùng:** Lỗi vỡ giao diện hoặc lỗi render của React.

### 17. `frontend-testing` (Kiểm Thử UI)
- **Mô tả:** Viết Unit Test, Component Test (React Testing Library) hay E2E Test (Cypress/Playwright) giả lập hành vi người dùng thật.
- **Khi nào dùng:** Khi sếp yêu cầu tăng Test Coverage hoặc bọc test cho tính năng quan trọng.

### 18. `accessibility-audit` (Kiểm Tra Tiếp Cận)
- **Mô tả:** Đảm bảo trang web chuẩn WCAG, dùng đúng thẻ Semantic HTML, có thể dùng phím Tab để điều hướng và hỗ trợ phần mềm đọc màn hình cho người khiếm thị.
- **Khi nào dùng:** Làm các project chuẩn quốc tế, nhà nước, hoặc tối ưu SEO nâng cao.

### 19. `frontend-performance` (Tối Ưu Hiệu Năng)
- **Mô tả:** Chữa bệnh web chạy chậm. Tối ưu ảnh, chẻ nhỏ file JS (Code splitting, Lazy load), thêm `useMemo/useCallback` để tránh giật lag.
- **Khi nào dùng:** Điểm Google Lighthouse thấp, web bị khựng khi cuộn.

---

## ⚙️ Nhóm 3: Backend (Máy Chủ)

Nhóm chuyên biệt cho việc xây dựng và quản lý API, máy chủ.

### 20. `backend-architecture` (Kiến Trúc Backend)
- **Mô tả:** Phân chia rạch ròi đâu là Controller (xử lý HTTP), đâu là Service (Xử lý nghiệp vụ), đâu là Repository (Gọi Database) để code không bị thành một đống bùi nhùi.
- **Khi nào dùng:** Cấu trúc file cho backend mới hoặc thêm module mới.

### 21. `database-engineer` (Kỹ Sư Cơ Sở Dữ Liệu)
- **Mô tả:** Thiết kế schema, vẽ quan hệ bảng, sinh script Migration, tối ưu hóa câu lệnh truy vấn (SQL, Prisma, Drizzle, MongoDB).
- **Khi nào dùng:** Cần thêm bảng mới vào DB hoặc API truy vấn DB quá chậm.

### 22. `auth-security` (Bảo Mật & Phân Quyền)
- **Mô tả:** Triển khai đăng nhập JWT, OAuth, thiết lập phân quyền (Admin vs User), phòng chống hacker tấn công bằng các cấu hình bảo mật chuẩn OWASP.
- **Khi nào dùng:** Làm tính năng đăng nhập, bảo vệ API nhạy cảm.

### 23. `deployment` (Triển Khai DevOps)
- **Mô tả:** Viết Dockerfile, cấu hình CI/CD bằng GitHub Actions, thiết lập luồng tự động build và deploy lên Vercel, AWS hoặc VPS.
- **Khi nào dùng:** Lúc cần đưa code lên môi trường production cho khách hàng xem.
