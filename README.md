# 🚀 AI Developer Skill OS (ai-developer-skill-os) v6.0

> **Rule-Skins v6 is a Behavior Specification Format (BSF), not a prompt library, not an agent framework, and not a programming language. It defines reusable behavioral contracts that can be interpreted by different AI runtimes while remaining implementation-agnostic.**

Thay vì cung cấp các "công cụ rời rạc" (Toolbox) hoặc những prompt cồng kềnh, **Rule-Skins v6** được tái thiết kế hoàn toàn theo chuẩn **Behavior Specification Format**. Các hành vi (Behaviors) giờ đây là các bản Hợp đồng (Contracts) rõ ràng, bao gồm Policies, Capabilities, và Reasoning Boundaries.

---

## 🏗️ Kiến Trúc 5 Tầng (Agent OS Kernel)

Hệ thống được thiết kế decoupled hoàn hảo:

### 1. BSF Kernel (`framework/KERNEL.md`)
Trái tim của hệ thống định nghĩa BSF Meta-Model, OS Policy (Invariants), Knowledge Layer, Validation Rules, và Design Principles.

### 2. Thư Viện Độc Lập (Library Modules)
- `framework/bias-library/`: Sửa các lỗi tư duy mặc định của AI.
- `framework/dial-library/`: Định nghĩa các cấu hình điều khiển hành vi.
- `framework/rule-library/`: Các tiêu chí xuất xưởng bắt buộc.

### 3. Behavior Specifications (`skills/`)
Bộ 23 Behavior cốt lõi được cấu trúc theo chuẩn BSF (`_template/BEHAVIOR_SPEC.md`). Toàn bộ logic nội bộ được quy hoạch thành các Contracts (Quyền hạn), Policies (Quyết định, Bằng chứng) và Protocol (State Machine tùy chọn).

### 4. Output Contract (Decision Summary)
Toàn bộ kết quả trả về cho bạn đều tuân thủ Output Contract: Báo cáo bằng Tiếng Việt, bảo đảm Invariants, và vượt qua các Quality Gates.

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
