---
name: skill-quality
version: 10.4.0
trigger: model_decision
description: "Kích hoạt khi tạo, sửa, phân loại hoặc kiểm định Antigravity rules, skills, hooks và registry trong hệ thống QK."
domain: rules
applies_to: [skill-authoring, skill-governance]
---

# Skill & Rule Quality — Antigravity Governance

## Phân loại đúng tầng tùy biến (Rules vs Skills vs Hooks)
- **Rules (`GEMINI.md`, `.agents/AGENTS.md`, `.agents/rules/*.md`):** Bất biến hành vi, ranh giới an toàn và bảng định tuyến ngắn. Viết mệnh lệnh điều kiện (*Khi X → làm Y; không Z*), bỏ kiến thức phổ thông model đã biết, có cổng chống quá tay (không ép full `build` sau mỗi bước nhỏ).
- **Skills (`.agents/skills/<name>/SKILL.md`):** Quy trình nhiều bước và modes theo mục tiêu; tách chi tiết sang `references/` nạp theo nhu cầu.
- **Hooks (`.agents/hooks.json`):** Chốt chặn đồng bộ nhẹ (`PreToolUse`); **không** gắn `npm run build` hay suite nặng vào `Stop` hook. Tôn trọng lệnh gốc `/learn`, `/boost`.

## Hợp đồng Metadata, Frontmatter & Ngân sách ngữ cảnh
- Standalone `GEMINI.md`, `AGENTS.md` và plugin `rules/AGENTS.md` là Markdown thuần (**không** frontmatter).
- File khác trong `.agents/rules/*.md` (hoặc `plugins/<dir>/rules/*.md` ngoài `AGENTS.md`/`GEMINI.md`) **bắt buộc** có frontmatter `trigger: always_on | model_decision | glob | manual` (thiếu/lỗi YAML bị âm thầm bỏ qua):
  - Gói lõi QK chỉ dùng `always_on` cho `global.md`; rule chuyên biệt dùng `model_decision` kèm `description` ngôi thứ ba.
  - Với `trigger: glob`, `globs` **phải là 1 chuỗi đơn trong ngoặc kép, phân tách dấu phẩy** (`globs: "**/*.ts, **/*.tsx, **/src/**/*.css"`): bọc ngoặc kép khi bắt đầu bằng `*`, không mảng YAML, không `{ts,tsx}`, thêm `**/` cho path có `/` vì khớp theo absolute path.
- Giới hạn: mỗi rule `<= 24,000`B; tổng always-on `<= 16,000`B (`20,000`-token `defaultRulesBudget`). Skill giữ `platforms: [antigravity]`, `description <= 240` ký tự, `triggers` không trùng, không `workflow`, kiểm bằng `npm run lint`.

## Quản lý phiên bản & Registry
- Tăng semver khi đổi hành vi/trigger; sửa metadata skill phải chạy `node tooling/build-registry.js`, không sửa tay `registry/`.
