# Từ Điển Chi Tiết 22 Siêu Kỹ Năng (Master Skills)

Dưới đây là danh sách chi tiết và giải thích cụ thể cho toàn bộ 22 Kỹ năng thuộc Kiến trúc AI Developer Skill OS. Các kỹ năng được phân chia khép kín theo 7 lớp kiến trúc tiêu chuẩn cấp doanh nghiệp (Enterprise Architecture).

---

## 🏗️ Lớp 0: Foundation Layer (Nền Tảng Cốt Lõi)
*Lớp này đóng vai trò như "Não bộ trung tâm", chuyên nhận lệnh, cấp quyền, cung cấp luật lệ và chuẩn bị môi trường trước khi bất kỳ dòng code nào được viết ra.*

### 1. `qk-orchestrator` (Trợ Lý Điều Phối)
- **Mô tả:** Nhận lệnh chung chung từ người dùng, tự động phân tích ý đồ và định hướng luồng công việc (chọn gọi các kỹ năng nào tiếp theo).
- **Khi nào dùng:** Khi bạn có một yêu cầu lớn và không biết bắt đầu từ đâu.

### 2. `qk-context-loader` (Nạp Ngữ Cảnh)
- **Mô tả:** Có khả năng đọc lướt dự án để gom chính xác các file liên quan đến task hiện tại (chống tràn bộ nhớ token của AI).
- **Khi nào dùng:** Khi code dự án quá lớn, cần khoanh vùng các file cần sửa.

### 3. `qk-access-policy` (Kiểm Soát Phân Quyền)
- **Mô tả:** Xử lý và cung cấp các quy tắc về bảo mật (Security), phân quyền (RBAC), Authentication (JWT/OAuth).
- **Khi nào dùng:** Khi tính năng liên quan đến việc bảo mật, ai được quyền truy cập vào đâu.

### 4. `qk-project-memory` (Trí Nhớ Dự Án)
- **Mô tả:** Lưu trữ DNA của dự án, các quyết định kiến trúc, UI pattern và các convention đã được thống nhất từ trước.
- **Khi nào dùng:** Khi muốn AI làm theo đúng style đã có sẵn trong dự án.

### 5. `qk-engineering-standard` (Bộ Luật Thiết Kế)
- **Mô tả:** Bơm các "luật thép" (về Frontend, Backend, Database) vào ngữ cảnh để bắt AI tuân thủ cấu trúc thư mục và naming.
- **Khi nào dùng:** Tự động gọi để ép AI viết code không bị rác.

### 6. `qk-project-bootstrap` (Khởi Tạo Dự Án)
- **Mô tả:** Setup toàn bộ khung sườn của một dự án mới tinh từ con số 0 (Cấu hình lint, format, folder structure).
- **Khi nào dùng:** Lúc bắt đầu dự án mới.

---

## 🎨 Lớp 1: UI System Layer (Hệ Thống Giao Diện)
*Nhóm chuyên biệt về vẽ giao diện và quản lý hệ thống thành phần (Components).*

### 7. `qk-ui-system-builder` (Kỹ Sư Hệ Thống UI)
- **Mô tả:** Quản lý Design Token, tạo ra các Component có thể tái sử dụng (Button, Table, Form) đảm bảo tính nhất quán toàn dự án.
- **Khi nào dùng:** Xây dựng thư viện giao diện, tránh viết CSS lộn xộn.

### 8. `qk-design-to-code` (Chuyển Đổi Thiết Kế)
- **Mô tả:** Đọc hiểu hình ảnh/Figma để tự động chuyển thành mã nguồn giao diện (React, Tailwind, v.v.).
- **Khi nào dùng:** Bóc tách UI từ bản thiết kế.

### 9. `qk-ui-audit` (Kiểm Toán Giao Diện)
- **Mô tả:** Kiểm tra độ nhất quán UI/UX, hỗ trợ Responsive trên điện thoại và tối ưu khả năng tiếp cận (Accessibility - a11y).
- **Khi nào dùng:** Kiểm tra lỗi UI sau khi hoàn thiện giao diện.

---

## 💻 Lớp 2: Development Layer (Phát Triển E2E)
*Khối thực thi mạnh mẽ nhất, đi từ A-Z một tính năng cụ thể.*

### 10. `qk-feature-delivery` (Chuyển Giao Tính Năng)
- **Mô tả:** Kỹ năng toàn năng, tự động phân tích thiết kế Database -> Viết API -> Xây UI -> Viết Unit Test cho một tính năng trọn vẹn.
- **Khi nào dùng:** Xây dựng tính năng hoàn chỉnh (Ví dụ: Chức năng Thanh Toán).

