---
# ── Identity ───────────────────────────────────────────────
name: qk-project-health
version: 9.2.0
status: stable
description: "Kiểm toán toàn diện sức khỏe dự án: đo lường Code Smells, Technical Debt, độ phức tạp Cyclomatic, God files, vi phạm SOLID — chấm điểm Health Score (0–100) và đề xuất lộ trình cải tiến. Dùng skill này khi user nhắc đến: audit project, code smell, tech debt, health check, project score, nợ kỹ thuật, kiểm tra sức khỏe code, đánh giá chất lượng dự án — kể cả khi chỉ nói 'xem thử project này nợ kỹ thuật nhiều không' — KHÔNG dùng cho phân tích tính khả thi hay gap analysis trước khi code (dùng qk-project-audit)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - project-audit
  - codebase-health
  - tech-debt-analysis

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "audit project"
  - "code smell"
  - "tech debt"
  - "health check"
  - "project score"
  - "nợ kỹ thuật"
  - "kiểm tra sức khỏe code"
  - "đánh giá chất lượng dự án"


# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-code-review
  - qk-refactor
  - qk-security-audit

knowledge_scope:
  owns:
    - tech-debt
    - codebase-health
    - code-metrics
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

selection:
  priority: medium
  confidence_threshold: 0.75

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: low
side_effects: read_only
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 12
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-health — Codebase Health Auditor & Tech Debt Evaluator

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm kiểm toán độc lập chất lượng toàn diện của codebase, đo lường nợ kỹ thuật (Technical Debt) theo các ngưỡng định lượng chuẩn hóa (R-C-09 & R-C-10), chấm điểm **Health Score (0–100)** và cung cấp lộ trình tái cấu trúc khả thi.

---

## Preconditions

Trước khi tiến hành kiểm toán sức khỏe:

- [ ] Xác định rõ phạm vi kiểm toán: Toàn bộ codebase (Full repository) hay Module / Thư mục cụ thể.
- [ ] Đọc file conventions trong `.agents/DEV_PROFILE.md` để đánh giá đúng tiêu chuẩn dự án.
- [ ] Nếu codebase chưa có source code hoặc chỉ có file khởi tạo rỗng:
  → **EXIT: BLOCKED**
  → Báo cáo: "Dự án chưa đủ mã nguồn để đánh giá chỉ số nợ kỹ thuật."

---

## Scope

✅ Skill này làm:
- Quét các vi phạm số liệu kỹ thuật (Metric thresholds theo R-C-10):
  - Function dài quá 40 dòng.
  - File dài quá 300 dòng (God files).
  - Nesting depth vượt quá 3 tầng.
  - Cyclomatic complexity ước tính > 10.
- Phát hiện các Code Smells kinh điển: Duplicated logic (vi phạm DRY), Dead code, Magic numbers/strings, Any-casting lạm dụng, Silent error swallowing (`catch {}` rỗng).
- Đánh giá kiến trúc: Circular dependencies, vi phạm phân tầng (e.g. Controller truy cập trực tiếp DB, UI chứa business calculation).
- Chấm điểm **Health Score (0–100)** phân bổ theo 4 trục:
  - Architecture Consistency (25đ)
  - Maintainability & Clean Code (25đ)
  - Testability & Reliability (25đ)
  - Hygiene & Security Practice (25đ)
- Lập bảng danh mục nợ kỹ thuật xếp hạng ưu tiên (P0: Nguy hiểm, P1: Cần refactor sớm, P2: Nợ nhỏ).

❌ Skill này KHÔNG làm:
- Trực tiếp sửa đổi code của người dùng (`side_effects: read_only`).
- Audit chuyên sâu lỗ hổng bảo mật CVE (thuộc `qk-security-audit`).
- Tối ưu truy vấn SQL cụ thể (thuộc `qk-db-optimizer`).

---

## Execution Steps

### Step 1 — Quét tĩnh & Phân tích Kích thước (Size & Structure Scan)
```
Inputs:  Workspace files
Actions:
  - Thống kê các file có độ dài lớn nhất (> 300 dòng).
  - Tìm kiếm các file gom quá nhiều trách nhiệm (God components / God services).
  - Liệt kê các hàm vượt quá 40 dòng.
Outputs: Danh sách các điểm nóng về kích thước (Hotspots)
```

### Step 2 — Phát hiện Code Smells & Vi phạm Tiêu chuẩn
```
Actions:
  - Grep các mẫu vi phạm:
    - Empty catch blocks / Silent error suppression.
    - `as any` hoặc `@ts-ignore` tràn lan.
    - Console.log / print debug bị bỏ quên.
    - Magic strings / Magic numbers trong logic điều kiện.
  - Kiểm tra tính gắn kết của modules (Cohesion & Coupling).
Outputs: Bảng thống kê các lỗi Code Smell theo mức độ nghiêm trọng
```

### Step 3 — Chấm điểm Health Score định lượng (Rubric 0–100)
```
Cách tính điểm:
  100 Điểm Gốc
  - Trừ 2đ cho mỗi God file (>300 lines) (Max trừ 20đ).
  - Trừ 1đ cho mỗi hàm quá dài (>40 lines) (Max trừ 15đ).
  - Trừ 3đ cho mỗi vi phạm Silent error hoặc IDOR/Any (Max trừ 20đ).
  - Trừ 5đ nếu thiếu hoàn toàn Unit test hoặc cấu trúc phân tầng bị đảo lộn (Max trừ 25đ).
  - Trừ 2đ cho mỗi block logic trùng lặp rõ ràng (Max trừ 20đ).
Outputs: Điểm số Health Score (Ví dụ: 74/100)
```

### Step 4 — Lập Báo cáo Kiểm toán & Lộ trình Cải tiến
```
Format báo cáo:
  1. HEALTH SCORE: XX/100 (Rating: Critical / Warning / Good / Excellent)
  2. EXECUTIVE SUMMARY: 3 điểm mạnh & 3 vấn đề lớn nhất.
  3. HOTSPOT AUDIT: Bảng danh sách files & lines cần xử lý.
  4. ACTIONABLE ROADMAP:
     - [P0] Fix ngay: Các điểm nghẽn nghiêm trọng có nguy cơ gây crash/leak.
     - [P1] Sprint tới: Tách God files và hàm phức tạp (gợi ý dùng `qk-refactor`).
     - [P2] Tech debt backlog: Dọn dẹp magic constants và dead code.
```

---

## Prompt Template

```
Scope:        [Toàn bộ dự án / Thư mục src/services / Module checkout]
Trọng tâm:    [Đo lường nợ kỹ thuật / Chuẩn bị refactor lớn / Đánh giá code định kỳ]
Ngưỡng mong muốn: [Muốn đạt tối thiểu bao nhiêu điểm]
```

### Ví dụ theo Nhu cầu:

**Audit toàn diện dự án chuẩn bị mở rộng tính năng**
```
Scope:        Toàn bộ repo
Trọng tâm:    Tìm các file có độ phức tạp cao và kiến trúc lộn xộn trước khi scale.
```
→ AI quét toàn bộ source code, xuất báo cáo Health Score kèm danh sách Top 5 God Files cần tách trước khi implement tính năng mới.

