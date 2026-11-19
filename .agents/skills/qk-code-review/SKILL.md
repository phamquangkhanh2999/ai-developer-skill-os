---
name: qk-code-review
version: 13.0.0
status: stable
subtitle: "Review Code & Security Audit"
description: "Dùng khi đánh giá chỉ đọc source, diff, kiến trúc hoặc bảo mật. Nêu findings có bằng chứng và giới hạn; không tự sửa khi chỉ được giao review."
platforms: [antigravity]
runtime_version: 1
references:
  - ../../references/backend-data.md
  - ../../references/ui.md
rules:
  - global
  - coding
  - safety
  - subagent-orchestration
triggers:
  - "review code"
  - "code review"
  - "kiểm tra code"
  - "đánh giá code"
  - "security audit"
  - "scan lỗ hổng"
  - "owasp"
  - "secret leak"
---

# QK — review chỉ đọc

Dùng [global.md](../../rules/global.md) cho nghiệm thu, báo cáo và giới hạn bằng chứng.

- Xác định đối tượng: diff/branch khi được chỉ định; module hoặc cấu hình hiện hành khi user yêu cầu review hệ thống. Thiếu baseline diff không chặn review source hiện hành; nêu rõ phạm vi thực đã đọc.
- Giữ nguyên source và thay đổi có sẵn. Chỉ sửa khi người dùng chuyển rõ sang yêu cầu sửa; khi đó tiếp tục từ findings đã xác minh, không bắt đầu lại toàn bộ review.
- Mỗi finding có vị trí `file:dòng`, điều kiện xảy ra, cơ chế/tác động và hướng xử lý. Đối chiếu source hiện tại; gộp trùng và tách phát hiện chắc chắn khỏi giả thuyết cần runtime.
- Ưu tiên lỗi correctness, dữ liệu, quyền và contract liên quan. Style là góp ý khi không có tác động; số dòng, số tầng hoặc sở thích kiến trúc không tự là lỗi.
- Chọn checklist theo lĩnh vực thực: [backend-data.md](../../references/backend-data.md) cho API/database/auth; [ui.md](../../references/ui.md) cho UI. Không ép OWASP vào file không có bề mặt tấn công tương ứng.

Báo findings theo mức tác động, sau đó phần đã kiểm/chưa kiểm. Không có finding có căn cứ thì nói rõ thay vì tạo lỗi để đủ mục. Không bịa điểm số tổng. Chứng cứ source không chứng nhận runtime hay bảo đảm không còn lỗi.
