# AI Agent Anti-Patterns

Khi review các cấu hình AI (Skills, Rules, Workflows), hãy lưu ý các "Code Smells" hoặc Anti-patterns phổ biến sau đây:

## 1. Mất kiểm soát Token (Token Abuse)
- **Dấu hiệu**: Không định nghĩa `token_budget`, hoặc định nghĩa `max_files_read: 50`, `max_lines_per_read: 1000`.
- **Rủi ro**: Agent sẽ đọc lướt quá nhiều file, làm cạn kiệt context window, dẫn đến "ảo giác" (hallucination) và tốn kém chi phí.
- **Cách khắc phục**: Ép buộc một giới hạn cứng hợp lý (VD: `max_files_read: 3`, `max_lines_per_read: 150`). Bắt buộc agent dùng `grep` thay vì `read_file` toàn bộ.

## 2. Phạm vi quá rộng (Scope Creep)
- **Dấu hiệu**: Phần `Scope` hoặc `Intent` bao gồm quá nhiều chức năng không liên quan (VD: Vừa viết code, vừa test, vừa deploy, vừa viết docs).
- **Rủi ro**: Agent mất tập trung, không biết ưu tiên tác vụ nào, thường xuyên bỏ dở công việc giữa chừng.
- **Cách khắc phục**: Áp dụng nguyên tắc Single Responsibility. Tách thành nhiều skill nhỏ và dùng Orchestrator hoặc Workflow để phối hợp. Yêu cầu làm rõ mục `This skill does NOT`.

## 3. Lạm dụng quyền thực thi (Unsafe Side-Effects)
- **Dấu hiệu**: Cấu hình `side_effects: run_commands` nhưng không có Verification Gate hoặc không bắt buộc user approval.
- **Rủi ro**: Có thể vô tình xóa file (`rm -rf`), chạy mã độc, hoặc làm hỏng môi trường phát triển của User.
- **Cách khắc phục**: Đánh giá Risk level (High/Medium). Nếu có `run_commands`, phải ép buộc chạy ở môi trường giả lập (sandbox) hoặc chỉ sinh ra script để user tự chạy (Dry-run mode).

## 4. Thiếu điều kiện tiền quyết (Missing Preconditions)
- **Dấu hiệu**: Bỏ trống phần `Preconditions`, agent lao vào thực thi ngay lập tức.
- **Rủi ro**: Chạy sai ngữ cảnh, sửa bậy bạ vào mã nguồn khi chưa đủ thông tin, tốn token vô ích.
- **Cách khắc phục**: Bắt buộc phải có `EXIT: BLOCKED` nếu thiếu thông tin đầu vào quan trọng (ví dụ: thiếu file config, thiếu đường dẫn dự án).

## 5. Prompt mang tính "Bức ép" (Aggressive Prompts)
- **Dấu hiệu**: Dùng nhiều từ in hoa "MUST", "DO NOT", "NEVER" nhưng thiếu giải thích nguyên lý (Why).
- **Rủi ro**: LLM (Large Language Model) thường bị over-constrained (bị kìm kẹp quá mức), dẫn đến việc từ chối trả lời (refusal) hoặc phản hồi cứng nhắc, mất đi khả năng sáng tạo.
- **Cách khắc phục**: Chuyển từ "Cấm làm X" sang "Chỉ làm X khi Y, vì Z". Cung cấp `examples` cụ thể thay vì cấm đoán suông.
