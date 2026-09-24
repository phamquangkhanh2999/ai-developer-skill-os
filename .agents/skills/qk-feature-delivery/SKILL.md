---
name: qk-feature-delivery
version: 10.1.0
status: stable
subtitle: "Build Feature mới"
description: "Phát triển tính năng mới end-to-end: Thiết lập Contract kiểu dữ liệu, tích hợp gọi API, xử lý trọn vẹn 4 trạng thái UI (Loading/Success/Empty/Error) và tuân thủ YAGNI/SOLID. Dùng khi: add feature, phát triển tính năng mới, tạo mới, build new, thêm chức năng, tích hợp api, fetch data, consume api, bind data, state management — TUYỆT ĐỐI KHÔNG dùng cho việc fix bug (dùng qk-bug-resolution) hoặc dọn dẹp code cũ (dùng qk-code-cleaner)."
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - safety
workflow: feature-delivery
triggers:
  - "add feature"
  - "phát triển tính năng mới"
  - "tạo mới tính năng"
  - "build new feature"
  - "thêm chức năng"
  - "tích hợp api"
  - "consume api"
  - "bind data"
  - "state management"
---

# qk-feature-delivery — Build Feature mới (End-to-End Delivery Engine)

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** YAGNI (You Aren't Gonna Need It). Build the simplest, cleanest solution that fully satisfies today's requirement. Do not write tomorrow's abstractions today.
> **Verification Principle:** PASS is evidence, not an objective. Never claim pass without concrete execution proof.

### 🛡️ Anti-Overengineering Rule (CẤM VẼ VOI)
- **Không tạo kiến trúc cồng kềnh cho tính năng đơn giản:** Nếu một tính năng chỉ cần 1 endpoint và 1 component, TUYỆT ĐỐI KHÔNG tạo ra cả một hệ thống 5 tầng (không Factory, không Adapter, không 3 lớp Repository trung gian) nếu dự án chưa yêu cầu.
- **Tận dụng tối đa code có sẵn:** Tái sử dụng các hooks, UI components, và utilities đang chạy tốt trong repo. Tránh viết lại những gì đã tồn tại.

### 🔒 No Unrelated Changes Rule (CẤM SỬA LAN MAN)
Chỉ sửa các file, dependencies, cấu hình và code paths thực sự cần thiết trực tiếp cho tính năng được yêu cầu:
- **CẤM** reformat hoặc format lại các file không liên quan.
- **CẤM** đổi tên biến, hàm, hoặc file ngoài phạm vi tính năng.
- **CẤM** tự tiện nâng cấp thư viện hoặc sửa build script lân cận.
- **CẤM** "tiện tay" refactor hoặc clean up code xung quanh nếu người dùng không yêu cầu.
- Nếu phát hiện vấn đề hoặc code smell ngoài phạm vi: **Chỉ ghi nhận vào báo cáo tổng kết**, tuyệt đối không tự ý chạm vào.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO)
- **Kiểm tra build và types thật:** Phải chạy `tsc --noEmit`, linter, hoặc build check trước khi tuyên bố tính năng hoàn thành.
- **Phân định rõ bằng chứng (Evidence-Based Status):**
  - `PASS`: Đã chạy lệnh kiểm tra thực tế và kết quả đạt yêu cầu.
  - `FAIL`: Đã chạy và phát hiện lỗi.
  - `BLOCKED`: Không thể chạy do thiếu database/staging/external service.
  - `NOT RUN / PARTIAL`: Chưa chạy lệnh hoặc chỉ mới kiểm tra tĩnh (Cần ghi rõ: *"Trạng thái: Đã bind code logic & types. Cần user test giao diện trực tiếp trên trình duyệt"*).
  - **TUYỆT ĐỐI KHÔNG CHUYỂN BLOCKED/NOT RUN THÀNH PASS!**

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Scoped Contract-First Implementation:** Đối với các tính năng có tương tác dữ liệu ngoài, API boundaries, database persistence, hoặc untrusted input: BẮT BUỘC định nghĩa Types/DTOs và Validation Schemas (Zod/Pydantic) trước logic nghiệp vụ. Với UI nội bộ (button, modal, local UI state), không ép buộc sinh schema nếu không có ranh giới dữ liệu.
- **UI State Rule (Không tạo Empty giả tạo):**
  - **Data-fetching views (Danh sách / màn hình tải dữ liệu):** BẮT BUỘC xử lý đủ 4 trạng thái: `Loading (Skeleton loader)`, `Success (Render data)`, `Empty (Minh họa ngữ cảnh + Nút Call-to-action)`, và `Error (Message lỗi + Nút Thử Lại/Retry)`.
  - **Mutations & Actions (Login, logout, xóa item, upload file, submit form):** Xử lý các trạng thái tương tác phù hợp thực tế: `Idle`, `Submitting/Pending`, `Success`, và `Error`. TUYỆT ĐỐI KHÔNG tạo `Empty state` giả tạo cho các hành động không có ý nghĩa danh sách rỗng.
