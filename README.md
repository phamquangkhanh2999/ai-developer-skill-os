# 🚀 AI Developer Skill OS (ai-developer-skill-os)

> Một hệ điều hành (AI-OS) và Nền tảng Kiến trúc Kỹ thuật (Engineering Platform) tối thượng dành cho AI Coding Agents (Cursor, Windsurf, Cline, v.v.).

Thay vì cung cấp các "công cụ rời rạc" (Toolbox), dự án này xây dựng một hệ thống **22 Siêu Kỹ Năng (Master Skills)**, biến Agent của bạn thành một **Senior Engineer / Chief Architect** thực thụ với khả năng tự học, tự kiểm toán và tự viết tài liệu.

---

## 🏗️ Kiến Trúc Khối (The 7-Layer Architecture)

Hệ thống được thiết kế hoàn hảo với 7 phân lớp, hoạt động khép kín theo chuỗi End-to-End:

### 0. Foundation Layer (Nền Tảng Cốt Lõi)
- `qk-orchestrator`: Bộ điều hướng yêu cầu người dùng, chọn Workflow.
- `qk-context-loader`: Bộ nạp ngữ cảnh, tìm file liên quan, chống tràn token.
- `qk-policy-engine`: Động cơ kiểm tra tính hợp lệ của Request trước khi chạy.
- `qk-access-policy`: Ranh giới bảo mật, phân quyền và RBAC.
- `qk-project-memory`: Bộ nhớ cấu trúc dự án (Architecture, UI Patterns, Conventions).
- `qk-engineering-standard`: Bộ luật thiết kế (Frontend, Backend, Security, Testing rules).
- `qk-project-bootstrap`: Trình khởi tạo dự án từ con số 0.

### 1. UI System Layer (Hệ Thống Giao Diện)
- `qk-ui-system-builder`: Quản lý Design System, Component Library.
- `qk-design-to-code`: Chuyển đổi Figma/Screenshot sang mã nguồn.
- `qk-ui-audit`: Kiểm toán tính nhất quán, Responsive, Accessibility.

### 2. Development Layer (Phát Triển E2E)
- `qk-feature-delivery`: Phân tích, code, test hoàn thiện một tính năng từ A-Z.
- `qk-api-lifecycle`: Vòng đời API (Spec, Service, Type, Test, Docs).
- `qk-data-lifecycle`: Vòng đời dữ liệu (Schema, Migration, Query Tuning).

### 3. Quality Assurance Layer (Đảm Bảo Chất Lượng)
- `qk-project-health`: Audit tình trạng dự án, Tech Debt, Code Smell.
- `qk-bug-resolution`: Tái hiện lỗi, tìm Root Cause, Fix và chống Regression.
- `qk-validation-gate`: Cổng chặn an toàn (Lint, Test, Security) trước khi hoàn tất.

### 4. Evolution Layer (Tiến Hóa Hệ Thống)
- `qk-system-evolution`: Nâng cấp phiên bản, Impact Analysis, Dry-run.

### 5. Operation Layer (Vận Hành)
- `qk-production-release`: CI/CD, Build, Deploy, Observability.

### 6. AI Builder Layer
- `qk-ai-builder`: Thiết kế các hệ thống AI App, Agent, RAG.

### 7. Knowledge Layer (Tri Thức & Tài Liệu)
- `qk-docs`: Viết tài liệu cho con người (README, Changelog, Developer Guide).
- `qk-documentation-system`: Máy học nội bộ (Chuyển đổi Pattern thành luật nạp vào Memory).
- `qk-help`: Trợ lý tra cứu hướng dẫn kỹ năng.

---

## 🔄 Luồng Vận Hành Khép Kín (Workflow)

Khi bạn ra lệnh: `"Thêm tính năng đăng nhập"`:
```text
User Request 
   ↓
qk-orchestrator (Phân tích, chọn qk-feature-delivery)
   ↓
qk-context-loader (Load code liên quan Auth)
   ↓
qk-policy-engine & qk-access-policy (Check quyền)
   ↓
qk-engineering-standard (Rút luật Backend/Security)
   ↓
[THỰC THI BỞI qk-feature-delivery]
   ↓
qk-validation-gate (Test, Lint)
   ↓
qk-docs (Cập nhật API doc, Changelog)
   ↓
qk-documentation-system (Lưu các Pattern mới vào Memory)
```

---

## 💡 Ví Dụ Thực Tế (Common Examples)

Dưới đây là một số ví dụ sử dụng các kỹ năng phổ biến và mạnh mẽ nhất trong quá trình code hàng ngày của bạn:

### 1. `qk-orchestrator` (Trợ lý điều phối trung tâm)
Nếu bạn không biết nên dùng skill nào, hãy gọi Orchestrator. Nó sẽ tự động phân tích và kích hoạt đúng các skill bên dưới.
```bash
./qk-orchestrator "Tôi muốn tạo một trang Dashboard hiển thị doanh thu bằng React"
```

### 2. `qk-feature-delivery` (Phát triển tính năng E2E)
Dùng khi bạn muốn xây dựng trọn vẹn một tính năng từ DB, API đến UI và Test.
```bash
./qk-feature-delivery "Tạo luồng thanh toán giỏ hàng (Cart Checkout), lưu vào bảng orders và gọi API thanh toán Stripe"
```

### 3. `qk-bug-resolution` (Chẩn đoán và diệt Bug triệt để)
Tuyệt đối không dùng prompt thường để sửa lỗi. Dùng kỹ năng này để ép AI tìm Root Cause và viết Regression Test.
```bash
./qk-bug-resolution "API /users/profile đang trả về 500 khi user chưa có avatar, stack trace như sau..."
```

### 4. `qk-ui-system-builder` (Chuẩn hóa giao diện)
Dùng khi thiết kế các component dùng chung (Button, Card, Form) để đảm bảo không bị rác CSS.
```bash
./qk-ui-system-builder "Tạo một Data Table Component có hỗ trợ phân trang và filter, sử dụng Design Token hiện tại"
```

### 5. `qk-api-lifecycle` (Thiết kế và Code API)
Dành cho Backend Engineer, đi từ spec đến code, type và test.
```bash
./qk-api-lifecycle "Thiết kế API cập nhật mật khẩu, yêu cầu validate JWT token và mã hóa bcrypt"
```

---

## 💻 Cách Cài Đặt (Installation)

Sử dụng npm:
```bash
npm i -g ai-developer-skill-os
```
Hoặc sử dụng qua `npx`:
```bash
npx ai-developer-skill-os init
```

## 🚀 Tra Cứu (Help)

Để tra cứu danh sách toàn bộ 22 Kỹ năng và các mẹo sử dụng, hãy gọi:
```bash
./qk-help "Hiển thị tất cả các skill liên quan đến Frontend"
```
