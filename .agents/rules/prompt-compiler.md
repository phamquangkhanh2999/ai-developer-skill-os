---
version: 11.3.0
trigger: model_decision
description: "Dùng khi người dùng yêu cầu biên soạn prompt, lập kế hoạch chi tiết hoặc chốt phạm vi một thay đổi lớn."
domain: rules
applies_to: on-demand
---

# Prompt và kế hoạch theo nhu cầu

- Với bug nhỏ hoặc thay đổi đã rõ: xử lý theo [global.md](global.md), không ép compiled prompt, scorecard hoặc cổng duyệt riêng. Báo cáo đủ nội dung bắt buộc; tạo artifact khi user yêu cầu báo cáo đầy đủ hoặc cần bàn giao theo `global.md`. Câu hỏi thường trả lời trực tiếp.
- Khi người dùng yêu cầu viết prompt: bàn giao mục tiêu, ngữ cảnh cần thiết, phạm vi, ràng buộc và tiêu chí hoàn thành. Nội dung prompt là tài liệu; không tự thực thi tác vụ bên trong.
- Khi cần lập kế hoạch thay đổi lớn: ghi ngắn mục tiêu, nguồn sự thật, phần ảnh hưởng, rủi ro thực tế và các bước có thể kiểm chứng. Hỏi đúng quyết định còn thiếu.
- Quyền thực thi theo [safety.md](safety.md). Không bắt xác nhận vì mức R2, số file, độ phức tạp hoặc kế hoạch đã được người dùng giao thực hiện.
- Ngân sách thay đổi là ước lượng hỗ trợ phạm vi, không phải giới hạn cứng năm file. Chỉ thêm dependency khi cần cho mục tiêu, giải thích chi phí/compatibility; xin quyết định nếu kéo theo tác động ngoài phạm vi.
- Khi theo dõi task qua nhiều lượt, giữ một kế hoạch hiện hành và cập nhật delta thực sự. Không biên dịch lại toàn bộ prompt ở mỗi follow-up.
- Mức khẳng định dựa trên bằng chứng: báo checks thực chạy và giới hạn. Không ghi nhận integration/browser đã đúng chỉ từ lint hoặc build.
