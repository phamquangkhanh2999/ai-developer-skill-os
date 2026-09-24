---
name: qk-code-cleaner
version: 10.1.0
status: stable
subtitle: "Refactor & Viết Test"
description: "Kỹ nghệ Tái cấu trúc (Zero Behavior Change), Nâng cấp thư viện an toàn có Rollback và Xây dựng lưới kiểm thử tự động. Dùng khi: refactor code, tái cấu trúc hàm/file, extract function/hook, clean code, giảm độ phức tạp cyclomatic, nâng cấp dependency package, audit breaking changes, viết unit/integration test — TUYỆT ĐỐI KHÔNG dùng khi chỉ sửa bug đơn lẻ (dùng qk-bug-resolution) hoặc build tính năng mới (dùng qk-feature-delivery)."
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
  - safety
workflow: refactor
triggers:
  - "refactor"
  - "tái cấu trúc"
  - "tách file quá dài"
  - "extract function"
  - "extract hook"
  - "clean code"
  - "giảm complexity"
  - "nâng cấp thư viện"
  - "upgrade package"
  - "migrate framework"
  - "cập nhật dependency"
  - "viết unit test"
  - "viết test"
  - "integration test"
  - "test strategy"
---

# qk-code-cleaner — Refactor & Viết Test (Modernization & Test Safety Engine)

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** Metrics are signals, not goals. Never refactor code merely to satisfy a metric. Optimize for maintainability, correctness, testability, and minimal risk.
> **Verification Principle:** PASS is a verified conclusion, never a target. Zero workarounds.

### 🛡️ Anti-Overengineering Rule (BẮT BUỘC TUÂN THỦ)
- **Cấm trừu tượng hóa quá đà:** Tuyệt đối KHÔNG tự ý tạo Design Patterns phức tạp (Abstract Factory, Decorator, Strategy...), Interfaces tầng tầng lớp lớp, Generic Wrappers, hay Custom Hooks nếu không mang lại lợi ích cụ thể, thực tế và rõ ràng cho việc đọc hiểu hoặc kiểm thử.
- **Ưu tiên giải pháp tối thiểu:** Luôn chọn sự thay đổi cấu trúc nhỏ nhất (smallest structural change) mà giải quyết được vấn đề bảo trì. 3 dòng code tường minh tốt hơn 30 dòng code pattern trừu tượng.
- **Không chạm vào code đang chạy tốt:** Nếu một đoạn code dài nhưng mạch lạc, có tính bao đóng tốt và không có yêu cầu thay đổi, KHÔNG ĐƯỢC phép xé nhỏ nó chỉ để chạy theo chỉ tiêu số dòng.

### 🔒 No Unrelated Changes Rule (CẤM SỬA LAN MAN)
- Chỉ sửa các file, hàm hoặc package nằm trong phạm vi tái cấu trúc được yêu cầu.
- **CẤM** reformat hoặc format lại các file lân cận không thuộc scope.
- **CẤM** đổi tên biến, signature hàm của các module khác ngoài phạm vi.
- Nếu phát hiện code smell hoặc vấn đề ngoài scope: **Chỉ ghi nhận vào báo cáo**, tuyệt đối không tự ý chạm vào.

### 🛡️ Anti-Fake-Pass Rule (CẤM ÉP PASS ẢO - R-G-14.5)
- **CẤM** dùng `as any`, `@ts-ignore`, hoặc `@ts-expect-error` để giấu lỗi type sau khi refactor.
- **CẤM** làm yếu assertions (weakening assertions), xóa test case hoặc skip test đang fail chỉ để test suite xanh.
- **CẤM** dùng `catch (e) {}` rỗng để nuốt ngoại lệ.

