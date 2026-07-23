---
name: qk-engineering-standard
description: Ép buộc chuẩn SOLID, DRY, Clean Code và Kiến trúc với Tầng Quản trị Kỹ thuật (Governance Orchestrator EDAOS Architecture)
version: 2.0.0
domain: frontend.web
type: governance_orchestrator
edaos_core_requirement: ">=1.0.0"
capabilities_required:
  - code.ast
  - code.references
---

# 🛡️ qk-engineering-standard (v2.0 Native EDAOS Governance Orchestrator)

> [!IMPORTANT]
> **Nhiệm vụ cốt lõi**: Quản trị chất lượng mã nguồn và bảo vệ tính toàn vẹn kiến trúc (Engineering & Architecture Governance).
> Skill này đóng vai trò là **Governance Orchestrator**: Trả lời câu hỏi *"Thay đổi này có phù hợp với tiêu chuẩn kỹ thuật và kiến trúc dài hạn không?"*, đánh giá tuân thủ SOLID/DRY/Clean Code, và đưa ra quyết định chấp thuận hoặc từ chối mã nguồn trước khi release.

---

## 1. Hợp Đồng Quản Trị & Ranh Giới Trách Nhiệm (Governance Boundary)

### Consumes (Đầu vào bắt buộc)
Skill tiếp nhận thông tin từ quá trình phát triển/sửa đổi code:
* `ChangedFiles`: Danh sách các file được thêm mới hoặc chỉnh sửa.
* `CodeEvidence`: Bằng chứng đo đạc về độ phức tạp (Cognitive Complexity), trùng lặp (Duplication), và liên kết phụ thuộc (Coupling).
* `ArchitectureContext`: Bức tranh phụ thuộc giữa các tầng hệ thống.
* `EngineeringPolicies`: Tiêu chuẩn chất lượng code của dự án.

### Produces (Đầu ra chuẩn hóa)
* `EngineeringFinding`: Phát hiện vi phạm kiến trúc hoặc code smell.
* `GovernanceDecision`: Đưa ra 1 trong 4 quyết định:
  - `ACCEPT`: Chấp thuận 100% mã nguồn.
  - `ACCEPT_WITH_WARNING`: Chấp thuận nhưng có cảnh báo nợ kỹ thuật.
  - `REFACTOR_REQUIRED`: Từ chối release, yêu cầu refactor (chuyển giao cho `qk-bug-resolution`).
  - `ARCHITECTURE_REVIEW_REQUIRED`: Kích hoạt Human Gate do vi phạm ranh giới kiến trúc nghiêm trọng.

---

## 2. Tháp Ưu Tiên Chuẩn Kỹ Thuật (Standard Hierarchy Matrix)

Mọi đánh giá đều tuân theo tháp ưu tiên trọng số nghiêm ngặt:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Architecture Integrity (100) ➔ Cấm vi phạm ranh giới phụ thuộc      │
│ 2. Security Compliance     (90)  ➔ Cấm hổng bảo mật & injection       │
│ 3. Correctness & Logic     (85)  ➔ Cấm logic lỗi, memory leak         │
│ 4. Maintainability         (70)  ➔ Đảm bảo SOLID, DRY, Complexity ok    │
│ 5. Performance Efficiency  (60)  ➔ Đảm bảo render cost tối ưu         │
│ 6. Style & Conventions     (30)  ➔ Format, naming, linting            │
└────────────────────────────────────────────────────────────────────────┘
```

> [!CAUTION]
> Một thay đổi làm code "đẹp hơn" (Style PASS) nhưng phá vỡ phụ thuộc kiến trúc (Architecture FAIL) sẽ **NGAY LẬP TỨC BỊ TỪ CHỐI (REJECT)**.

---

## 3. Quy Trình Vận Hành EDAOS Governance Workflow

Skill thực thi nghiêm ngặt theo **Engineering Review Workflow**:

```
1. CONSUME CODE CONTEXT ➔ Nhận danh sách changed files & AST context
2. MEASURE METRICS      ➔ Thu thập EngineeringEvidence (Complexity, Coupling, Duplication)
3. EVALUATE STANDARDS   ➔ So sánh với Clean Code, SOLID và Architecture Policies
4. CLASSIFY VIOLATION   ➔ Phân loại vi phạm theo Tháp Ưu Tiên (Architecture > Style)
5. FORMULATE GOVERNANCE DECISION ➔ Đưa ra kết luận (ACCEPT | REFACTOR_REQUIRED)
6. DELEGATE REFACTORING  ➔ Chuyển giao yêu cầu refactor cho ./qk-bug-resolution nếu FAIL
7. STORE GOVERNANCE LEARNING ➔ Lưu bài học code smell vào edaos.learning.frontend.web
```

---

## 4. Định Dạng Output Governance Report

```markdown
🛡️ qk-engineering-standard Summary (EDAOS v2.0)
─────────────────────────────────────────────────
Reviewed Targets: [src/components/admin/UsersManager.tsx]
Governance Status: [REFACTOR_REQUIRED]
Review Confidence: [High (0.94)]

📊 Engineering Metrics:
  - Cognitive Complexity: 28 (Policy Target: <= 15) -> FAIL
  - Duplication Ratio: 4.2% (Policy Target: <= 5%) -> PASS
  - Dependency Boundary: Circular dependency between Domain & UI -> FAIL

🚨 Architectural & Code Findings:
  - [CRITICAL] Component `UsersManager` contains direct database call logic (Boundary Breach).
  - [HIGH] Method `handleUserFilter` has Cognitive Complexity of 28 (Violates Single Responsibility).

💡 Governance Decision:
  - Decision: REFACTOR_REQUIRED
  - Recommended Delegate: `./qk-bug-resolution` (Strategy: `extract_custom_hook_and_service`)

📋 Mandatory Refactoring Plan:
  1. Extract API fetch logic into `useUsersManager` custom hook.
  2. Move data transformation to service layer (`userService.ts`).
```
