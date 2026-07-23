---
name: qk-bug-resolution
description: Sửa lỗi (bugs) bằng chu trình khép kín dựa trên Bằng chứng Thực nghiệm (Resolution Orchestrator EDAOS Architecture)
version: 2.0.0
domain: frontend.web
type: resolution_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
  - code.modify
---

# 🛠️ qk-bug-resolution (v2.0 Native EDAOS Resolution Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Thực thi sửa lỗi (bug resolution) dựa trên `Finding` và `Decision` đã được bằng chứng thực nghiệm xác minh.
> Skill này đóng vai trò là **Resolution Orchestrator tại Ranh giới Thực thi (Execution Boundary)**: Tuyệt đối KHÔNG tự ý suy đoán bug từ stack trace thô; bắt buộc tiêu thụ `Finding` + `Decision`, kiểm tra an toàn (Saga Compensation & Risk Guards), lập Mutation Plan và thực thi sửa lỗi không gây ra regression.

---

## 1. Hợp Đồng Năng Lực & Ranh Giới Thực Thi (Execution Boundary)

### Consumes (Đầu vào bắt buộc)
Skill chỉ tiếp nhận các thực thể đã qua xác minh từ EDAOS Engine:
* `Finding`: Chẩn đoán nguyên nhân gốc kèm isolated culprit.
* `Decision`: Quyết định chiến lược sửa đổi.
* `ActionPlan`: Kế hoạch các bước hành động cụ thể.
* `PolicyContext`: Tiêu chuẩn không gây ra regression.

### Forbidden Inputs (Các đầu vào bị cấm)
* 🚫 **Raw StackTrace Only**: Cấm sửa code dựa trên duy nhất 1 dòng error log thô mà chưa qua `Interpret` & `Correlate`.
* 🚫 **Unverified Guesswork**: Cấm sửa code dựa trên giả định mơ hồ.

---

## 2. Quy Trình Vận Hành EDAOS Resolution Lifecycle

Skill thực thi nghiêm ngặt theo **Resolution Workflow**:

```
1. VALIDATE DIAGNOSIS ➔ Kiểm tra tính hợp lệ của Finding & Decision
2. SELECT FIX STRATEGY ➔ Tra cứu Strategy sửa lỗi phù hợp (Runtime error, Contract fix, State fix)
3. GENERATE MUTATION PLAN ➔ Lập kế hoạch sửa file kèm Compensating Action (Saga Pattern)
4. SAFETY CHECK & GUARDS ➔ Kiểm tra mức độ rủi ro (Risk Classification). Kích hoạt Human Gate nếu High Risk.
5. EXECUTE CHANGE    ➔ Thực hiện sửa đổi codebase một cách an toàn và tối giản nhất (DRY / SOLID)
6. VERIFY RESOLUTION  ➔ Kiểm tra nguyên nhân đã được giải quyết + Zero Regression đối với Policy
7. STORE LEARNING     ➔ Lưu bài học sửa lỗi thành công vào edaos.learning.frontend.web
```

---

## 3. Quản Lý An Toàn & Ma Trận Rủi Ro (Safety & Risk Matrix)

| Risk Level | Scopes | Requirement / Guard |
| :--- | :--- | :--- |
| **LOW** | Variable rename, Input null-check, Guard addition | Autocommit + Unit Test verification |
| **MEDIUM** | Component state logic refactoring, API mapping | Automatic Git Stash / Compensating Action |
| **HIGH** | Database schema, Authentication, Payment flow | **MANDATORY HUMAN GATE APPROVAL** |
| **CRITICAL** | Production hotfix, Core Security Patch | **MANDATORY HUMAN GATE + REGRESSION TEST SUITE** |

---

## 4. Định Dạng Output Resolution Report

```markdown
🛠️ qk-bug-resolution Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Input Finding:   [FND-2026-NULL-REF: Cannot read property 'map' of undefined]
Resolved Target: [src/components/UserList.tsx:L42]
Fix Strategy:    [runtime_null_reference_boundary_check]

📝 Applied Changes:
  ✅ Added defensive Boundary Contract check `data?.users ?? []` before iteration
  ✅ Added prop default value in UserList interface

🛡️ Safety & Saga Compensation:
  - Risk Level: LOW
  - Compensating Action Defined: `git checkout src/components/UserList.tsx`
  - Human Gate Required: NO (Confidence: 0.91 >= 0.85)

✅ Resolution Verification:
  - Original Exception: 0 occurrences
  - Regression Test Suite: PASS (Zero Policy Breaches)
  - Outcome: SUCCESS

🧠 Persisted Learning:
  - Pattern: `BOUNDARY_INPUT_GUARD_PATTERN` saved to edaos.learning.frontend.web
```
