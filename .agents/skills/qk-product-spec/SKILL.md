---
name: qk-product-spec
version: 10.1.0
status: stable
subtitle: "Viết Spec & PRD"
description: "Chuyển hóa ý tưởng sơ khai thành đặc tả kỹ thuật chuẩn mực: PRD, Acceptance Criteria (BDD Given/When/Then), Gap Analysis và Đánh giá tính khả thi. Dùng khi: viết spec, viết PRD, phân tích yêu cầu, acceptance criteria, user story, bdd, gherkin, gap analysis, feasibility, đánh giá rủi ro, clarify requirements — TUYỆT ĐỐI KHÔNG dùng để trực tiếp viết code tính năng (dùng qk-feature-delivery)."
tools:
  - filesystem
rules:
  - global
  - coding-standards
workflow: spec-driven-development
triggers:
  - "viết spec"
  - "viết prd"
  - "đặc tả kỹ thuật"
  - "acceptance criteria"
  - "user story"
  - "bdd"
  - "gherkin"
  - "gap analysis"
  - "feasibility"
  - "clarify requirements"
---

# qk-product-spec — Viết Spec & PRD (Product Spec & Feasibility Engine)

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** Right-size the specification. Do not write a 20-page enterprise PRD for a 10-line UI tweak. Scale the spec depth proportionally to the project risk and complexity.
> **Verification Principle:** PASS is a verified conclusion, never an assumption. Feasibility must be proven.

### 🛡️ Anti-Overengineering Rule (QUY MÔ HÓA TÀI LIỆU)
- **Tương xứng quy mô (Proportional Spec):**
  - *Task nhỏ (Thêm nút, sửa filter):* Chỉ cần 1-2 kịch bản BDD và mô tả delta API. Tuyệt đối không vẽ ra tài liệu dài dòng.
  - *Tính năng lớn (Module mới, luồng thanh toán):* Viết PRD hoàn chỉnh kèm Gap Analysis và User Journey.
- **Dựa trên thực tế codebase:** Không thiết kế spec dựa trên các công nghệ giả định. Mọi đề xuất về models, API contracts phải đối chiếu với codebase hiện có.

### 🔒 Laser Focus & Anti-Scope Creep (R-G-13)
- Chỉ tập trung vào đúng bài toán nghiệp vụ hiện tại.
- **CẤM** tự vẽ ra 10 tính năng tương lai "để dành" nếu MVP chưa cần (Tuân thủ nghiêm ngặt YAGNI).

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO - R-G-14.7)
- **Không giả định tính khả thi:** Nếu đề xuất dùng một thư viện ngoài hoặc service mới, phải kiểm tra khả năng tích hợp và giấy phép trước khi kết luận "Khả thi 100%".
- Nếu chưa đối chiếu được với API thực tế: ghi rõ `Status: NOT VERIFIED / Cần PoC`.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- Làm rõ các quyết định còn mơ hồ thông qua phỏng vấn chủ động (gợi ý dùng slash command `/grill-me`).
- Soạn thảo Acceptance Criteria chuẩn Gherkin (`Given / When / Then`) bao phủ Happy Path và Edge Cases.
- Khảo sát khoảng cách kỹ thuật (Gap Analysis): Chỉ rõ phần nào tái sử dụng được, phần nào cần viết mới.
- Khởi tạo artifact `implementation_plan.md` với `RequestFeedback: true` cho Antigravity khi hoàn tất đặc tả cho tính năng lớn. Ngoại lệ: task nhỏ dưới 1 file thì xuất spec ngắn gọn trong chat mà không cần chặn modal.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Trực tiếp viết code triển khai tính năng vào codebase → Chuyển sang `qk-feature-delivery` sau khi spec được duyệt.

---

## 3. Quy Trình Đặc Tả Tuần Tự (Sequential Procedure)

```
[Bước 1: Triage & Clarify]    ── Xác định quy mô (Nhỏ/Vừa/Lớn), kích hoạt /grill-me nếu thiếu thông tin
            │
            ▼
[Bước 2: Codebase Gap Scan]   ── Đối chiếu models & APIs hiện có trong repo để đánh giá khả thi
            │
            ▼
[Bước 3: BDD Spec Writing]    ── Viết tiêu chí Given/When/Then rõ ràng không mơ hồ
            │
            ▼
[Bước 4: Implementation Plan] ── Tạo implementation_plan.md, kích hoạt modal [Proceed] chờ duyệt
```

---

## 4. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi viết Spec & PRD | Đầu ra mong đợi |
|---|---|---|
| `pm` | Giá trị người dùng, scope MVP vs V2, user flow, metric thành công | PRD tổng thể, User Stories, Edge cases nghiệp vụ |
| `ba` | Quy tắc nghiệp vụ (Business Rules), mô hình dữ liệu quan hệ | Bảng ma trận nghiệp vụ, Data dictionary |
| `fullstack` | API schema (Request/Response), Shared types, component hierarchy | Contract-first API spec, Zod/Pydantic schemas |
| `qa` | Kịch bản kiểm thử biên, tiêu chí nghiệm thu tự động hóa | Bộ kịch bản BDD hoàn chỉnh, Boundary matrix |

---

## 5. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
📋 Product Specification Summary                    [Role: <role> | Feature: <Tên tính năng>]
─────────────────────────────────────────────────────────────────────
Quy mô đặc tả:      [Nhỏ / Vừa / Lớn — Đã tối ưu độ dài theo YAGNI]
Đánh giá khả thi:   [Khả thi 100% trên codebase hiện tại / Cần thêm dependency]

Khoảng cách kỹ thuật (Gap Analysis):
  • Tái sử dụng:    [Các services/components hiện có thể dùng lại]
  • Cần viết mới:   [N endpoints, N tables/columns, N components]

Tiêu chí nghiệm thu cốt lõi (BDD Gherkin):
  • [Scenario 1]: Given ... When ... Then ...
  • [Scenario 2]: Given ... When ... Then ...

📄 Kế hoạch triển khai:
  Đã khởi tạo artifact: [implementation_plan.md](file:///C:/Users/qkhanh/.gemini/antigravity-ide/brain/f7ef21b2-6e3e-4177-a422-5ddcad5a5843/implementation_plan.md)
  👉 Hãy xem lại kế hoạch và bấm [Proceed] để bắt đầu viết code.
```
