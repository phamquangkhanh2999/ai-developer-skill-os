# CLAUDE.md — Rule riêng cho Claude Code

> Override hoặc bổ sung cho `AGENTS.md` — chỉ áp dụng khi chạy qua Claude Code.
> Không lặp lại nội dung đã có trong `AGENTS.md`.

---

## Pre-flight: Load context trước khi làm

Khi bắt đầu làm việc trong repo này:
1. Đọc `.agents/DEV_PROFILE.md` — lấy role + stack + constraints
2. Đọc `.agents/AGENTS.md` — load routing table đầy đủ
3. Xử lý yêu cầu, chọn đúng skill, đọc SKILL.md tương ứng

---

## Tool Permissions

**Tự chạy không cần hỏi:**
```bash
# Đọc/tìm kiếm
cat, grep, find, ls, head, tail
# Build & validate
node tooling/build-registry.js
node tooling/validate-skills.js
npm run test:registry
npm run test:graph
npm run lint
# Git read-only
git status
git diff
git log --oneline -10
```

**Phải hỏi user trước:**
```bash
git add / git commit / git push   # Thay đổi git history
npm install / pip install          # Thay đổi dependencies
rm / rmdir                         # Xóa file
node tooling/build-registry.js  # Nếu sẽ overwrite registry
```

**KHÔNG bao giờ chạy:**
```bash
git push --force
git reset --hard
rm -rf
curl ... | bash                    # Pipe từ internet
```

---

## Cách chạy test trong repo này

```bash
# Test registry consistency (sau khi thêm/xóa/đổi tên skill)
npm run test:registry

# Test capability graph (verify không có cycle, đúng edges)
npm run test:graph

# Test routing intelligence (AI route đúng skill không)
npm run test:agent

# Regenerate registry sau khi sửa SKILL.md
node tooling/build-registry.js
```

Sau khi sửa bất kỳ SKILL.md nào → **bắt buộc** chạy `test:registry` trước khi báo xong.

---

## MCP / Context ngoài

Nếu có MCP Filesystem server: dùng để đọc file thay vì `cat` — nhanh hơn và context-aware hơn.

Nếu có MCP Git server: dùng để query git history, blame, diff — chính xác hơn shell git commands.

Nếu không có MCP: dùng shell commands trong danh sách "Tự chạy không cần hỏi" ở trên.

---

## Skill Execution trong Claude Code

Khi user gọi `./qk-[skill-name]` hoặc describe yêu cầu:
1. Match routing table trong `.agents/AGENTS.md`
2. Đọc `.agents/skills/qk-[skill-name]/SKILL.md`
3. Đọc workflow YAML được reference trong SKILL.md frontmatter
4. Execute theo steps trong workflow
5. Report theo format trong `.agents/AGENTS.md`

Claude Code **không cần** tạo plan trước với task nhỏ (1 file) — có thể execute ngay.
Với task medium/high (≥ 3 files) → tạo plan, confirm với user trước khi execute.

---

## Output Language

- **Code, identifiers, YAML keys, file names:** English
- **Explanations, summaries, reports, comments cho user:** Tiếng Việt
- **SKILL.md body headings:** English
- **Commit messages:** English (Conventional Commits)
