# 🚀 AI Developer Skill OS (ai-developer-skill-os) v3.0

> Một hệ điều hành (AI-OS) và Nền tảng Kiến trúc Kỹ thuật (Engineering Platform) tối thượng dành cho AI Coding Agents (Claude Code, Cursor, Windsurf, Gemini).

Thay vì cung cấp các "công cụ rời rạc" (Toolbox) hoặc những prompt cồng kềnh, **AI Developer Skill OS v3.0** được thiết kế lại hoàn toàn theo chuẩn **Enterprise-ready Agentic Framework**. Nó biến Agent của bạn thành một **Senior Engineer / Chief Architect** thực thụ với khả năng tự suy luận bằng Tiếng Anh, nhưng lại báo cáo thân thiện bằng Tiếng Việt.

---

## 🏗️ Kiến Trúc 5 Tầng (The 5-Tier Architecture)

Hệ thống được thiết kế decoupled (phân tách) hoàn hảo để chống tràn Context Window và tối ưu khả năng suy luận của LLM:

### 1. Global Policy (`.agents/AGENTS.md`)
Chứa các bộ luật thép toàn cục (Agent-wide rules):
- **Language Policy:** Suy luận kỹ thuật bằng Tiếng Anh, giao tiếp với người dùng bằng Tiếng Việt.
- **Execution Principles:** `Read before Write`, `Verify before Complete`.
- **Engineering Policy:** Trị bệnh tận gốc (Fix root cause), giữ nguyên chuẩn cũ.

### 2. Core Templates (`templates/`)
Chứa các format báo cáo chuẩn (như `bug-report.md`, `feature-report.md`, `review-report.md`). AI không cần "học lại" cách viết báo cáo, giúp đầu ra luôn nhất quán 100%.

### 3. Skill Definition (`skills/`)
Bộ 20+ kỹ năng (Skills) cốt lõi được cấu trúc siêu chuẩn xác với **Metadata 12 trường** (Version, Category, Pipeline, Allowed Tools...). Toàn bộ SOP (Standard Operating Procedure), Decision Tree và Constraints được viết 100% bằng Tiếng Anh để tối ưu hóa khả năng hiểu kỹ thuật của AI.

### 4. Knowledge Library (`knowledge/`)
Tri thức chuyên sâu được tách rời hoàn toàn khỏi Prompt. Ví dụ: Kiến thức về React (`knowledge/frontend/react.md`) chỉ được gọi (On-demand RAG) khi AI thực sự làm việc với React.

### 5. Output Format (Vietnamese Report)
Toàn bộ kết quả trả về cho bạn đều tuân thủ Output Policy: Báo cáo bằng Tiếng Việt, chia mục rõ ràng (Summary, Changes, Root Cause, Risks, Next Actions).

---

## 🧩 Danh sách 20+ Master Skills

Các skill được chia thành các nhóm (Category) rõ ràng:
- **Orchestration:** `qk-orchestrator`, `qk-context-loader`, `qk-policy-engine`, `qk-access-policy`
- **Engineering / Dev:** `qk-feature-delivery`, `qk-api-lifecycle`, `qk-data-lifecycle`, `qk-design-to-code`, `qk-ui-system-builder`
- **Validation & Standards:** `qk-validation-gate`, `qk-engineering-standard`, `qk-ui-audit`, `qk-project-health`, `qk-bug-resolution`
- **Ops & AI:** `qk-system-evolution`, `qk-production-release`, `qk-ai-builder`, `qk-project-bootstrap`
- **Docs & Utils:** `qk-docs`, `qk-documentation-system`, `qk-project-memory`, `qk-help`

---

## 🔄 Luồng Handoff Pipeline Khép Kín

Bất cứ một tính năng hay lỗi nào cũng được đi qua một đường ống khép kín (Abstract Pipeline):
```text
analyze 
  ↓
implement 
  ↓
engineering-standard (Ép chuẩn Code, Naming, SOLID)
  ↓
validate (Chạy Linter, Tests, Security Check)
  ↓
complete (Tạo báo cáo bằng tiếng Việt)
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

Để tra cứu danh sách toàn bộ 20+ Kỹ năng và các mẹo sử dụng, hãy gọi:
```bash
./qk-help "Hiển thị tất cả các skill"
```
