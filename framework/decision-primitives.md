# 🧩 Bảng Tuần Hoàn: Decision Primitives (v6.0)

Rule-Skins v6 không coi các Agent là những "con người ảo" (Personas), mà coi chúng là những **Cỗ máy Ra Quyết định (Decision Engines)**.
Mọi hành vi phức tạp của bất kỳ Agent nào trong hệ thống đều được cấu thành từ sự lắp ghép của **6 Decision Primitives** cốt lõi dưới đây.

---

## 1. 🧲 Collect (Thu thập)
- **Bản chất:** Đi tìm kiếm thông tin, tải bối cảnh từ bên ngoài vào bộ nhớ.
- **Trigger:** Thiếu context hoặc nhận một task yêu cầu đọc dữ liệu.
- **Evidence Required:** Quyền truy cập repository, cấu trúc file, URL.
- **Ví dụ Skills:** `qk-context-loader`, bước đầu của `qk-bug-resolution`.

## 2. 🩺 Diagnose (Chẩn đoán)
- **Bản chất:** Phân tích một triệu chứng (symptom) dựa trên bằng chứng để tìm ra nguyên nhân gốc rễ (root cause).
- **Trigger:** Có lỗi (Bug report, error log, test failure).
- **Evidence Required:** Stack trace, logs, test output.
- **Ví dụ Skills:** `qk-bug-resolution`, `qk-project-health`.

## 3. 🗺️ Plan (Lập Kế hoạch)
- **Bản chất:** Vạch ra một lộ trình các bước cần làm trước khi trực tiếp nhúng tay vào việc.
- **Trigger:** Yêu cầu một tính năng mới hoặc một nhiệm vụ quá phức tạp để làm một bước.
- **Evidence Required:** Yêu cầu (Requirements), Specs, Architecture.
- **Ví dụ Skills:** `qk-feature-delivery`, `qk-api-lifecycle`.

## 4. ⚖️ Evaluate (Đánh giá)
- **Bản chất:** Đối chiếu một sản phẩm (artifact) có sẵn với một tiêu chuẩn (standard/policy) để đưa ra phán quyết (Pass/Fail) hoặc gợi ý sửa đổi.
- **Trigger:** Một đoạn code mới, một bản thiết kế, một PR.
- **Evidence Required:** Artifact cần review, Guidelines, Linter rules.
- **Ví dụ Skills:** `qk-engineering-standard`, `qk-validation-gate`, `qk-ui-audit`.

## 5. 🛠️ Execute (Thực thi)
- **Bản chất:** Trực tiếp sửa đổi trạng thái hệ thống (viết code, xóa file, sửa file).
- **Trigger:** Đã có kế hoạch rõ ràng hoặc đã xác định xong lỗi.
- **Evidence Required:** Codebase hiện tại, Kế hoạch.
- **Ví dụ Skills:** `qk-feature-delivery` (bước sau), `qk-ui-builder`.

## 6. 🚦 Delegate / Govern (Điều phối / Quản trị)
- **Bản chất:** Không trực tiếp làm việc, mà làm nhiệm vụ định tuyến (routing) công việc cho Agent khác hoặc kiểm soát quyền (deny/allow) dựa trên luật lệ.
- **Trigger:** Nhận task không thuộc chuyên môn, hoặc nhận yêu cầu xác thực quyền hạn.
- **Evidence Required:** Danh sách các Skills khác, Policies (RBAC/ABAC).
- **Ví dụ Skills:** `qk-orchestrator`, `qk-access-policy`.

---

> **Nguyên tắc Thiết kế Hệ thống:** 
> Khi tạo một Skill mới, đừng cố gắng mô tả "tính cách" của nó. Hãy tự hỏi: *Nó cần dùng những Primitives nào để hoàn thành nhiệm vụ?*

