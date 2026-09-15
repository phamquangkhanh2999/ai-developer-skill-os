# AGENTS.md — Quy tắc chung cho mọi AI coding agent

> Đọc file này TRƯỚC KHI làm bất cứ việc gì trong repo này.
> Áp dụng cho: Antigravity, Claude Code, Cursor, Windsurf, Kilo Code, Cline.

---

## Project Context

Đây là **AI Developer Skill OS** — một hệ thống skin/rules/skills dành cho AI coding agents.
Repo này KHÔNG phải là một web app hay data pipeline — nó là **hệ thống cấu hình AI**.

Cấu trúc quan trọng:
```
.agents/
├── AGENTS.md          ← Entry point của skin system (không phải file này)
├── DEV_PROFILE.md     ← Khai báo role + stack của developer
├── skills/            ← 10 Core Super-Skills (mỗi skill có SKILL.md)
├── workflows/         ← 10 execution pipelines (YAML)
├── rules/             ← Behavior policies (global, coding, safety, security...)
└── registry/          ← Generated indexes — KHÔNG sửa tay
```

---

## Skin Routing — Cách kích hoạt skill

Khi làm việc trong repo này, ưu tiên dùng skin system thay vì làm trực tiếp:

1. Đọc `.agents/DEV_PROFILE.md` để biết role + stack hiện tại
2. Match yêu cầu với routing table trong `.agents/AGENTS.md`
3. Đọc SKILL.md tương ứng trước khi thực thi
4. Report kết quả theo format trong `.agents/AGENTS.md`

Nếu yêu cầu là sửa/cải tiến skill system → dùng `qk-code-review` hoặc `qk-code-cleaner`.

---

## Coding Style (áp dụng cho mọi file trong repo)

- **Markdown:** Heading rõ cấp bậc, dùng table cho comparison, code block có language tag
- **YAML:** 2-space indent, quote strings có special chars, comment giải thích mục đích
- **Naming:** kebab-case cho file/folder, UPPER_CASE cho constant YAML keys
- **SKILL.md:** Frontmatter có `name` + `description` đầy đủ — description PHẢI nêu trigger keywords
- Không sửa file trong `registry/` bằng tay — chỉ regenerate qua `node tooling/build-registry.js`

---

## Guardrails (Critical — không được bỏ qua)

- **KHÔNG** xóa hoặc rename skill folder mà không cập nhật routing table trong `.agents/AGENTS.md`
- **KHÔNG** sửa `registry/` files bằng tay — luôn regenerate qua `node tooling/build-registry.js`
- **KHÔNG** thêm `.ai-local/` vào repo — đã gitignore, là private workspace memory
- **KHÔNG** hardcode đường dẫn tuyệt đối trong bất kỳ SKILL.md hay workflow YAML nào
- **PHẢI** bump version trong SKILL.md khi thay đổi behavior (patch cho fix nhỏ, minor cho feature mới)

---

## Quy ước Commit

Theo Conventional Commits:
```
feat:     thêm skill mới hoặc feature mới trong skill
fix:      sửa bug trong skill hoặc workflow
docs:     cập nhật SKILL.md description, README, changelog
refactor: cấu trúc lại skill/workflow không đổi behavior
chore:    bump version, regenerate registry
```

PR không quá 400 dòng diff. Mỗi PR chỉ thay đổi 1 skill hoặc 1 workflow.

---

## Testing Skill Changes

Trước khi coi một thay đổi SKILL.md là "xong":
1. Chạy `npm run test:registry` — verify registry consistency
2. Chạy `npm run test:graph` — verify không có cycle
3. Test thủ công: gọi skill với 2-3 prompt thực tế, verify output đúng format
4. Nếu đổi `description` hay `triggers`: test routing (AI có route đúng skill không)