- **Planning Gate & Exceptions:** Với tính năng mới ảnh hưởng ≥ 2 files hoặc tác động kiến trúc, BẮT BUỘC lập `implementation_plan.md` với `RequestFeedback: true` và dừng lại chờ phê duyệt trước khi tạo/sửa files.
  - **Ngoại lệ bỏ qua Planning Gate:**
    - Thay đổi chỉ nằm trong đúng 1 file (Single-file change).
    - Chỉnh sửa UI/text đơn giản (Trivial UI/text change).
    - Thay đổi thuần tài liệu (Documentation-only).
    - Người dùng chỉ định rõ ràng yêu cầu thực thi ngay lập tức mà không cần qua gate.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Điều tra các lỗi crash cũ có sẵn từ trước trong codebase → Chuyển sang `qk-bug-resolution`.
- Tự tiện thay đổi cấu trúc bảng cơ sở dữ liệu lớn → Chuyển sang `qk-backend-data`.
- Tái cấu trúc các module cũ không liên quan đến feature → Chuyển sang `qk-code-cleaner`.

---

## 3. Quy Trình Phát Triển 4 Bước Tuần Tự (Sequential Procedure)

```
[Bước 1: Contract & Plan]    ── Định nghĩa Types/Schemas (nếu có API/DB), lập plan (nếu ≥ 2 files)
            │
            ▼
[Bước 2: Service & Logic]    ── Xây dựng API Caller & State Handler (caching chỉ khi cần thiết)
            │
            ▼
[Bước 3: UI & State Bind]    ── Gắn Component, Skeleton (nếu fetching), Action feedback (nếu mutation)
            │
            ▼
[Bước 4: Verification Gate] ── Chạy Typecheck/Lint thật. Nếu FAIL ──► Kích hoạt Failure Path
```

### Chi tiết các bước:
1. **Contract & Plan:** Thiết lập interface chuẩn cho request/response hoặc persistence model. Lập kế hoạch các files sẽ tạo mới (nếu đa file).
2. **Service & Logic:** Viết hàm gọi API độc lập với component, xử lý lỗi có ngữ cảnh. Chỉ tích hợp caching, state store hoặc optimistic updates khi tính năng hoặc kiến trúc dự án thực sự yêu cầu.
3. **UI & State Bind:** Gắn dữ liệu vào JSX/Template. Đảm bảo Skeleton loader không làm nhảy giật layout (chống CLS). Đảm bảo action có loading spinner/disable button chống double-submit.
4. **Verification Gate:** Kiểm tra type-check và lint thực tế. Xác minh không vi phạm nguyên tắc YAGNI hay sinh ra God file (> 300 dòng).

---

## 4. Xử Lý Sự Cố Khi Build Gãy & Cấm Ép Pass (Failure Path Protocol)

Nếu trong quá trình triển khai gặp lỗi biên dịch, lint, hoặc kiểm thử:
1. **Dừng lại ngay (Failure Analysis Gate):** Không tiếp tục viết thêm code nếu tầng Contract hoặc Types đang bị đỏ.
2. **Xác định Root Cause:** Đọc call-stack và thông báo lỗi thực tế để tìm nguyên nhân gốc rễ.
3. **CẤM CHE GIẤU LỖI (Zero Workarounds):**
   - CẤM dùng `as any` hoặc `@ts-ignore` / `@ts-expect-error` để né lỗi type.
   - CẤM disable linter rule hoặc comment bỏ qua lint.
   - CẤM dùng `catch (e) {}` rỗng để nuốt lỗi cho code khỏi crash.
   - CẤM sửa hoặc làm yếu assertion của test case chỉ để ép pass.
