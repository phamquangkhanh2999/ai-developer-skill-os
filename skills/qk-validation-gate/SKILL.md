---
name: qk-validation-gate
purpose: Cổng kiểm định chất lượng bắt buộc (Test, Lint, Security) trước khi hoàn tất.
mode_supported: [standard]
input: [Completed code]
output: [Validation pass/fail]
workflow: [1. Run Tests -> 2. Linting -> 3. Security Scan -> 4. Handoff if PASS]
allowed_tools: [run_command]
handoff_to: [qk-docs]
---

# 🛠️ qk-validation-gate - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Cổng kiểm định chất lượng bắt buộc (Test, Lint, Security) trước khi hoàn tất.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-docs`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.
