# V8.2 Roadmap: Self-Improving Agent System

## Triết lý cốt lõi (Core Philosophy)
**Self Improving = Self Optimizing, NOT Self Modifying.**
- Hệ thống đóng vai trò **Analytics + Proposal Engine**.
- AI phân tích, đề xuất cải tiến và tối ưu hóa.
- Quá trình phê duyệt (Approval) và thăng hạng (Promotion) bắt buộc phải có sự tham gia của con người (Human-in-the-loop) để giữ vững tính toàn vẹn của Governance.

### V8.2 KHÔNG ĐƯỢC PHÉP (Anti-patterns):
❌ Agent tự tạo skill vô hạn.
❌ Agent tự sửa nội dung của stable skill.
❌ Agent tự động promote skill (experimental -> stable).
❌ Agent tự ý thay đổi Schema hoặc Routing weight.

---

## Kiến trúc V8.2 (The Self-Improving Control Loop)

Chu trình V8.2 sẽ hoạt động theo luồng sau:
1. **Agent Execution**: Thực thi nhiệm vụ.
2. **Decision Trace**: Ghi nhận lại bối cảnh ra quyết định.
3. **Observability**: Giám sát hệ thống.
4. **Analytics Engine**: Phân tích dữ liệu.
5. **Skill Health Score**: Đánh giá sức khỏe tổng thể.
6. **Improvement Proposal**: Đề xuất tối ưu.
7. **Human Approval**: Con người phê duyệt.
8. **Promotion Gate**: Cập nhật hệ thống.

---

## Các Module cốt lõi của V8.2

Thay vì mở rộng Capability, V8.2 tập trung xây dựng Intelligence Layer:

### 1. `qk-agent-analytics`
- **Vai trò**: Phân tích dữ liệu (không viết code).
- **Trọng tâm**: Routing accuracy, failure rates, conflict frequency.

### 2. `qk-skill-optimizer`
- **Vai trò**: Sinh đề xuất cải tiến.
- **Ví dụ**: Phát hiện `qk-ui-builder` lỗi A11y 12% -> Đề xuất "Add accessibility checklist". Không tự động sửa file `SKILL.md`.

### 3. `qk-decision-memory`
- **Vai trò**: Ghi nhớ "Vì sao chọn Skill này?" (Pattern-based memory).
- **Ví dụ**: Lưu trữ Candidate Scores và lý do (Reasoning) để học hỏi cho các lần routing sau, thay vì chỉ nhớ kết quả cuối cùng.

---

## 4 Khoảng trống Kiến trúc cần giải quyết (V8.2 Targets)

1. **Human Feedback Loop**: Kết nối đánh giá của con người (correction, rating, failure report) vào trong trọng số định tuyến (routing weight) và ưu tiên của skill.
2. **Skill Version Compatibility**: Quản lý phiên bản chặt chẽ hơn (ví dụ: `requires: schema: 8.1`, `compatible_with: workflows: [...]`) để đảm bảo quá trình tự tiến hóa không làm vỡ các dependency.
3. **Skill Benchmarking & Health Score**: Cấp độ sức khỏe động của skill (quality, usage, conflict, freshness). Ví dụ: Benchmark frontend với React (92), A11y (88), Performance (90).
4. **Capability Knowledge Graph**: Nâng cấp capability-graph từ "static edges" sang chứa metadata động (success_rate, avg_latency, monthly_calls).

---

## Tầm nhìn V8.3+: Enterprise Multi-Agent (Deferred Domains)

Để tránh lặp lại sai lầm "nhiều skill, thiếu governance" của V7, các domain dưới đây được **khóa lại** và không phát triển trong V8.2. Chúng sẽ là nền tảng cho V8.3:

1. **Product Management (`qk-product-strategy`)**: Ưu tiên, roadmap, market, user (khác với `qk-product-specification` chỉ làm Idea -> Spec).
2. **Backend Architecture (`qk-backend-architecture`)**: Phân định service boundary, architecture style, scalability (tách biệt với API lifecycle).
3. **Cloud Architecture (`qk-cloud-architecture`)**: AWS/GCP/Azure, networking, cost (ủy quyền triển khai cho `qk-devops-platform`).
4. **AI Engineering (`qk-ai-engineering`)**: Quản trị AI system, LLM architecture, RAG, prompt evaluation (bù đắp phần còn thiếu của AI System Management).