4. **Revert có kiểm soát:** Nếu bước làm trước đó làm gãy toàn bộ build của dự án:
   ```bash
   git restore <các_file_vừa_tạo_hoặc_sửa>
   ```
5. **Báo cáo Blocked:** Nếu thiếu endpoint từ phía backend hoặc thiếu dữ liệu bắt buộc từ 3rd party, dừng lại và thông báo rõ contract bị thiếu cho user với trạng thái `Status: BLOCKED`.

---

## 5. Mẫu Kế Hoạch Chuẩn (Implementation Plan Skeleton)

Khi khởi tạo `implementation_plan.md`:

```markdown
# Implementation Plan: [Tên Tính Năng Mới]

## 1. Yêu cầu & Trải nghiệm người dùng
- Tính năng: [Mô tả ngắn gọn giá trị mang lại]
- Điểm chạm UI: [Vị trí màn hình / nút bấm mới]

## 2. Hợp đồng dữ liệu (API / Boundary Contract)
- Endpoint: `POST /api/v1/orders` (hoặc N/A nếu thuần UI)
- Input Schema: `{ items: Array<{ id: string, quantity: number }> }`
- Output Schema: `{ orderId: string, totalAmount: number, status: string }`

## 3. Danh sách files sẽ thay đổi (Laser Focus)
- [ ] [NEW] [types.ts](file:///<workspace-root>/src/types/...): Khai báo models & Schema
- [ ] [NEW] [useOrderService.ts](file:///<workspace-root>/src/services/...): API caller
- [ ] [NEW] [OrderForm.tsx](file:///<workspace-root>/src/components/...): Component UI

## 4. Kiểm soát trạng thái UI
- Data Fetching: Loading (Skeleton) | Success | Empty (CTA) | Error (Retry)
- Hoặc Mutation: Idle | Submitting (Spinner) | Success (Redirect/Toast) | Error (Alert)
```

---

## 6. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi Build Feature | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `frontend` | Component hierarchy, Accessibility, responsive layout, interaction feedback | Tạo custom hook quản lý state, tái sử dụng component có sẵn, skeleton loader |
| `backend` | API route handler, controller, business domain service, query DB | Áp dụng input validation middleware, dependency injection, unit test service |
| `fullstack` | Đồng bộ 100% từ Database đến giao diện người dùng | Tạo migration nhỏ (nếu cần), tạo endpoint, sinh types, bind vào UI component |
| `data` | Ingestion job mới, schema validation, data pipeline task | Tạo incremental dbt model, thêm schema test trong `.yml`, SLA logging |
| `devops` | Cấu hình biến môi trường mới, service connection, helm values | Cập nhật `.env.example`, thêm secret config, healthcheck endpoint |

---

## 7. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🚀 Feature Delivery Summary                           [Role: <role> | Feature: <Tên tính năng>]
─────────────────────────────────────────────────────────────────────
Phạm vi thực tế:    [N files created / modified]
Trạng thái:         [Hoàn thành sẵn sàng test | Cần cấu hình thêm env | BLOCKED]

Các tệp mã nguồn mới/sửa đổi:
  • [NEW] [TênFile.tsx](file:///<workspace-root>/path): [Mô tả vai trò]

Kiểm soát trạng thái giao diện:
  • Fetching:  [Loading / Success / Empty / Error] hoặc [N/A]
  • Mutation:  [Idle / Submitting / Success / Error] hoặc [N/A]

Kiểm chứng thực tế (Verify Before Claim):
  • Type-check: [tsc Clean / mypy Pass / Chưa chạy (Nêu lý do)]
  • Lint check: [0 errors / Chưa chạy]
  • YAGNI:      ✅ Giữ giải pháp tối giản, không sinh abstraction thừa
  • Zero Hack:  ✅ Không dùng any, @ts-ignore, hay silent catch
```
