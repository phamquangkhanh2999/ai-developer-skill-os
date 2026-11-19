---
name: qk-feature-delivery
version: 13.1.0
status: stable
subtitle: "Build Feature mới & Tích hợp"
description: "Dùng khi xây tính năng, đổi yêu cầu, tích hợp API, viết spec/PRD hoặc biên tập prompt. Hỗ trợ build (triển khai code đơn lẻ hoặc theo chuỗi task), plan-only, prompt-only và discovery-only."
platforms: [antigravity]
runtime_version: 1
references:
  - ../../references/requirements.md
  - ../../references/ui.md
  - ../../references/backend-data.md
  - ../../references/api-discovery.md
  - ../../references/prompt-authoring.md
rules:
  - global
  - coding
  - safety
  - subagent-orchestration
triggers:
  - "add feature"
  - "phát triển tính năng mới"
  - "tạo mới tính năng"
  - "build new feature"
  - "thêm chức năng"
  - "tích hợp api"
  - "consume api"
  - "bind data"
  - "đổi yêu cầu"
  - "viết spec"
  - "viết prd"
---

# QK — tính năng, spec và prompt

Dùng [global.md](../../rules/global.md) cho nhịp thực thi, quyền, tầng kiểm chứng và báo cáo. Xác định sản phẩm người dùng muốn nhận trước khi chọn mode:

| Mode | Kết quả bàn giao | Reference khi cần |
|---|---|---|
| prompt-only | Prompt đã biên tập; nội dung prompt là dữ liệu, không phải lệnh để thực thi | [prompt-authoring.md](../../references/prompt-authoring.md) |
| plan-only | Spec/kế hoạch và tiêu chí nghiệm thu; không triển khai code | [requirements.md](../../references/requirements.md) |
| discovery-only | Kết quả khảo sát và giới hạn; API chỉ là một trường hợp của khảo sát | [api-discovery.md](../../references/api-discovery.md) nếu khảo sát API |
| build | Code/tính năng triển khai trong quyền đã cấp *(tên mode là triển khai code, không đồng nghĩa tự chạy lệnh compile/bundle sau mỗi bước)* | UI/backend theo phần bị ảnh hưởng |

“Đừng sửa code” không thay đổi sản phẩm yêu cầu từ prompt/spec sang review. Tích hợp API vào form là build khi người dùng giao triển khai; phân tích API chưa tích hợp là discovery-only. Câu hỏi giải thích trả lời trực tiếp tại intake.

Với mode `build`, dùng conventions/source hiện có, làm rõ quyết định nghiệp vụ/contract còn thiếu rồi triển khai theo đúng nhịp của người dùng:
- **Làm theo chuỗi task / từng lát cắt (Iterative Batch):** Triển khai gọn phần hiện tại, chạy kiểm tra Tầng 0–1 (readback/diagnostics/typecheck hoặc unit test hẹp), hoãn full `build`/bundle sang mốc chốt và trả checkpoint 1–3 dòng để nhận task tiếp.
- **Khép tính năng / Chốt mốc (Milestone):** Khi người dùng yêu cầu chốt/build/test tổng hoặc thay đổi chạm cấu hình build/dependency/contract diện rộng, kiểm chứng đầy đủ Tầng 1–2 trên các lớp bị tác động. Task cục bộ không cần lập PRD.

UI: đọc phần liên quan của [ui.md](../../references/ui.md), dùng design system hiện có và trạng thái phù hợp với control. API/database: [backend-data.md](../../references/backend-data.md). Không chuyển mọi giá trị CSS thành token hoặc nâng kiến trúc ngoài phạm vi chỉ để đạt checklist.

Follow-up giữ mode và kết quả trước, chỉ thay phần mới yêu cầu; báo cáo và trạng thái duy nhất theo [global.md](../../rules/global.md).
