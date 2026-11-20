# QK — entry point cho Antigravity

Hợp đồng chung tại [.agents/rules/global.md](.agents/rules/global.md): đọc một lần khi cần, không lặp định nghĩa báo cáo/nghiệm thu ở từng skill. Nếu có `.agents/DEV_PROFILE.md`, dùng conventions liên quan; profile không bắt buộc và không thay thế source thực tế.

## Chọn việc theo mục tiêu

Xác định người dùng muốn **giải thích**, **review**, **viết prompt/spec**, **khảo sát**, hay **thay đổi** trước; sau đó mới xét UI/API/data/CI. Khi mục tiêu đã rõ, làm tiếp trong quyền đã cấp.

| Mục tiêu | Skill / mode |
|---|---|
| Hỏi cách dùng, giải thích, trạng thái | Trả lời trực tiếp; đọc source cần thiết, không tự sửa |
| Đánh giá chỉ đọc, audit | `qk-code-review` |
| Viết prompt / spec; khảo sát chưa triển khai | `qk-feature-delivery`: prompt-only / plan-only / discovery-only |
| Hành vi sai, gồm lỗi dữ liệu trong pipeline hoặc test logic fail trên CI | `qk-bug-resolution` |
| Tính năng mới, đổi hành vi, tích hợp API thật | `qk-feature-delivery`: build *(triển khai code đơn lẻ hoặc theo chuỗi — không đồng nghĩa tự chạy lệnh compile/bundle sau mỗi bước)* |
| Refactor giữ contract, nâng dependency, bổ sung test | `qk-code-cleaner` |
| Môi trường CI/CD, image, deploy/release; docs/memory khi được yêu cầu | `qk-devops-release` |

“Đừng sửa” là giới hạn quyền, không tự biến yêu cầu viết prompt thành review. “Pipeline” có thể là luồng dữ liệu hoặc CI; chọn theo nơi gây lỗi. “Chưa viết code” không tự có nghĩa khảo sát API. Không đủ mục tiêu thì hỏi ngắn thay vì mặc định build.

## Nhịp thực thi & Tiếp tục task

Follow-up là delta: giữ kết quả, quyết định và checks đang hoãn; thực hiện phần mới, tránh lập lại intake/plan toàn bộ. Khi làm nối tiếp nhiều task hoặc ở bước trung gian, chỉ kiểm cục bộ nhẹ và trả checkpoint ngắn — không tự chạy full `build`/bundle sau mỗi bước; tầng kiểm chứng và nghiệm thu theo [.agents/rules/global.md](.agents/rules/global.md).

## Nạp reference theo nhu cầu

- UI/layout: `.agents/references/ui.md`.
- Sơ đồ/kiến trúc xuất bản: `.agents/references/diagram-spec.md`.
- API/database/data flow: `.agents/references/backend-data.md`.
- Khảo sát API: `.agents/references/api-discovery.md`.
- Spec/nghiệp vụ: `.agents/references/requirements.md`.
- Viết prompt: `.agents/references/prompt-authoring.md`.
- Quyết định kiến trúc lớn: `.agents/references/architecture.md`.
- Khám phá cấu trúc dự án: `.agents/references/context-discovery.md`.

Đọc phần liên quan, không nạp toàn bộ danh sách. Với review/fix, skill tiếp theo có thể đổi khi mục tiêu thực sự đổi; không yêu cầu người dùng khởi động một task mới chỉ để chuyển skill.

## Tương thích tên cũ

Ánh xạ tại `.agents/skill-aliases.yml`: UI/backend → feature hoặc bug theo mục tiêu; product-spec → plan-only; prompt-compiler → prompt-only; api-data-discovery → discovery-only; orchestrator → intake. Alias không tạo executable/slash command mới. Chỉ gọi command/tool mà runtime thực sự có.