### 11. `qk-api-lifecycle` (Vòng Đời API)
- **Mô tả:** Chuyên biệt cho Backend: Viết spec, tạo Service, định nghĩa Type, viết Test và sinh tài liệu cho API.
- **Khi nào dùng:** Xây dựng các Endpoint API.

### 12. `qk-data-lifecycle` (Vòng Đời Dữ Liệu)
- **Mô tả:** Quản lý Schema, tạo file Migration, tối ưu câu lệnh truy vấn (SQL, Prisma, v.v.).
- **Khi nào dùng:** Thay đổi cấu trúc cơ sở dữ liệu.

### 13. `qk-db-optimizer` (Tối Ưu Database)
- **Mô tả:** Phân tích EXPLAIN plan, tìm N+1 queries, đề xuất index và tối ưu query performance.
- **Khi nào dùng:** Truy vấn chậm, performance DB issue.

### 14. `qk-fe-api-integration` (Tích Hợp API Frontend)
- **Mô tả:** Consume API Backend, quản lý State, bind vào UI — tuân thủ kiến trúc Base dự án.
- **Khi nào dùng:** Khi cần gọi API từ frontend, map DTO, xử lý Loading/Error states.

---

## 🛡️ Lớp 3: Quality Assurance Layer (Đảm Bảo Chất Lượng)
*Kiểm tra độ sạch của code và diệt bug.*

### 15. `qk-project-health` (Kiểm Toán Dự Án)
- **Mô tả:** Quét toàn bộ dự án để tìm Code Smell, Nợ kỹ thuật (Tech Debt), và các vi phạm kiến trúc.
- **Khi nào dùng:** Định kỳ kiểm tra chất lượng mã nguồn hoặc tối ưu hiệu năng.

### 16. `qk-bug-resolution` (Giải Quyết Bug Triệt Để)
- **Mô tả:** Tái hiện lỗi, đào sâu tìm Root Cause, cung cấp giải pháp an toàn và viết Regression Test để chống lỗi lặp lại.
- **Khi nào dùng:** Sửa các lỗi đứt gãy hoặc logic nghiêm trọng.

### 17. `qk-validation-gate` (Cổng Kiểm Định)
- **Mô tả:** Kỹ năng chặn cửa. Bắt buộc chạy Test, Linting và Scan Security. Chỉ khi "PASS" mới cho phép kết thúc task.
- **Khi nào dùng:** Nằm cuối quy trình code của bất kỳ tính năng nào.

---

## 🚀 Lớp 4 & 5: Evolution & Operation (Vận Hành & Tiến Hóa)
*Triển khai dự án lên Production và nâng cấp phiên bản lớn.*

### 18. `qk-system-evolution` (Tiến Hóa Hệ Thống)
- **Mô tả:** Nâng cấp dependency (VD: Next 14 lên 15), phân tích rủi ro ảnh hưởng và thực thi nâng cấp an toàn không downtime.
- **Khi nào dùng:** Update version framework/thư viện.

### 19. `qk-production-release` (Triển Khai Môi Trường)
- **Mô tả:** Viết Dockerfile, cấu hình CI/CD Pipelines (Github Actions), Deploy lên Cloud (AWS, Vercel).
- **Khi nào dùng:** Release sản phẩm cho người dùng cuối.

---

## 🤖 Lớp 6: AI Builder Layer (Tích hợp AI)

### 20. `qk-ai-builder` (Xây Dựng AI App)
- **Mô tả:** Chuyên thiết kế và code các ứng dụng AI như RAG (Retrieval-Augmented Generation), Agent logic và Prompt Engineering.
- **Khi nào dùng:** Tích hợp LLM vào trong phần mềm của bạn.

---

## 📚 Lớp 7: Knowledge Layer (Tri Thức & Tài Liệu)
*Hệ thống tự học và viết tài liệu vĩ đại của OS.*

### 21. `qk-docs` (Kỹ Sư Tài Liệu)
- **Mô tả:** Tự động sinh hoặc cập nhật tài liệu cho con người đọc: `README.md`, `CHANGELOG.md`, `API Docs`.
- **Khi nào dùng:** Nằm ở cuối quy trình sau khi hoàn thành tính năng.

### 22. `qk-help` (Tra Cứu Nhanh)
- **Mô tả:** Cuốn từ điển sống. Cung cấp thông tin và hướng dẫn chi tiết (Pro-tips) về cách sử dụng toàn bộ hệ thống.
- **Khi nào dùng:** Bất kỳ khi nào người dùng cần hỗ trợ sử dụng hệ điều hành.
