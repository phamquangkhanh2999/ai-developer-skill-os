# 🚀 AI Developer Skill OS (ai-developer-skill-os) v9.1.1

> **v9.1.1 "EDAOS v9.1 — Governed Capability & Universal Project Knowledge V1 Architecture"**

Hệ sinh thái AI Developer Skill OS tiến hóa lên phiên bản **V9.1.1 (EDAOS v9.1.1)** với kiến trúc **Universal Project Knowledge V1 (Local Private & Self-Init Architecture)**, kết hợp cùng mô hình Manifest-First và Eval Pipeline, biến AI từ trợ lý bị động thành Sư phụ Lập trình (Elite AI Engineer) thấu hiểu sâu sắc codebase và tri thức dự án với chi phí tra cứu gần như bằng 0.

---

## 🧭 Kiến Trúc Trí Nhớ Dự Án (Universal Project Knowledge V1 - Local Private Mode)
- **Quản trị như Source Code:** Tri thức dự án đơn giản, minh bạch, có thể xem xét (review) và **luôn có con người phê duyệt** (AI Đề xuất -> Con người Phê duyệt via `/learn` hoặc `./qk-project-memory`).
- **Chính sách Local Private Duy Nhất & Tự động Khởi tạo (Self-Init Protocol):** 
  - *Bộ Nhớ Cá Nhân (`.ai-local/`):* Toàn bộ tri thức ghi nhớ của dự án được tập trung lưu tại thư mục `.ai-local/` (bao gồm `AGENTS.md` và `knowledge/index.yaml`). Đã loại bỏ hoàn toàn chế độ dùng chung (`.agents/knowledge/index.yaml` - Shared Mode) để đảm bảo quyền riêng tư và tránh xung đột khi làm việc nhóm.
  - *Tự động Khởi tạo & Bảo mật Gitignore:* Bất cứ khi nào AI kích hoạt kỹ năng hoặc cần tra cứu/học tri thức mà thư mục `.ai-local/` chưa tồn tại trong gốc dự án, AI **BẮT BUỘC** tự động tạo cấu trúc thư mục này và tự động thêm dòng `.ai-local/` vào file `.gitignore` của dự án ngay lập tức.
- **Tối Ưu Nhảy Sọt (Navigator):** File `.ai-local/AGENTS.md` giới hạn siêu gọn dưới 100 dòng làm bản đồ chỉ đường, kết hợp cùng `.ai-local/knowledge/index.yaml` (lưu trữ đúng 4 loại: *Architecture, Convention, Pattern, Hard Bug*), triệt tiêu 80% chi phí tìm kiếm mù lòa (zero redundant searches).

---

## 🏗️ 4 Trụ Cột Kiến Trúc Cốt Lõi (EDAOS v9.0 Architecture)

### 1. Manifest-First & O(1) Registry Engine
Không còn phụ thuộc vào việc đọc/scan toàn bộ markdown mệt mỏi. AI Agent tra cứu siêu dữ liệu từ `.agents/registry/index.yaml` và kiểm duyệt chu trình không lặp (acyclic validation) thông qua O(1) graph JSON (`.agents/registry/graph.json`). Tốc độ hiểu và phân công năng lực đạt ngưỡng sub-second!

### 2. V8.2 Blueprint Plugins & Universal 4-Folder Architecture
Khởi tạo dự án (chỉ đạo qua `qk-project-bootstrap`) hỗ trợ sinh file `project.yaml` gốc từ thư viện Blueprint Plugins:
- **RAG / AI Agents:** Cấu trúc 4 thư mục chuẩn thực chiến: `prompts/`, `data/` (bảo vệ `data/raw` bất biến), `agents/`, và `evals/`.
- **Standard Software Coding:** Kiến trúc module sạch vững chắc với `DESIGN.md` và rào cản kiểm duyệt tự động.
- **Automation Workflows:** Các luồng tích hợp n8n và dữ liệu lớn.

### 3. Eval Pipeline Platform (Khép Kín Kiểm Định)
Chấm dứt việc tin tưởng AI blindly. Mọi Capability đều có thẻ điểm định lượng (`scorecard.yaml`), kết nối log thực thi thực tế từ thư mục `evals/traces/` qua cổng thẩm định sắt đá `qk-validation-gate`. Trách nhiệm định lượng 0–100 với sai số 0% (zero tolerance for fabrication).

### 4. Domain Patterns Separation (Bảo Vệ Kernel)
Các hệ thống AI chuyên sâu (như **Xây dựng DDC 192 skills**, bóc tách BIM/IFC, ERP) được tải lập trình viên cấu hình dạng Module dưới `knowledge/domain-patterns/` thay vì phơi bày trực tiếp vào 30 Core Developer Skills, giữ cho đồ thị cốt lõi luôn nhanh bén mượt mà!

---

## 🧩 Danh sách 30 Master Skills (Core Developer Capabilities)

Các kỹ năng được quản lý bằng **Capability Graph** và được đánh giá liên tục thông qua Evaluation Suite. Bao gồm 7 lĩnh vực:
1. **Core & Orchestration:** `qk-orchestrator`, `qk-context-loader`, `qk-project-memory`, `qk-help`
2. **Product & Architecture:** `qk-product-specification`, `qk-project-bootstrap`, `qk-frontend-architecture`
3. **Frontend & UI:** `qk-design-system-engineering`, `qk-ui-system-builder`, `qk-ui-builder`, `qk-fe-api-integration`, `qk-ui-audit`
4. **Backend & Data:** `qk-api-lifecycle`, `qk-data-lifecycle`, `qk-data-engineer`, `qk-access-policy`
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
