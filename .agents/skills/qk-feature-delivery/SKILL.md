---
name: qk-feature-delivery
description: Phát triển tính năng mới end-to-end (Delivery Orchestrator EDAOS Architecture): Requirements → Context → Impact Analysis → Design → Implement → Verification
version: 2.0.0
domain: frontend.web
type: delivery_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
  - code.modify
  - ui.capture
---

# 🎨 qk-feature-delivery (v2.0 Native EDAOS Delivery Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Quản lý chu trình phát triển và giao nhận tính năng mới (Feature Creation & Delivery Lifecycle) từ Yêu cầu ➔ Phân tích Tác động ➔ Thiết kế Kiến trúc ➔ Lập kế hoạch Thực thi ➔ Giao nhận An toàn ➔ Kiểm tra Chấp nhận (Acceptance Verification).
> Skill này đóng vai trò là **Delivery Orchestrator tại Nhánh Tạo mới (Creation Flow)**: Tuyệt đối KHÔNG nhảy ngay vào sinh code vô căn cứ; bắt buộc phải thực hiện Phân tích Tác động Kiến trúc (Architecture Impact Analysis) và kiểm tra tuân thủ Policy trước khi mutate codebase.

---

## 1. Hợp Đồng Năng Lực & Phân Tầng Trách Nhiệm (Domain Responsibility)

### Consumes (Đầu vào bắt buộc)
Skill tiếp nhận yêu cầu tính năng từ người dùng hoặc hệ thống:
* `FeatureRequest`: Yêu cầu tính năng mới (ví dụ: Thêm bộ lọc người dùng UserFilter).
* `RequirementContext`: Ngữ cảnh nghiệp vụ và các ràng buộc giao diện/API.
* `ExistingArchitecture`: Cấu trúc codebase hiện tại từ AST & Code Reference capabilities.
* `PolicyConstraints`: Tiêu chuẩn chất lượng (Performance, Accessibility, Security).

### Produces (Đầu ra chuẩn hóa)
* `FeatureIntent`: Ý định tính năng được cấu trúc hóa kèm tiêu chí chấp nhận.
* `ImpactAssessment`: Báo cáo đánh giá các miền hệ thống bị ảnh hưởng.
* `ActionPlan`: Kế hoạch thực thi các bước code kèm Compensating Actions.
* `Outcome` & `Learning`: Báo cáo nghiệm thu và bài học ghi nhớ cho tương lai.

---

## 2. Quy Trình Vận Hành EDAOS Delivery Lifecycle

Skill thực thi nghiêm ngặt theo **Delivery Workflow**:

```
1. UNDERSTAND REQUIREMENT ➔ Chuyển đổi FeatureRequest thành FeatureIntent có cấu trúc
2. ANALYZE IMPACT        ➔ Đánh giá tác động kiến trúc (Affected Frontend, API, State, DB)
3. CREATE DESIGN          ➔ Đưa ra Architecture Decision (Lựa chọn Component & Data Pattern)
4. GENERATE DELIVERY PLAN ➔ Đóng gói Action Plan chi tiết từng bước thay đổi
5. SAFETY VALIDATION      ➔ Kiểm tra mức độ rủi ro & tuân thủ Policy (Kích hoạt Human Gate nếu High Risk)
6. EXECUTE DELIVERY       ➔ Thực hiện sửa đổi codebase một cách an toàn (SOLID / DRY)
7. ACCEPTANCE VERIFY      ➔ Kiểm tra nghiệm thu tự động (Performance, A11y, Visual, Functional)
8. STORE LEARNING         ➔ Lưu bài học phát triển thành công vào edaos.learning.frontend.web
```

---

## 3. Ma Trận Phân Loại Rủi Ro Thay Đổi (Change Boundary Risk Matrix)

| Change Scope | Affected Domain | Risk Level | Required Guards |
| :--- | :--- | :--- | :--- |
| **New Component** | Frontend UI Only | LOW | Unit Test & Visual Capture |
| **New API Integration** | Frontend + REST API | MEDIUM | API Contract Validation |
| **Data Model Change** | Frontend + Backend + DB | HIGH | **MANDATORY HUMAN GATE + MIGRATION PLAN** |
| **Auth / Core Security**| Authentication & Permissions | CRITICAL | **MANDATORY HUMAN GATE + SECURITY AUDIT** |

---

## 4. Định Dạng Output Feature Delivery Report

```markdown
🎨 qk-feature-delivery Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Feature Intent:  [USER_FILTER: Allow dashboard users to filter by Role and Status]
Impact Analysis: [Frontend: UserFilter.tsx, UsersManager.tsx | API: GET /api/users?role=&status=]
Selected Design: [Controlled Component + URL SearchParams Sync]

📝 Generated Action Plan:
  ✅ Create component `src/components/admin/UserFilter.tsx`
  ✅ Update `UsersManager.tsx` to handle filter state updates
  ✅ Bind filter query params to API fetch hook

🛡️ Safety & Migration Guards:
  - Risk Level: MEDIUM (Frontend UI + API Integration)
  - Compensating Action Defined: `git checkout src/components/admin/`
  - Human Gate Status: BYPASSED (Confidence: 0.92 >= 0.85)

✅ Acceptance Verification Results:
  - Functional Test: PASS (Filter triggers updated user grid)
  - Performance Policy: PASS (Zero LCP/CLS regression)
  - Accessibility Policy: PASS (Keyboard navigable, ARIA labels correct)
  - Outcome: SUCCESS

🧠 Persisted Learning:
  - Pattern: `URL_SEARCH_PARAMS_FILTER_SYNC_PATTERN` saved to edaos.learning.frontend.web
```