### ⚖️ Verify Before Claim Rule (CHỐNG BỐC PHÉT DỮ LIỆU)
- **Chạy lệnh trước khi báo cáo:** Tuyệt đối **KHÔNG ĐƯỢC** tuyên bố "Tests pass", "Types clean", "Build successful", hay "Zero behavior change" nếu chưa thực sự thực thi các câu lệnh kiểm chứng trong terminal (`npm test`, `pytest`, `tsc --noEmit`).
- **Trung thực khi không chạy được:** Nếu môi trường thiếu dependencies, thiếu database test, hoặc lệnh test không khả dụng, AI **BẮT BUỘC** ghi rõ: `"Trạng thái: NOT VERIFIED — Chưa kiểm chứng bằng lệnh thực tế (Cần user verify thủ công)"`. Cấm bịa đặt số lượng test hay kết quả 100% ảo.

---

## 2. Ranh Giới & Tiêu Chí Phân Định (Decision Rules)

### Khi nào CẦN và KHÔNG CẦN can thiệp:
1. **File dài (> 300 dòng):**
   - *Hướng dẫn:* File vượt quá 300 dòng **phải được xem xét (reviewed for decomposition)**, nhưng CHỈ BẮT BUỘC TÁCH khi file có quá nhiều trách nhiệm (vi phạm SRP), logic lộn xộn, hoặc khó kiểm thử.
   - *Ngoại lệ:* Schema files, DTOs, configurations, code sinh tự động (generated code), hoặc component có cấu trúc đơn khối rõ ràng thì 400-500 dòng vẫn được phép giữ nguyên.
2. **Hàm dài (> 40 dòng) & Nesting sâu (> 3 tầng):**
   - Áp dụng **Guard Clauses (Early Return)** để triệt tiêu các khối `if/else` lồng nhau.
   - Tách các đoạn logic tính toán phức tạp thành các Pure Helper Functions độc lập.
3. **Chiến lược Test Pyramid (Target Guideline):**
   - *Định hướng:* Ưu tiên kim tự tháp kiểm thử nghiêng về Unit Tests (chạy nhanh, cô lập), kế đến là Integration Tests, và số ít E2E Tests trọng yếu.
   - *Tính linh hoạt:* Tỷ lệ 70/20/10 là mục tiêu tham chiếu (Guideline), không phải giáo điều bắt buộc. Tùy thuộc vào bản chất dự án (CRUD, Data pipeline hay UI library) mà điều chỉnh tỷ lệ phù hợp.

### Planning Gate & Exceptions:
- Với tác vụ thay đổi ≥ 2 files hoặc nâng cấp major package, BẮT BUỘC lập `implementation_plan.md` với `RequestFeedback: true` và dừng lại chờ phê duyệt.
- **Ngoại lệ bỏ qua Planning Gate:**
  - Tái cấu trúc chỉ nằm trong duy nhất 1 file (Single-file refactor).
  - Tinh chỉnh Guard Clauses nhỏ hoặc thêm type annotation đơn giản.
  - Người dùng chỉ định rõ ràng yêu cầu thực thi ngay lập tức.

### Ranh giới chuyển giao (Scope Handoff):
- ❌ Nếu phát hiện bug logic trong code cũ → Chuyển sang `qk-bug-resolution`.
- ❌ Nếu cần phát triển tính năng mới → Chuyển sang `qk-feature-delivery`.

---

## 3. Quy Trình Thực Thi Tuần Tự 5 Bước (Sequential Procedure)

Mọi tác vụ Tái cấu trúc / Nâng cấp / Viết test BẮT BUỘC tuân thủ đúng thứ tự:

```
[Bước 1: Baseline Check]      ── Chạy test/type hiện có, đo lường hiện trạng trước khi đụng vào code
            │
            ▼
[Bước 2: Safety Net Harness]  ── Nếu module chưa có test, viết Characterization Test bảo vệ hiện trạng
            │
            ▼
[Bước 3: Planning Gate]       ── Nếu sửa ≥ 2 files, tạo plan & chờ duyệt (trừ trường hợp ngoại lệ)
            │
            ▼
[Bước 4: Incremental Refactor]── Sửa từng bước nhỏ (Surgical), áp dụng Guard Clauses, bump từng pkg
            │
            ▼
[Bước 5: Verify or Rollback]  ── Chạy lại test thật. Nếu FAIL ──► Kích hoạt Failure Protocol (Revert ngay)
```

