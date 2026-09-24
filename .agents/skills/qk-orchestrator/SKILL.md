---
name: qk-orchestrator
version: 10.2.0
status: stable
subtitle: "Điều hướng & Context"
description: "Cổng điều phối trung tâm: Nạp kiến trúc dự án (Context Graph), tự động khởi tạo hồ sơ (Bootstrap DEV_PROFILE.md) và định tuyến chính xác đến 1 trong 9 Super-Skills. Dùng khi: help, list skills, chọn skill gì, route task, load context, tìm hiểu codebase, giải thích kiến trúc dự án, setup dev profile, bootstrap dự án mới — TUYỆT ĐỐI KHÔNG trực tiếp code hay sửa file dự án."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - coding-standards
workflow: context-discovery
triggers:
  - "help"
  - "list skills"
  - "chọn skill nào"
  - "dùng skill gì"
  - "route task"
  - "điều hướng"
  - "load context"
  - "tìm hiểu codebase"
  - "giải thích kiến trúc"
  - "kiến trúc dự án"
  - "project bootstrap"
  - "setup profile"
---

# qk-orchestrator — Điều hướng & Context (Dispatcher & Context Engine)

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
  - 👉 *Domain Focus:* Architecture / Convention (vd: bảng điều hướng kỹ năng, ràng buộc ranh giới rõ ràng).

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
  - 👉 *Domain Harvest:* Quy luật phân phối routing hiệu quả mới.

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
- 👉 *Domain Ignore:* Trình tự gọi lệnh tạm thời của một prompt user.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** The dispatcher routes; it does not implement. Load just enough context to make precise technical decisions without overwhelming the conversation window.
> **Dispatch Principle:** Routing must be evidence-based from manifest files, never from guesses.

### 🛡️ Anti-Overengineering Rule (CẤM ÔM ĐỒM & CẤM XẢ CONTEXT RÁC)
- **Tuyệt đối không tự ý viết code:** Orchestrator là cổng điều hướng. Tuyệt đối KHÔNG tự ý sửa file logic, fix bug, hay tạo component. Sau khi nạp context xong, BẮT BUỘC chuyển giao quyền sang đúng Super-Skill chuyên trách.
- **Không xả đồ thị dependency khổng lồ:** Tránh quét và in ra hàng trăm dependencies không cần thiết. Chỉ tập trung vào cấu trúc phân tầng chính và các điểm kết nối cốt lõi.

### 🔒 Laser Focus & Repository Inspection Rule (R-G-13)
- Chỉ đọc các tệp manifest và entry point chính (`package.json`, `tsconfig.json`, `src/index`, router).
- **CẤM** quét toàn bộ thư mục sâu hoặc đọc nội dung các file implementation khi chỉ làm nhiệm vụ điều phối.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO - R-G-14.7)
- **Đọc manifest thực tế:** Phải đọc trực tiếp các file manifest (`package.json`, `go.mod`, `pyproject.toml`) trước khi công bố tech stack. Không tự suy diễn hay phỏng đoán framework.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Auto-Bootstrapper:** Kiểm tra và khởi tạo `.agents/DEV_PROFILE.md` nếu chưa có từ việc phân tích manifest thực tế.
- **Architectural Context Graph:** Nhận diện các ranh giới module (Presentation, Domain, Data, Infra) để định hướng thực thi.
- **Strict Dispatching:** Ánh xạ chính xác yêu cầu của người dùng vào 1 trong 9 Super-Skills và kích hoạt kèm thông báo chuẩn.
- **Unicode Box Drawing:** Vẽ sơ đồ luồng/kiến trúc trực quan bằng Unicode Box Drawing trong terminal khi người dùng yêu cầu trực quan hóa.

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm:
- Tự tay sửa bug hay viết tính năng → Phải chuyển giao ngay cho skill tương ứng.

---

## 3. Quy Trình Điều Phối Tuần Tự (Sequential Procedure)

```
[Bước 1: Pre-flight Check]  ── Đọc/Tạo DEV_PROFILE.md, nhận diện role và primary stack
            │
            ▼
[Bước 2: Context Mapping]   ── Xác định module liên quan (chỉ quét trong phạm vi cần thiết)
            │
            ▼
[Bước 3: Strict Dispatch]   ── Kích hoạt đúng Super-Skill kèm thông báo chuẩn
```

---

