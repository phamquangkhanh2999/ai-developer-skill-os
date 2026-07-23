# ADR 008: Skill Boundary Review (V8.1.3)

## Tiêu đề
Định hướng tương lai cho ranh giới của `qk-validation-gate` và `qk-ai-builder`.

## Bối cảnh
Trong quá trình hoàn thiện Agent Engineering OS (V8.1.3), quá trình kiểm toán phát hiện rằng một số skill ban đầu có phạm vi hoạt động (scope) quá rộng hoặc chưa phân vai rõ ràng, dễ dẫn đến conflict. Tuy nhiên, để không làm vỡ kiến trúc (scope creep) trong giai đoạn chốt Control Plane, chúng ta quyết định giữ nguyên nhưng ghi chú định hướng cho V8.2.

## Quyết định

### 1. Về `qk-validation-gate`
- **Hiện trạng:** Đang đóng vai trò validation coordinator.
- **Định hướng (V8.2):** Sẽ được định hình rõ thành `release decision orchestrator`.
- **Ranh giới tương lai:** Không trực tiếp chạy test, không trực tiếp scan security, không audit quality. Nhiệm vụ của nó là tổng hợp kết quả từ `qk-test-engineering`, `qk-security-audit`, và `qk-web-quality-gate` để ra quyết định cuối cùng (gate decision).

### 2. Về `qk-ai-builder`
- **Hiện trạng:** Đang quá rộng (gồm cả frontend AI apps, general AI coding, prompt writing...).
- **Định hướng (V8.2):** Đổi tên (rename semantic) thành `qk-agent-platform-engineering`.
- **Ranh giới tương lai:**
  - **Owns:** agent architecture, MCP integration, skill generation, agent runtime patterns.
  - **Does not own:** frontend AI apps, general AI coding, prompt writing.

## Trạng thái
Đề xuất được chấp nhận (Deferred to V8.2).

## Hệ quả
Ngăn chặn các kỹ năng này bị phình to trong quá trình triển khai thực tế. Chuẩn bị sẵn sàng cấu trúc cho giai đoạn V8.2 (Self-Improving Agent).
