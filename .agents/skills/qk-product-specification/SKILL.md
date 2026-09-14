---
# ── Identity ───────────────────────────────────────────────
name: qk-product-specification
version: 9.2.0
status: experimental
description: "Product thinking (Idea → Requirement → Acceptance criteria → Technical spec). Dùng skill này khi user nhắc đến: viết spec, phân tích yêu cầu, acceptance criteria, prd, đặc tả kỹ thuật, user story, làm rõ yêu cầu — kể cả khi chỉ nói 'tôi có ý tưởng làm tính năng X'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - product-specification
  - requirement-analysis
  - acceptance-criteria
  - technical-spec

complexity:
  level: medium
  criteria:
    files_affected: "1-3"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "viết spec"
  - "phân tích yêu cầu"
  - "acceptance criteria"
  - "prd"
  - "đặc tả kỹ thuật"
  - "user story"
  - "làm rõ yêu cầu"


# ── V8: References ─────────────────────────────────────────
workflow: spec-driven-development

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-feature-delivery

knowledge_scope:
  domain:
    - product-requirements
    - technical-specifications
  concepts:
    - user-story
    - acceptance-criteria
  references:
    - architecture
    - security
    - anti-patterns

decision_boundary:
  owns:
    - technical-ready specification
    - acceptance criteria
  does_not_own:
    - market research
    - pricing
    - roadmap
  conflicts_with: []
  delegates_to:
    - qk-feature-delivery

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: read_only
produces: [report, specification]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-product-specification — Product & Technical Specifier

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm chuyển hóa các ý tưởng kinh doanh còn mơ hồ thành bản đặc tả kỹ thuật chi tiết (Technical Specification & PRD) hoàn chỉnh: **User Problem → User Stories → Acceptance Criteria (Given-When-Then) → Technical Constraints & Edge Cases**.

---

## Preconditions

Trước khi viết đặc tả kỹ thuật, AI BẮT BUỘC kiểm tra:

- [ ] Xác định đối tượng người dùng cuối (User persona) và bài toán kinh doanh cần giải quyết.
- [ ] Đọc `.agents/DEV_PROFILE.md` để hiểu kiến trúc tổng quan và các ràng buộc công nghệ sẵn có.
- [ ] Kiểm tra xem ý tưởng có mục tiêu đầu ra (Success metric / KPI) cụ thể chưa.
- [ ] Nếu ý tưởng hoàn toàn không có mục đích sử dụng rõ ràng:
  → **EXIT: BLOCKED**
  → Báo cáo user câu hỏi định hình mục tiêu trước khi lập tài liệu spec.

---

## Scope

✅ Skill này làm:
- Viết User Stories theo chuẩn: "As a [role], I want to [action], so that [benefit]".
- Thiết lập Acceptance Criteria (AC) theo định dạng BDD Given/When/Then.
- Liệt kê Edge Cases, Empty States, Error States, Permission constraints.
- Phác thảo Data Model sơ bộ và các API endpoints cần có để phục vụ kỹ sư triển khai.
- Chế độ hoạt động: **Read-Only / Documentation Output** (không can thiệp vào code).

❌ Skill này KHÔNG làm:
- Trực tiếp triển khai mã nguồn (→ chuyển giao cho `qk-feature-delivery`).
- Nghiên cứu thị trường sâu, định giá sản phẩm (Pricing) hay marketing strategy.
- Thiết kế UI Mockup chi tiết (→ `qk-ui-builder`).

---

## Execution Steps

### Step 1 — Problem Framing & Persona Identification
```
Inputs:  Ý tưởng thô từ user
Actions:
  - Xác định ai là người hưởng lợi trực tiếp từ tính năng.
  - Phân tách bài toán cốt lõi (Core problem) khỏi các mong muốn phụ (Nice-to-haves).
Output: Problem statement & User personas
```

### Step 2 — Story Mapping & Scope Boundary
```
Inputs:  Problem statement
Actions:
  - Chia nhỏ tính năng thành các User Stories độc lập, có thể bàn giao trong từng sprint.
  - Phân loại rõ ràng: In-Scope (Làm ngay) vs Out-of-Scope (Giai đoạn sau).
Output: User stories & Scope fence
```

### Step 3 — Acceptance Criteria & Edge Cases Definition
```
Inputs:  User stories
Actions:
  - Viết Acceptance Criteria rõ ràng cho từng story (Given/When/Then).
  - Định nghĩa các trường hợp biên: Dữ liệu quá lớn, mất mạng, token hết hạn, quyền truy cập bị từ chối.
Output: Verification criteria
```

### Step 4 — Technical Blueprint Hand-off
```
Inputs:  Stories, AC, DEV_PROFILE.md
Actions:
  - Phác thảo kiến trúc kỹ thuật dự kiến: Entity fields, API route patterns.
  - Tổng hợp thành file markdown đặc tả (Spec Markdown Document) sẵn sàng chuyển giao cho kỹ sư.
Exit: SUCCESS
```

---

## Prompt Template

```
Ý tưởng:     [Mô tả tính năng hoặc ý tưởng của bạn]
Đối tượng:   [Ai sẽ dùng tính năng này — admin / user thông thường / khách vãng lai]
Mục đích:    [Giải quyết vấn đề gì, mang lại giá trị gì]
Ràng buộc:   [Thời hạn, không được đụng vào phần nào của hệ thống]
```