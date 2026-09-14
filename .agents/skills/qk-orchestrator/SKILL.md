---
# ── Identity ───────────────────────────────────────────────
name: qk-orchestrator
version: 9.2.0
status: stable
description: "Điều hướng yêu cầu của người dùng đến đúng skill với kỷ luật thép — phân tích intent, kiểm tra preconditions và routing table. Dùng skill này khi user nhắc đến: help, list skills, có những skill nào, chọn skill nào, dùng skill gì, route task, hỗ trợ điều hướng — kể cả khi yêu cầu mơ hồ không rõ nên làm gì."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: orchestrator

intent:
  - task-routing
  - skill-selection
  - precondition-checking

complexity:
  level: low
  criteria:
    files_affected: "1"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "help"
  - "list skills"
  - "có những skill nào"
  - "chọn skill nào"
  - "dùng skill gì"
  - "route task"
  - "hỗ trợ điều hướng"


selection:
  priority: high
  confidence_threshold: 0.80

# ── V8: References ─────────────────────────────────────────
workflow: research                  # Uses research workflow to understand request

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-context-loader

knowledge_scope:
  owns:
    - task-routing
    - skill-selection
    - precondition-validation
  references:
    - all-skills                    # References registry to make decisions
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: none
produces: [plan]
consumes: [user-request]

token_budget:
  max_files_read: 2
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-orchestrator — Request Routing & Skill Dispatcher

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm phân tích ý định (Intent) của người dùng, đối chiếu với bối cảnh dự án (`DEV_PROFILE.md`) và bảng điều hướng trung tâm (`AGENTS.md`) để chọn đúng skill kỹ thuật phù hợp nhất.

---

## Preconditions

Trước khi đề xuất hoặc kích hoạt skill, AI BẮT BUỘC kiểm tra:

- [ ] Đọc `.agents/DEV_PROFILE.md` nếu có để xác định vai trò (`role`) và `stack`.
- [ ] Phân tích từ khóa và hành động mong muốn từ câu lệnh của người dùng.
- [ ] Kiểm tra xem yêu cầu là đơn nhiệm (Single task) hay đa nhiệm phức tạp (Compound task).
- [ ] Nếu yêu cầu hoàn toàn mơ hồ, không có manh mối kỹ thuật:
  → **EXIT: PARTIAL**
  → Đặt tối đa 2 câu hỏi trắc nghiệm ngắn để làm rõ mục tiêu.

---

## Scope

✅ Skill này làm:
- Phân loại intent của user vào 1 trong 29 active skills của hệ thống.
- Cung cấp cú pháp kích hoạt skill chính xác (`./qk-<skill-name>`).
- Lập lộ trình chuỗi kỹ năng (Skill Pipeline) cho các tác vụ lớn gồm nhiều bước.
- Trả về danh mục tra cứu nhanh các kỹ năng khả dụng trong hệ thống.

❌ Skill này KHÔNG làm:
- Trực tiếp sửa code, chạy lệnh phá hủy hoặc can thiệp file hệ thống.
- Thay thế các kỹ năng chuyên biệt khi user đã chỉ định rõ ràng mục tiêu.

---

## Execution Steps

### Step 1 — Intent Extraction & Context Alignment
```
Inputs:  Prompt từ user, DEV_PROFILE.md (role, stack)
Actions:
  - Nhận diện động từ hành động chính (tạo mới, sửa lỗi, tối ưu, đo lường, review, tài liệu).
  - Đối chiếu với Role Behavior Matrix trong AGENTS.md để áp dụng góc nhìn phù hợp.
Output: Primary Intent & Constraints
```

### Step 2 — Quick Table Matching & Disambiguation
```
Inputs:  Primary Intent, AGENTS.md Routing Table
Actions:
  - Tra cứu từ khóa đối khớp trong Quick Table.
  - Xử lý xung đột nếu có 2 skill liên quan (ví dụ: qk-refactor vs qk-feature-delivery; qk-ui-builder vs qk-ui-audit).
  - Chọn skill có độ đặc hiệu (specificity) cao nhất.
Output: Target Skill Recommendation
```

### Step 3 — Plan & Dispatch
```
Inputs:  Target Skill Recommendation
Actions:
  - Nếu là tác vụ đơn: Hướng dẫn người dùng hoặc tự động kích hoạt skill qua cú pháp `./qk-<name>`.
  - Nếu là tác vụ đa bước: Lập danh sách thứ tự thực hiện (Pipeline), ví dụ: qk-context-loader → qk-feature-delivery → qk-test-engineering.
Exit: SUCCESS
```

---

## Prompt Template

```
Yêu cầu:    [Mô tả nhu cầu cần làm của bạn — ví dụ: "tôi muốn tối ưu trang danh sách sản phẩm"]
Bối cảnh:   [Đang gặp khó khăn gì / file nào liên quan]
Mong muốn:  [Cần gợi ý skill đơn lẻ hay một quy trình nhiều bước]
```