### Chi tiết từng bước:
- **Bước 1: Baseline Check:** Chạy bộ test hoặc type-check hiện có để biết hệ thống ban đầu xanh hay đỏ. Không refactor trên nền tảng đang bị gãy mà không báo trước cho user.
- **Bước 2: Safety Net Harness (Lưới an toàn):** Nếu code cũ không có test, hãy tạo một file test nhỏ kiểm chứng các đầu vào - đầu ra quan trọng hiện thời (Characterization Tests) trước khi đổi cấu trúc.
- **Bước 3: Planning Gate:** Nếu tác vụ thay đổi ≥ 2 files hoặc nâng cấp major package, tạo artifact `implementation_plan.md` với `RequestFeedback: true` theo mẫu ở Mục 5 và dừng lại chờ phê duyệt (trừ ngoại lệ).
- **Bước 4: Incremental Refactoring:**
  - Tái cấu trúc từng khối nhỏ một. Không sửa đồng loạt nhiều module.
  - Áp dụng Guard Clauses loại bỏ if lồng nhau.
- **Bước 5: Verification & Zero Behavior Change:**
  - Chạy lại test suite. Đối chiếu đầu ra đảm bảo 100% khớp với baseline.
  - CẤM mọi hành vi ép test pass bằng cách sửa assertion hay ép kiểu bẩn.

---

## 4. Xử Lý Sự Cố & Kế Hoạch Khôi Phục (Failure Path & Rollback)

### 🚨 Khi kiểm thử thất bại (Test Fail) hoặc Behavior bị sai lệch:
1. **Dừng ngay lập tức:** Không cố chấp viết thêm code "vá chằng vá đụp" lên đoạn refactor hỏng.
2. **Kích hoạt Revert Bước Vừa Làm:**
   ```bash
   # Nếu chỉ sửa 1 file:
   git checkout HEAD -- path/to/file.ts
   # Nếu đã sửa nhiều file trong workspace:
   git restore <các_file_vừa_sửa>
   ```
3. **Phân tích Delta (Nguyên nhân thất bại):** Xác định tại sao thay đổi nhỏ đó lại làm đổi behavior (Side-effect ngầm? Mutation ẩn? Thứ tự promise bị đảo lộn?).
4. **Hạ quy mô (Step-down):** Thử lại với bước tái cấu trúc nhỏ hơn một nửa. Nếu vẫn không an toàn, báo cáo dừng lại và giữ nguyên code gốc.

### 📦 Khi nâng cấp Package gặp xung đột (Dependency Conflict / Lockfile):
1. **Khôi phục ngay:** `git checkout HEAD -- package.json package-lock.json pnpm-lock.yaml`
2. **Không ép buộc (No `--force` / `--legacy-peer-deps` bừa bãi):** Tìm hiểu chính xác package nào xung đột peer dependency từ changelog, đề xuất user nâng cấp đồng thời hoặc tìm thư viện thay thế.

---

## 5. Khung Kế Hoạch Chuẩn (Implementation Plan Skeleton)

Khi tạo artifact `implementation_plan.md` cho các tác vụ ≥ 2 files:

