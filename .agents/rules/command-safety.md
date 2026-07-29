---
version: 8.0.0
description: "Detailed shell-command threat reference, mapped to the risk matrix defined in safety.md."
domain: rules
applies_to: [skills-with-side_effects-shell_exec]
---

# Command Safety Rules — Shell Command Threat Reference

> **Câu hỏi domain này trả lời:** *Lệnh shell cụ thể nào rơi vào cấp độ rủi ro nào trong ma trận của `safety.md`?*

> ℹ️ File này là **phụ lục chi tiết** cho ma trận rủi ro tại `safety.md` (R-S-01, R-S-03). Không định nghĩa cấp độ rủi ro riêng — mọi lệnh dưới đây được ánh xạ vào đúng 4 cấp `low / medium / high / critical` đã chuẩn hóa ở đó.

---

## R-CS-01: Lệnh cấp `critical` — BLOCKED, bắt buộc xác nhận tường minh từ user

Tương ứng `safety.md` R-S-01 (`critical`) và R-S-03 (*BLOCKED without explicit request*).

- `rm -rf /`, `rm -rf *`, `rm -rf node_modules` (trừ khi context task xác nhận đây là bước dọn dẹp hợp lệ và đã được user xác nhận).
- Xóa database: `DROP DATABASE`, `DROP TABLE`, `TRUNCATE`.
- Lệnh Git phá hủy lịch sử: `git reset --hard`, `git push --force`.
- Hạ tầng: `terraform destroy`, `aws nuke`.
- `chmod 777`.

Khi gặp lệnh thuộc nhóm này, Agent **MUST** dùng đúng format xác nhận tại `safety.md` R-S-02 (`⚠️ BREAKING CHANGE DETECTED`) và chờ phản hồi rõ ràng ("yes") trước khi thực thi.

---

## R-CS-02: Lệnh cấp `high` — Cần kiểm tra path/scope trước khi chạy

Có thể chạy nhưng **PHẢI** verify path/scope trước, không chạy mù:

- Thao tác file hàng loạt: `find . -name "*.js" -delete`.
- Cài đặt ảnh hưởng phạm vi toàn cục: `npm install -g`, `pip install` (ngoài venv/project scope).
- Khởi động lại service hệ thống: `systemctl restart`.
- `git commit`, `git push` (cấp `medium` theo `safety.md` R-S-03 — chạy được nhưng phải báo cáo thay đổi).

---

## R-CS-03: Action Plan

- Với lệnh **R-CS-01**: dừng lại, áp dụng format xác nhận `safety.md` R-S-02, không tự động chạy.
- Với lệnh **R-CS-02**: xác minh scope trước (ví dụ chạy `ls`/`git status` trước), chỉ chạy tiếp khi scope đúng như dự kiến; không cần dừng hỏi user trừ khi phát hiện scope bất thường.