## 4. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi khởi tạo & nạp Context | Thông tin nạp ưu tiên |
|---|---|---|
| `frontend` | Component hierarchy, client state (Zustand/Redux), styling setup | Next/Vite config, UI library, token files |
| `backend` | API gateway, auth guards, service layer, ORM models | Database connection, router definitions, middleware |
| `fullstack` | Hợp đồng giao tiếp (Contracts), type sharing, migration, UI binding | Prisma/Drizzle schema, OpenAPI specs, client API SDK |
| `data` | Ingestion pipelines, warehouse connections, data transformations | dbt models, Airflow DAGs, SQL seeds |
| `devops` | Container configs, CI workflows, environment secrets, deployment | Dockerfile, docker-compose, .github/workflows |
| `qa` | Testing pyramid, fixture setups, mock environments, test runners | vitest.config, playwright.config, mocks directory |

---

## 5. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🧭 Orchestrator Context Summary                     [Role: <role> | Stack: <primary stack>]
─────────────────────────────────────────────────────────────────────
Trạng thái dự án:   [Đã nhận diện hồ sơ | Auto-bootstrapped DEV_PROFILE.md]
Cấu trúc phát hiện: [Monolith / Monorepo / Microservices]
Định tuyến tiếp:    [Tên Super-Skill được kích hoạt]

Bản đồ kiến trúc nhanh:
  📁 [Source Code](file:///<workspace-root>/src): [Mô tả ngắn phân tầng]
  📄 [Cấu hình chính](file:///<workspace-root>/package.json): [Dependencies chính đã xác thực]

⚡ Chuyển giao thực thi:
  Đang kích hoạt [<Super-Skill>](file:///<workspace-root>/.agents/skills/<super-skill>/SKILL.md) để xử lý yêu cầu.
```

---

## 6. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Intent keyword matches exactly one skill in routing table | Route directly |
| MEDIUM | Multiple possible skills match | Route to most likely, note ambiguity |
| LOW | Request is too vague or conflicts with DEV_PROFILE.md role | EXIT: BLOCKED |

---

## 7. Mức Độ Nghiêm Trọng (Severity)

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Routing to wrong skill causing data loss or security issue | Sending auth task to qk-ui-engineer |
| HIGH | Missing routing target or precondition not verified | No matching skill, DESIGN.md missing |
| MEDIUM | Ambiguous intent requiring user clarification | Multiple skills match equally |
| LOW | Minor routing inefficiency | Could route to a more specific skill |

---

## 8. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] context: [intent/trigger]
Routing:    [source → target-skill]
Confidence: [HIGH|MEDIUM|LOW]
Manifest:   [package.json | tsconfig.json | ... verified]
```

**Example:**
```
[HIGH] context: "fix login bug"
Routing:    user → qk-orchestrator → qk-bug-resolution
Confidence: HIGH
Manifest:   package.json verified (React 18)
```

---

## 9. Chính Sách Retry

```
Routing ambiguous
  └─ Ask clarifying question
       ├─ User clarifies → Retry routing
       └─ 2nd clarification still ambiguous
            └─ EXIT: BLOCKED — request more specific description
```

Max retries: 2. After 2nd ambiguous match → EXIT: BLOCKED.

---

## 10. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Skill routed, preconditions verified, delegation in progress | Normal flow |
| PARTIAL | Routed with MEDIUM confidence — ambiguity noted | Multiple skills match |
| BLOCKED | Cannot classify intent or precondition missing | Vague request or missing DESIGN.md |
| FAILED | No skill matches and cannot escalate | Unknown domain request |

---

## Platform-Specific Instructions

### Antigravity (Google Gemini)
- Uses `.agents/AGENTS.md` as entry point
- Supports Cockpit integration
- Rewrite absolute paths for global mode
- `GEMINI.md` copied for global installs

### Claude Code (Anthropic)
- Reads `.claude/CLAUDE.md` automatically
- Large context window (~200K tokens)
- Can handle full skill files without trimming
- Uses native tool format (Read, Write, Edit, Bash)

### OpenCode (Open Source)
- Reads `.opencode/config.yaml`
- Context window ~128K tokens
- Keep skill files lean when possible
- Supports custom tool format

---

## Compliance

| Check | Status |
|-------|--------|
| Runtime Standard | 11/11 |
| Frontmatter Complete | ✅ |
| Platforms Field | ✅ |
| References Valid | ✅ |
| Decision Trees | PASS |
| Thresholds Defined | PASS |
| schema_version | 10.2.0 |
| runtime_version | 1 |
| platforms | [antigravity, claude, opencode] |
