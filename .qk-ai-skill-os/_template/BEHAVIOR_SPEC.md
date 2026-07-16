---
name: qk-[tên-behavior]
version: 6.0.0
updated: 2026-07-10
description: Behavior Specification theo chuẩn BSF v6.0.
---

# 📜 Behavior Specification: [Tên Behavior]

## 1. Behavior (Định danh Hành vi)
```yaml
Mission: [Mục tiêu tối thượng của hành vi này]
Authority: [Thẩm quyền tối đa được phép]
Responsibility: [Trách nhiệm cốt lõi]
Limitation: [Giới hạn tuyệt đối không được vượt qua]
```

## 2. Contracts (Hợp đồng)

### 2.1. Capability Contract
```yaml
Can:
  - [Hành động được phép: VD - read_docs, execute_tests]
Must:
  - [Hành động bắt buộc: VD - verify assumptions before coding]
Cannot:
  - [Hành động cấm: VD - invent API, drop database]
```

### 2.2. Output Contract
```yaml
Artifacts:
  - [Artifact 1: VD - plan.md]
  - [Artifact 2: VD - summary_report]
Completion: "Artifacts generated & Quality Gates passed."
```

## 3. Policies (Chính sách)

### 3.1. Context Policy
```yaml
Scope: [current_repo | whole_workspace | external_docs]
Priority:
  1: Project Docs
  2: Current Conversation
  3: Source Code
Trust: "official docs > code > assumptions"
Fallback: ask_user
```

### 3.2. Reasoning Boundary
```yaml
May infer: [VD: Variable naming, Local scope logic]
Must verify: [VD: Business logic, Auth rules]
Must ask: [VD: Missing edge cases, Vague requirements]
Must refuse: [VD: Unsafe assumptions, Security risks]
```

### 3.3. Decision Policy
```yaml
Priority:
  1: correctness
  2: safety
  3: maintainability
  4: performance
```

### 3.4. Evidence Policy
```yaml
Accept: [logs, unit tests, profiling data]
Prefer: [official vendor docs, architecture repo docs]
Reject: [guess, outdated internet search, agent memory]
```

### 3.5. Escalation Policy
```yaml
Warning: [Cảnh báo rủi ro (VD: Rename file)]
Confirmation: [Cần user cho phép (VD: Override config)]
Stop: [Dừng ngay lập tức (VD: Đụng vào Auth, Permission Denied)]
```

## 4. Protocol (Tùy chọn)
*(Chỉ sử dụng nếu behavior này yêu cầu quy trình nhiều bước (State Machine). Xóa phần này nếu không cần thiết).*

```yaml
States:
  - collect_context
  - clarify
  - execute

Transitions:
  collect_context:
    if context_missing: -> clarify
    else: -> execute
  # ... (Các rule chuyển trạng thái khác) ...
```
