# V8.2 Roadmap: Self-Improving Agent System

## Triết lý cốt lõi (Core Philosophy)
**Self Improving = Self Optimizing, NOT Self Modifying.**
- Hệ thống đóng vai trò **Analytics + Proposal Engine**.
- AI phân tích, đề xuất cải tiến và tối ưu hóa.
- Quá trình phê duyệt (Approval) và thăng hạng (Promotion) bắt buộc phải có sự tham gia của con người (Human-in-the-loop) để giữ vững tính toàn vẹn của Governance.

### V8.2 KHÔNG ĐƯỢC PHÉP:
❌ Agent tự tạo skill vô hạn.
❌ Agent tự sửa nội dung của stable skill.
❌ Agent tự động promote skill (experimental -> stable).
❌ Agent tự ý thay đổi Schema của hệ thống.

---

## 4 Khoảng trống Kiến trúc cần giải quyết (Architecture Gaps)

1. **Human Feedback Loop**: Kết nối đánh giá của con người (correction, rating, failure report) vào trong trọng số định tuyến (routing weight) và ưu tiên của skill.
2. **Skill Version Compatibility**: Quản lý phiên bản chặt chẽ hơn (ví dụ: `requires: schema: 8.1`, `compatible_with: workflows: [...]`) để đảm bảo quá trình tự tiến hóa không làm vỡ các dependency.
3. **Agent Decision Memory**: Khả năng ghi nhớ và học hỏi từ các Pattern ra quyết định trong quá khứ (không chỉ là thông tin dự án, mà là vì sao skill A được chọn thay vì B trong một ngữ cảnh cụ thể).
4. **Skill Health Score**: Cấp độ sức khỏe đa chiều của skill (quality, usage, conflict, freshness) dẫn đến tổng điểm (overall) dùng làm tín hiệu cảnh báo hoặc tối ưu hóa.

---

## Lộ trình Triển khai (Execution Phases)

### Phase 1: Intelligence Layer
- **Mục tiêu**: Đo lường và thu thập số liệu.
- **Triển khai**: Thêm `qk-agent-analytics` (không phải user-facing skill) tập trung vào: routing accuracy, skill usage, failure patterns, conflict frequency.

### Phase 2: Feedback Loop
- **Mục tiêu**: Xây dựng cấu trúc lưu trữ và phân tích phản hồi.
- **Triển khai**: Bổ sung thư mục `feedback/` bao gồm:
  - `raw/` (dữ liệu thô từ hệ thống/con người)
  - `analyzed/` (kết quả phân tích)
  - `proposals/` (đề xuất cải tiến)

### Phase 3: Skill Optimization Workflow
- **Mục tiêu**: Chu trình đề xuất cải tiến khép kín.
- **Triển khai**: `observe -> detect weakness -> generate proposal -> evaluation -> human approve -> promote`.

### Phase 4: Predictive Governance
- **Mục tiêu**: Hệ thống tự động cảnh báo nguy cơ kiến trúc.
- **Triển khai**: Graph kết hợp Analytics để phát hiện (Ví dụ: `qk-ui-builder conflict ↑ 40% -> Potential boundary overlap detected -> Recommend review`).