```markdown
# Implementation Plan: [Refactor / Upgrade / Testing] - [Tên Module]

## 1. Mục tiêu & Giới hạn phạm vi
- Mục tiêu: [Cải thiện khả năng đọc / Tách file Service / Thêm unit tests]
- Cam kết: 100% Zero Behavior Change. Không đổi API contracts hay DB schema.

## 2. Rủi ro & Điểm nhạy cảm
- [Rủi ro tiềm ẩn, ví dụ: Hàm X có side-effect ngầm, Package Y có breaking change ở v2]

## 3. Các bước thực hiện từng file
- [ ] [TênFileGốc.ts](file:///<workspace-root>/src/...): Trích xuất logic X sang Helper
- [ ] [NEW] [TênFileMới.ts](file:///<workspace-root>/src/...): Nhận các pure functions
- [ ] [TênTest.test.ts](file:///<workspace-root>/tests/...): Chạy kiểm chứng

## 4. Kế hoạch Rollback tức thì
- Lệnh khôi phục: `git restore src/path/to/files`
```

---

## 6. Mẫu Code Đa Ngôn Ngữ Thực Chiến (Guard Clauses)

### TypeScript Pattern:
```typescript
// ❌ Cũ: Lồng ghép sâu, khó đọc
function processOrder(order: Order | null, user: User | null) {
  if (order) {
    if (user && user.isActive) {
      if (order.items.length > 0) {
        return calculateTotal(order);
      }
    }
  }
  return null;
}

// ✅ Mới: Tường minh, phẳng hóa logic bằng Early Return
function processOrder(order: Order | null, user: User | null): number | null {
  if (!order || !user) return null;
  if (!user.isActive) return null;
  if (order.items.length === 0) return null;

  return calculateTotal(order);
}
```

### Python Pattern:
```python
# ❌ Cũ: Nesting lồng nhau
def calculate_discount(order, customer):
    if order is not None:
        if customer and customer.is_active:
            if order.total_amount > 1000:
                return order.total_amount * 0.1
    return 0.0

# ✅ Mới: Guard Clauses đanh thép
def calculate_discount(order, customer) -> float:
    if not order or not customer or not customer.is_active:
        return 0.0
    if order.total_amount <= 1000:
        return 0.0

    return order.total_amount * 0.1
```

---

## 7. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi Refactor & Viết Test | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `frontend` | Tách nhỏ UI component, trích xuất custom hooks, tối ưu re-render | Tách container/presentational, Memoization, component unit test |
| `backend` | Tách God Service, áp dụng Dependency Injection, chuẩn hóa DTOs | Phân tầng Controller-Service-Repo, Unit test Service với mocked repository |
| `fullstack` | Đồng bộ hóa contracts, refactor shared types, end-to-end integration | Đồng bộ schemas giữa client/server, viết integration test luồng dữ liệu |
| `qa` | Thiết kế Test Matrix, tự động hóa regression test suites | Viết test cases biên (boundary analysis), mock scenarios |
| `data` | Refactor complex SQL queries, module hóa dbt models | Chia nhỏ staging/intermediate/marts models trong dbt, dbt tests |

---

## 8. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🧹 Code Cleaner Summary                               [Role: <role> | Task: <Tên công việc>]
─────────────────────────────────────────────────────────────────────
Trạng thái:          [SUCCESS | BLOCKED | FAILED | PARTIAL]
Phạm vi thực tế:    [N files đã chỉnh sửa / tạo mới]
Cam kết tính năng:  ✅ Zero Behavior Change (Hành vi bên ngoài giữ nguyên 100%)

Chi tiết cải thiện (Laser Focus):
  • [Loại thay đổi]: [Tên file và chi tiết việc đã làm]

Kiểm chứng thực tế (Verify Before Claim):
  • Lệnh test đã chạy: [npm test / pytest / tsc --noEmit / Chưa chạy (Nêu lý do)]
  • Kết quả xác thực:  [Pass N/N tests / Types Clean / NOT VERIFIED]
  • Anti-overengineering: ✅ 0 abstraction thừa, giữ giải pháp tối giản nhất
  • Zero Hack:          ✅ Không dùng any, @ts-ignore, hay làm yếu test assertion

⚠️ Phương án Rollback nếu cần:
  • Lệnh: `git restore <các-file-đã-sửa>`
```
