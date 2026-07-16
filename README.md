# 🚀 AI Developer Skill OS (ai-developer-skill-os) v7.0.0

> **V7.0.0 "Anti-Slop & Zero-Trust Architecture"**

Hệ sinh thái AI Developer Skill OS đã được tái cấu trúc hoàn toàn. Thay vì cung cấp các "công cụ rời rạc" (Toolbox), phiên bản V7 được thiết kế như một **Hệ điều hành khép kín, hoạt động theo kỷ luật của một Kiến trúc sư Hệ thống (50 năm kinh nghiệm)**.

---

## 🏗️ Triết Lý Hoạt Động Cốt Lõi (V7 Kernel)

### 1. Zero-Trust Context (Không bao giờ đoán mò)
Mọi kỹ năng phân tích logic và backend (như `qk-feature-delivery`, `qk-orchestrator`) đều bị khoá chặt, không được phép hoạt động nếu chưa có **Dependency Graph** (Bản đồ cấu trúc) từ `qk-context-loader`. AI không được phép thay đổi code dựa trên trí tưởng tượng.

### 2. Contract-First (Khế ước đi đầu)
- **Frontend / UI**: Mọi sửa đổi giao diện đều phải dựa trên `DESIGN.md`. Nếu vi phạm (tạo ra giao diện lười biếng "slop", dùng màu mặc định sai lệch), AI sẽ tự động bị đánh trượt bài kiểm toán.
- **Backend / API**: Mọi API phải được viết `OpenAPI/Swagger` schema trước khi viết logic thực tế (`qk-api-lifecycle`).
- **Database**: Cấm truy vấn mù. Bắt buộc phải có Schema định nghĩa rõ ràng trước (`qk-data-lifecycle`).

### 3. Repair Loop (Chu trình Sửa Lỗi Khép Kín)
Bảo vệ mã nguồn khỏi thói quen "sửa vội" của AI. Lỗi bắt buộc phải qua chu trình điều tra nghiêm ngặt: `Observe -> Hypothesis -> Evidence -> Fix -> Verify` (`qk-bug-resolution`).

---

## 🧩 Danh sách 22 Master Skills

Các kỹ năng được quản lý cực kỳ chặt chẽ với bài kiểm tra tự động (Vitest) để đảm bảo tính nhất quán của luật lệ:
- **Orchestration:** `qk-orchestrator`, `qk-context-loader`, `qk-access-policy`
- **Engineering / Dev:** `qk-feature-delivery`, `qk-api-lifecycle`, `qk-fe-api-integration`, `qk-data-lifecycle`, `qk-design-to-code`, `qk-ui-system-builder`
- **Validation & Standards:** `qk-validation-gate`, `qk-engineering-standard`, `qk-ui-audit`, `qk-project-health`, `qk-bug-resolution`
- **Ops & AI:** `qk-system-evolution`, `qk-production-release`, `qk-ai-builder`, `qk-project-bootstrap`
- **Docs & Utils:** `qk-docs`, `qk-project-memory`, `qk-help`, `qk-db-optimizer`

---

## 💻 Cách Cài Đặt (Installation)

Sử dụng npm:
```bash
npm i -g ai-developer-skill-os
```

### Antigravity (Global)
Cài 1 lần, áp dụng cho mọi dự án trên máy:
```bash
npm run install:antigravity
```

### Antigravity (Local — per project)
Cài riêng cho dự án hiện tại, override global:
```bash
npm run install:antigravity:local
```

### Các IDE khác
```bash
npm run install:cursor        # Global Cursor
npm run install:windsurf      # Global Windsurf
npm run install:claude        # Global Claude Code
npm run install:kilo          # Global Kilo Code
npm run install:multi         # Multi-IDE (CLAUDE.md + .qk-ai-skill-os)
```

Hoặc khởi tạo thông qua `npx`:
```bash
npx ai-developer-skill-os init
```

## 🧪 Testing

Hệ thống được bảo vệ bằng bộ Test Suite (Vitest) để tự động kiểm toán tính hợp lệ của toàn bộ 23 file Kỹ năng trước khi xuất bản:

```bash
npm test
```

## 🚀 Tra Cứu (Help)

Để tra cứu danh sách các Kỹ năng và luật lệ khắt khe của hệ thống V7, hãy gọi:
```bash
./qk-help
```
