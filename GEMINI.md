# GEMINI.md — Rule riêng cho Antigravity

> Override hoặc bổ sung cho `AGENTS.md` — chỉ áp dụng khi chạy qua Antigravity.
> Không lặp lại nội dung đã có trong `AGENTS.md`.

---

## Pre-flight: Đọc DEV_PROFILE trước mọi thứ

Khi bắt đầu session làm việc trong repo này:
1. Đọc `.agents/DEV_PROFILE.md` — lấy `role`, `stack`, `ai_style`, `constraints`
2. Đọc `.agents/AGENTS.md` — load routing table và Role Behavior Matrix
3. Sau đó mới xử lý yêu cầu của user

Nếu `.agents/DEV_PROFILE.md` chưa có hoặc stack trống → gợi ý: `./qk-project-bootstrap`

---

## Skin Activation — Cách kích hoạt skill trong Antigravity

Hai cách:

**1. Command syntax** — gõ trực tiếp:
```
./qk-feature-delivery
./qk-bug-resolution
./qk-api-lifecycle --lang=python --fw=fastapi
```

**2. Natural language** — mô tả nhu cầu bằng tiếng Việt hoặc English:
```
"fix bug login crash"
"viết api tạo đơn hàng"
"refactor UserService.ts — quá dài"
```
→ Antigravity tự map sang skill đúng qua routing table trong `.agents/AGENTS.md`

Sau khi chọn skill: **BẮT BUỘC đọc SKILL.md** của skill đó trước khi làm.

---

## Planning Mode (Task > 1 file)

Với task có complexity ≥ medium (thay đổi ≥ 2 file hoặc ảnh hưởng nhiều component):
1. Tạo Plan dạng task list trước — mô tả từng bước
2. Hiển thị plan cho user, chờ xác nhận
3. Sau khi user duyệt → chuyển sang Autopilot thực thi từng bước

**KHÔNG** bắt đầu edit code trước khi plan được duyệt với task phức tạp.

---

## Manager View — Chạy song song

Tasks **độc lập** (không share file, không có dependency) → có thể chạy song song trong Manager view.

Tasks **có dependency** → chạy tuần tự trong 1 agent, theo thứ tự trong plan.

Ví dụ:
- ✅ Song song: "viết SKILL.md cho qk-upgrade" và "viết SKILL.md cho qk-api-consumer"
- ❌ Tuần tự: "detect stack" → "viết DEV_PROFILE.md" (phải có output bước 1 mới làm bước 2)

---

## Announce Format

Khi kích hoạt skill, announce ngay dòng đầu:
```
[🚀 AI Developer Skin: Đã kích hoạt kỹ năng <skill-name> | Role: <role>]
```

Sau khi hoàn thành, report theo format trong `.agents/AGENTS.md` — không thay đổi format.

---

## Antigravity-specific: Đọc file quy tắc theo đúng path

- Antigravity CLI: đọc `AGENTS.md` hoặc `GEMINI.md` tại thư mục **đang chạy lệnh** (`pwd`)
- Antigravity 2.0 IDE: đọc `.agents/rules/*.md` tại workspace root + `~/.gemini/GEMINI.md` global
- Nếu cần rule mới → tạo file `.md` trong `.agents/rules/` (không nhét vào `AGENTS.md` của skin)
- Sau khi sửa rule: bắt đầu hội thoại mới (`/clear`) để Antigravity nạp lại

---

## Terminal Visual Rendering (Diagrams & Flowcharts)

Khi user yêu cầu vẽ sơ đồ, kiến trúc, flowchart, hoặc trực quan hóa luồng:
- **BẮT BUỘC** render trực tiếp thành biểu đồ khối ký tự **ASCII / Unicode Box Drawing** ngay trong response của terminal.
- **KHÔNG** chỉ trả về mã code Mermaid thô hoặc điều hướng mở trình duyệt ngoài trừ khi user yêu cầu xuất file.

