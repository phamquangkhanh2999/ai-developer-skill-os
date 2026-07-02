# 🚀 AI Developer Skill OS (ai-developer-skill-os) v4.0

> Một hệ điều hành (AI-OS) và Nền tảng Kiến trúc Kỹ thuật (Engineering Platform) tối thượng dành cho AI Coding Agents (Claude Code, Cursor, Windsurf, Gemini, Kilo).

Thay vì cung cấp các "công cụ rời rạc" (Toolbox) hoặc những prompt cồng kềnh, **AI Developer Skill OS v4.0** được thiết kế lại hoàn toàn theo chuẩn **Enterprise-ready Agentic Framework**. Nó biến Agent của bạn thành một **Senior Engineer / Chief Architect** thực thụ với khả năng tự suy luận bằng Tiếng Anh, nhưng lại báo cáo thân thiện bằng Tiếng Việt.

---

## 🏗️ Kiến Trúc 5 Tầng (The 5-Tier Architecture)

Hệ thống được thiết kế decoupled (phân tách) hoàn hảo để chống tràn Context Window và tối ưu khả năng suy luận của LLM:

### 1. OS Kernel (`.agents/AGENTS.md`)
The core of the system is a lightweight, heavily optimized OS Kernel that dictates agent behavior across all tasks.
- **Intent-Based Policies:** Skills are classified into 4 groups (Static Analysis, Development, Validation, Maintenance) rather than micromanaged with individual exceptions.
- **Progressive Evidence Collection:** Agents collect context incrementally (1 file → 3 files) and stop at a 80% Confidence Threshold, eliminating "hallucination loops".
- **Risk-based Verification:** Tests and builds are only run based on the risk level of the change, strictly guided by the Cost and Escalation policies.

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

## 🧪 Testing

This project includes a full test suite to ensure registry integrity and SKILL.md spec compliance:

```bash
npm test
```

CI runs automatically on every PR via GitHub Actions, enforcing:
- Registry matches filesystem
- All SKILL.md frontmatters comply with `docs/SPEC.md`
- Install script idempotency

## 🗑️ Cách Gỡ Cài Đặt (Uninstallation)

Nếu bạn đã cài đặt thông qua npm global, bạn có thể gỡ bỏ bằng lệnh:
```bash
npm uninstall -g ai-developer-skill-os
```

## 🚀 Tra Cứu (Help)

Để tra cứu danh sách toàn bộ 20+ Kỹ năng và các mẹo sử dụng, hãy gọi:
```bash
./qk-help "Hiển thị tất cả các skill"
```
