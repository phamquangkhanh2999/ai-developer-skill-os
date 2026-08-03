---
# ── Identity ───────────────────────────────────────────────
name: qk-project-bootstrap
version: 9.1.0
status: stable
description: "Khởi tạo dự án mới theo chuẩn V8.2 Blueprint Plugin Generator (project.yaml, 4-folder AI RAG hoặc Coding) với cấu trúc kiên cường."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - project-initialization
  - setup

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "khởi tạo project"
  - "tạo dự án mới"
  - "bootstrap"
  - "setup project"
  - "init repo"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - safety
  - filesystem-boundary

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  owns:
    - project-structure
    - initial-setup
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: bootstrap-validation

selection:
  priority: medium
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: low
side_effects: edit_files
produces: [code, schema, plan]
consumes: [user-description]

token_budget:
  max_files_read: 1
  max_lines_per_read: 50
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-bootstrap — Project Foundation Builder

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Memory Workflow

### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Architecture / Convention (vd: mô hình 4-folder RAG/Agent, blueprint quy chuẩn V9).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Cấu trúc thư mục hoặc template scaffold mẫu mới của dự án.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* File cấu hình local rác (đã đưa vào gitignore).

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---



### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Architecture / Convention (vd: mô hình 4-folder RAG/Agent, blueprint quy chuẩn V9).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Cấu trúc thư mục hoặc template scaffold mẫu mới của dự án.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* File cấu hình local rác (đã đưa vào gitignore).

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---



### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Architecture / Convention (vd: mô hình 4-folder RAG/Agent, blueprint quy chuẩn V9).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Cấu trúc thư mục hoặc template scaffold mẫu mới của dự án.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* File cấu hình local rác (đã đưa vào gitignore).

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## Preconditions
- [ ] Framework/language preference is stated (or ask before proceeding)
- [ ] Project purpose is clear (web app, API, CLI, library)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng cho biết: framework (React/Next.js/NestJS/Express...) và mục đích dự án."
```

---

## Scope & V8.2 Blueprint Generator
- ✅ **One-Click Blueprint Selection:** Choose from Blueprint Plugins (`coding`, `rag`, `workflow`, `enterprise`).
- ✅ **Generate `project.yaml`:** Copy appropriate manifest from `.agents/blueprints/<type>/project.yaml.tpl` to workspace root.
- ✅ **Initialize Project Scaffolding:** Create standard directory structure (including the **4-Folder RAG Architecture** for AI projects).
- ✅ **Initialize Project Knowledge V1:** Setup Local Private Memory architecture (`.ai-local/` directory with automatic `.gitignore` entry included by default) containing concise `AGENTS.md` (<100 lines) and `knowledge/index.yaml` (4 core types: Architecture, Convention, Pattern, Hard Bug).
- ✅ **Configure Tooling:** Linter, Prettier, TypeScript strict mode, or Python environment depending on stack.
- ✅ **Generate `DESIGN.md`:** Mandatory brand & token contract for any UI project.

## Non-Goals
- ❌ Skip `project.yaml` workspace manifest initialization
- ❌ Skip Project Knowledge V1 (`AGENTS.md` & `index.yaml` memory setup in `.ai-local/`)
- ❌ Skip DESIGN.md for UI projects
- ❌ Hardcode outdated dependency versions or absolute machine disk paths
- ❌ Skip README or documentation

---

## V8.2 Blueprint Plugins & Directory Structures

### 1. RAG & AI Agents (The 4-Folder Architecture Blueprint)
*Activated when building AI agents, RAG engines, or domain automation.*
```text
project.yaml              # ⭐ V8.2 Workspace Manifest (Profiles & Capabilities)
.ai-local/                # ⭐ V1 Private Project Memory (Self-Init & Gitignored by default)
├── AGENTS.md             # Project roadmap & quick actions (<100 lines)
└── knowledge/
      └── index.yaml      # Architecture, Convention, Pattern & Hard Bug repository
prompts/                  # Prompt instructions managed as code
├── system/
├── tasks/
└── tools/
data/                     # Strict data discipline
├── raw/                  # IMMUTABLE original files (PDFs, Excel, Revit/CAD)
└── processed/            # Cleaned, standardized chunks for AI ingestion
agents/                   # Agent configurations and domain micro-skills
├── skills/
└── tools/
evals/                    # Quantitative validation evidence
├── tests/
├── traces/               # Audit execution traces
└── scorecards/           # scorecard.yaml eval rubrics
```

### 2. Standard Coding Workspaces (Next.js / React / Node)
*Activated when developing software applications or UI components.*
```text
project.yaml              # ⭐ V8.2 Workspace Manifest
.ai-local/                # ⭐ V1 Private Project Memory (Self-Init & Gitignored by default)
├── AGENTS.md             # Project roadmap & quick actions (<100 lines)
└── knowledge/
      └── index.yaml      # Architecture, Convention, Pattern & Hard Bug repository
