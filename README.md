# 🚀 AI Developer Skill OS (ai-developer-skill-os) v5.0

> Một hệ điều hành Agent (Agent OS Specification) tối thượng dành cho AI Coding Agents (Claude Code, Cursor, Windsurf, Gemini, Kilo).

Thay vì cung cấp các "công cụ rời rạc" (Toolbox) hoặc những prompt cồng kềnh, **AI Developer Skill OS v5.0** được thiết kế lại hoàn toàn theo chuẩn **Modular Agent OS**. Các kỹ năng giờ đây siêu nhẹ, kế thừa tập trung từ Kernel và các bộ quy tắc độc lập.

---

## 🏗️ Kiến Trúc 5 Tầng (Agent OS Kernel)

Hệ thống được thiết kế decoupled hoàn hảo:

### 1. OS Kernel (`framework/KERNEL.md`)
Trái tim của hệ thống định nghĩa Core Policies (Minimal Change, Evidence, Escalation, Reasoning), Constraint Layer (các hành vi bị cấm), và Cognitive Pipeline.

### 2. Thư Viện Độc Lập (Library Modules)
- `framework/bias-library/`: Sửa các lỗi tư duy mặc định của AI (Ví dụ: cấm vẽ UI giả, cấm nuốt lỗi).
- `framework/dial-library/`: Định nghĩa các cấu hình điều khiển hành vi (Độ nghiêm ngặt, ngân sách độ phức tạp).
- `framework/rule-library/`: Các tiêu chí xuất xưởng bắt buộc.

### 3. Metadata-Only Skills (`skills/`)
Bộ 23 kỹ năng (Skills) cốt lõi được cấu trúc siêu nhẹ. Toàn bộ logic nội bộ bị loại bỏ, thay bằng việc khai báo (Declarative) để gọi các Pipeline, Bias, và Dials từ thư viện.

### 4. Output Contract (Decision Summary)
Toàn bộ kết quả trả về cho bạn đều tuân thủ Output Contract: Báo cáo dưới dạng `Decision Summary` súc tích (Context, Decisions, Assumptions, Trade-offs) bằng Tiếng Việt, loại bỏ hoàn toàn các chuỗi suy nghĩ dài dòng (Invisible Reasoning).

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
