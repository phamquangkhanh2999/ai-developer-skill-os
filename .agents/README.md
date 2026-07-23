# 🚀 AI Developer Skill OS (ai-developer-skill-os) v8.1.4

> **v8.1.4 "Agent Engineering OS + Design Intelligence"**

Hệ sinh thái AI Developer Skill OS đã lột xác hoàn toàn. Từ một bộ "công cụ phân tán" (Toolbox) ở V7, phiên bản V8.1.4 được thiết kế như một **Hệ điều hành khép kín (Agent Engineering OS)**, sở hữu năng lực giám sát, bảo vệ ranh giới quyết định (Decision Boundaries) và được trang bị thêm tầng **Design Intelligence**.

---

## 🏗️ Triết Lý Hoạt Động Cốt Lõi (V8 Kernel)

### 1. Decision Boundary (Ranh giới Thẩm quyền)
Không còn tình trạng một Skill ôm đồm mọi việc. Mọi Skill (Kỹ năng) hiện tại bị quản lý bởi các trường `owns`, `does_not_own`, `conflicts_with`, `delegates_to`. Thợ code UI (`qk-ui-builder`) không được phép tự ra quyết định kiến trúc, và ngược lại.

### 2. Design Intelligence Layer
Khắc phục điểm yếu "mù thẩm mỹ" của AI. Agent giờ đây không chỉ biết code mà còn có Gu Thẩm Mỹ (Design Taste). Dựa trên yêu cầu của bạn, hệ thống tự động tra cứu **Knowledge Graph** để chọn đúng Theme (Fintech, Healthcare, SaaS...), Typography và Visual Patterns trước khi giao việc cho UI Builder.

### 3. Khế Ước Đi Đầu (Contract-First & Zero-Trust)
- **Frontend / UI**: Mọi sửa đổi phải tuân thủ Design System (được `qk-design-system-engineering` kiểm duyệt).
- **Backend / API**: Phải viết OpenAPI/Swagger contract trước (`qk-api-lifecycle`).
- **Data**: Cấm AI tự đoán cấu trúc DB, mọi truy vấn phải có Schema (`qk-data-lifecycle`).

---

## 🧩 Danh sách 30 Master Skills

Các kỹ năng được quản lý bằng **Capability Graph** và được đánh giá liên tục thông qua Evaluation Suite. Bao gồm 7 lĩnh vực:
1. **Core & Orchestration:** `qk-orchestrator`, `qk-context-loader`, `qk-project-memory`, `qk-help`
2. **Product & Architecture:** `qk-product-specification`, `qk-project-bootstrap`, `qk-frontend-architecture`
3. **Frontend & UI:** `qk-design-system-engineering`, `qk-ui-system-builder`, `qk-ui-builder`, `qk-fe-api-integration`, `qk-ui-audit`
4. **Backend & Data:** `qk-api-lifecycle`, `qk-data-lifecycle`, `qk-access-policy`
5. **Engineering & Delivery:** `qk-feature-delivery`, `qk-bug-resolution`, `qk-engineering-standard`, `qk-system-evolution`, `qk-docs`
6. **Quality & Testing:** `qk-test-engineering`, `qk-validation-gate`, `qk-web-quality-gate`, `qk-project-health`
7. **Security, DevOps & Analytics:** `qk-security-audit`, `qk-db-optimizer`, `qk-devops-platform`, `qk-production-release`, `qk-agent-observability`, `qk-ai-builder`

---

## 💻 Cách Cài Đặt (Installation)

### Cách 1: NXP (Không cần cài global) - MỚI
```bash
npx ai-developer-skill-os init
```

### Cách 2: NPM Global (Khuyên dùng cho cá nhân)
```bash
npm i -g ai-developer-skill-os
```

### Chạy bằng tham số (Command Line Arguments)
```bash
# Cài Antigravity Global (toàn máy)
npx ai-developer-skill-os init --ide=antigravity --scope=2

# Cài Antigravity Local (chỉ dự án này)
npx ai-developer-skill-os init --ide=antigravity --scope=1

# Cài Cursor Local
npx ai-developer-skill-os init --ide=cursor --scope=1
```

## 📦 Các IDE/AI Assistant Được Hỗ Trợ
- (1) Cursor
- (2) Windsurf
- (3) Cline / Roo Code
- (4) Antigravity / Gemini
- (5) Codex
- (6) Kilo Code

---

## 🧪 Đánh Giá Tự Động (Agent Evaluation)

Hệ thống đi kèm một bộ Runner nội bộ để kiểm toán **Routing Intelligence**. Bất kỳ cập nhật nào vào hệ thống Kỹ năng đều phải vượt qua bài kiểm tra hóc búa (Bypass Security, Boundary Attacks, Ambiguous Prompts):

```bash
npm run test:agent
npm run test:graph
npm run test:registry
```

## 🚀 Hướng Dẫn Sử Dụng
Sau khi cài đặt thành công, hãy gõ lệnh:
```bash
./qk-help
```
để kích hoạt AI Orchestrator và khám phá sức mạnh của hệ điều hành!