src/
├── app/                  # Pages or App Router
├── components/           # Shared UI components & Design system primitives
├── hooks/
├── lib/
├── services/             # API integration & State stores
├── types/
└── styles/
DESIGN.md                 # Brand & Design Contract
```

### 3. Automation Workflows (n8n & Data ETL)
```text
project.yaml              # ⭐ V8.2 Workspace Manifest
.ai-local/                # ⭐ V1 Private Project Memory (Self-Init & Gitignored by default)
workflows/                # Automation graphs & JSON blueprints
connectors/               # API & Database integrations
pipelines/                # Transformation scripts
evals/                    # Traceability logs
```

---

## Required Files Checklist
```
[ ] project.yaml — V8.2 Machine-readable Workspace Manifest
[ ] .ai-local/AGENTS.md — V1 Project Architecture Navigator (<100 lines)
[ ] .ai-local/knowledge/index.yaml — V1 Actionable Knowledge Base (Self-Init on demand)
[ ] package.json / pyproject.toml — dependencies and scripts
[ ] tsconfig.json — strict mode enabled (if TypeScript)
[ ] .eslintrc / .prettierrc — project standard linting and formatting
[ ] .gitignore — standard entries (MUST include .ai-local/ to protect personal project memory)
[ ] README.md — project description + setup instructions
[ ] DESIGN.md — (UI projects) brand contract with color/font/spacing tokens
[ ] evals/scorecard.yaml — (AI/RAG/Workflow projects) eval standard
[ ] .agents/rules/anti-patterns.md — Bắt buộc phải có (chuẩn V8.3 R-C-09)
[ ] .agents/rules/security.md — Bắt buộc phải có (chuẩn V8.3 R-SEC-04)
```
-----

## DESIGN.md Minimum Template
```markdown
# Design System

## Colors (HSL)
--color-primary: hsl(220, 80%, 55%);
--color-surface: hsl(220, 15%, 12%);
--color-text: hsl(220, 10%, 90%);

## Spacing Scale (4px base)
--space-1: 4px; --space-2: 8px; --space-3: 16px;
--space-4: 24px; --space-5: 32px; --space-6: 48px;

## Typography
--font-sans: 'Inter', system-ui, sans-serif;
--font-size-base: 1rem;
--font-size-lg: 1.25rem;

## Border Radius
--radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;

## Animation
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
```

---

## Workflow

### Phase 1 — Blueprint Selection
**Steps:**
1. Assess Preconditions to determine framework/purpose.
2. Select appropriate blueprint (coding, rag, workflow, enterprise).

**Decision:**
```
IF framework/purpose is clear
  → Confidence: HIGH → go to Phase 2
ELSE
  → EXIT: BLOCKED — ask user
```

### Phase 2 — Scaffold Generation
**Steps:**
1. Generate `project.yaml` manifest.
2. Create directory tree structure based on blueprint.
3. Configure tooling and generate `DESIGN.md` if UI project.

**Decision:**
```
IF directories and files are generated
  → Confidence: HIGH → go to Phase 3
ELSE
  → EXIT: FAILED
```

### Phase 3 — Verification
**Steps:**
1. Check Required Files Checklist against what was actually created.
2. Ensure no mandatory files are missing.

**Decision:**
```
IF all required files exist
  → EXIT: SUCCESS
ELSE
  → EXIT: PARTIAL
```

---

## Evidence Format

```
[SEVERITY] path/to/expected-file
Issue:      [MISSING_MANIFEST | MISSING_DESIGN_MD | WRONG_STRUCTURE]
Confidence: HIGH
Fix:        [specific file to create]
```

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | project.yaml manifest created | Never |
| P2 | Core scaffolding per blueprint type | Never |
| P3 | Tooling config | Budget < 40% |
| P4 | DESIGN.md for UI projects | Never for UI |
| P5 | README | Budget < 60% |

---
## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All required files created, structure matches framework standard | Full bootstrap complete |
| PARTIAL | Structure created but DESIGN.md incomplete (UI project) | Follow-up needed |
| BLOCKED | Framework/purpose not specified | Ask user |
| FAILED | Cannot initialize (permission error, invalid framework) | Report error |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Framework explicitly stated, directory structure clear | Build directly |
| MEDIUM | Framework inferred from context (found React imports) | Note assumption, proceed |
| LOW | Cannot determine framework or project type | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|----------|
| CRITICAL | Security misconfiguration in bootstrap | .env with real secrets committed |
| HIGH | Missing mandatory file blocks all future work | No DESIGN.md for UI project |
| MEDIUM | Incomplete setup reduces developer experience | Missing ESLint config |
| LOW | Cosmetic or optional file missing | Missing .editorconfig |

---

## Retry Policy
```
File creation fails
  └─ Check: permission issue vs path error
       ├─ Path error → correct path and retry
       └─ Permission error → EXIT: FAILED, report exact path
            └─ Do NOT retry more than 1 time per file
```

---

## Escalation Rules
```
BLOCKED: Framework or project type not specified
Missing:
  - Framework name (React, Next.js, NestJS, Express, etc.)
  - Project purpose (web app, API, CLI, library)
Questions:
  1. Framework nào bạn muốn dùng?
  2. Dự án này là web app, API server, hay CLI tool?
Recommended Assumptions (if proceeding):
  - Default: Next.js 14 (App Router) + TypeScript + ESLint
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["framework", "project_purpose"],
  "optional_fields": ["project_name", "existing_dir"]
}
```
### Produces
```json
{
  "to": "qk-feature-delivery or qk-ui-builder",
  "output_fields": ["project_structure", "design_md_path", "tooling_config", "exit_code"]
}
```

---
