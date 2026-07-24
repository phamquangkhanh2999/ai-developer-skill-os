# V8 Schema Validation Guide

Tài liệu này dùng để đối chiếu khi review các file `SKILL.md` hoặc các file cấu hình AI khác trong dự án. Đảm bảo mọi cấu hình tuân thủ chặt chẽ định dạng và kiến trúc của V8 Skin.

## 1. Frontmatter (YAML Metadata) Bắt buộc

Mọi file `SKILL.md` **phải** bắt đầu bằng khối YAML chứa các thông tin sau:

```yaml
---
# ── Identity ───────────────────────────────────────────────
name: qk-[tên-skill]          # Bắt buộc có tiền tố qk-
version: [X.Y.Z]              # Phiên bản semantic
status: [stable/beta/draft]
description: "[Mô tả ngắn gọn bằng tiếng Việt]"
platforms: [danh sách platform hỗ trợ]

# ── V8: Classification ─────────────────────────────────────
type: [utility/capability/orchestrator]
intent:
  - [mục-đích-chính]

complexity:
  level: [low/medium/high/critical]
  criteria:
    files_affected: "[range]"
    # ... các criteria khác

triggers:                     # Rất quan trọng, bắt buộc có
  - "[từ khóa 1]"
  - "[từ khóa 2]"

# ── V7 Runtime ─────────────────────────────────────────────
# Phần này cấu hình cách Agent thực thi
side_effects: [read_only/edit_files/run_commands]
produces: [...]
consumes: [...]

token_budget:                 # Bắt buộc để tránh cạn kiệt Token
  max_files_read: [số]
  max_lines_per_read: [số]
  max_shell_commands: [số]
  stop_early: [true/false]

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---
```

## 2. Các phần Body (Markdown) Bắt buộc

1. **Title & Language Rule**: Ngay sau frontmatter, phải có tiêu đề và rule ngôn ngữ chuẩn:
   ```markdown
   > **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.
   ```
2. **Preconditions**: Định nghĩa rõ điều kiện tiên quyết để skill này có thể chạy. Phải mô tả hành động (thường là `EXIT: BLOCKED`) nếu thiếu thông tin.
3. **Scope (What it does / What it does NOT)**: Phải rõ ràng giới hạn của skill. Đặc biệt phần `Does NOT` để ngăn scope creep.
4. **Output Format**: Format chuẩn mà AI sẽ phản hồi lại cho user sau khi thực thi.

## 3. Checklist khi Review

- [ ] Tiền tố tên có đúng chuẩn (`qk-`) không?
- [ ] Triggers có bao phủ đủ các cách gọi thông dụng không? Có bị trùng lặp với skill khác không?
- [ ] `token_budget` có được cấu hình hợp lý so với `complexity` không? (Ví dụ: complexity low nhưng lại cho đọc 50 files là sai).
- [ ] Nếu `side_effects` là `run_commands` hoặc `edit_files`, phần Preconditions đã đủ chặt chẽ chưa?
- [ ] Format đầu ra (Output format) có chuẩn mực và chuyên nghiệp không?
