---
name: qk-devops-release
version: 10.2.0
status: stable
subtitle: "DevOps, CI/CD & Deploy"
description: "Vận hành Nền tảng, Tự động hóa CI/CD, Cổng kiểm soát phát hành 8-Gate Production, Đồng bộ tài liệu kỹ thuật, Bộ nhớ dự án (.ai-local/) và Kỹ nghệ AI/RAG. Dùng khi: ci/cd, deployment, pipeline, docker, dockerfile, devops, github actions, deploy production, release checklist, go live, rollout, viết docs, readme, swagger, lưu context, project memory, /learn, build ai, rag pipeline, prompt engineering — TUYỆT ĐỐI KHÔNG dùng khi debug lỗi logic ứng dụng (dùng qk-bug-resolution)."
platforms: [antigravity, claude, opencode]
runtime_version: 1
tools:
  - filesystem
  - terminal
rules:
  - global
  - platform
  - security
  - safety
workflow: production-release
triggers:
  - "ci/cd"
  - "deployment"
  - "pipeline"
  - "docker"
  - "dockerfile"
  - "devops"
  - "github actions"
  - "deploy production"
  - "release checklist"
  - "go live"
  - "rollout"
  - "viết docs"
  - "readme"
  - "swagger"
  - "lưu context"
  - "project memory"
  - "/learn"
  - "build ai"
  - "rag pipeline"
  - "prompt engineering"
---

# qk-devops-release — DevOps, CI/CD & Deploy (Platform, Release Gate & Memory Engine)

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

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

## 1. Nguyên Tắc Cốt Lõi & Luật Chống Over-Engineering

> **Core Principle:** Right-size infrastructure. Do not design a Kubernetes cluster for a static site. Automation must be dependable, reproducible, and guarded by strict safety gates.
> **Release Principle:** PASS is a verified conclusion, never a target. Zero fake green gates.

### 🛡️ Anti-Overengineering Rule (KHÔNG PHỨC TẠP HÓA HẠ TẦNG)
- **Tương xứng quy mô hạ tầng:** Nếu dự án chỉ là web app vừa và nhỏ, Docker Compose hoặc single-stage container là đủ. Tuyệt đối KHÔNG tự ý đề xuất setup Kubernetes, Helm, Istio service mesh phức tạp hóa trừ khi người dùng yêu cầu rõ ràng.
- **Tài liệu ngắn gọn, thực chiến:** README chỉ cần 3 bước chuẩn (Prerequisites → Setup → Run). Không viết lan man hàng trang lý thuyết không ai đọc.

### 🔒 No Unrelated Changes Rule (CẤM SỬA LAN MAN)
- Chỉ can thiệp vào Dockerfile, CI/CD pipeline, deploy scripts hoặc docs được yêu cầu.
- **CẤM** nhân tiện sửa code nghiệp vụ của ứng dụng trong cùng một commit hạ tầng.
- Nếu phát hiện code lỗi trong app: **Chuyển giao quyền** cho `qk-bug-resolution`, không tự ý sửa.

### 🛡️ Anti-Fake-Pass Rule (CẤM ÉP PASS ẢO - R-G-14.5)
- **CẤM** thêm cờ bỏ qua lỗi (`|| true`, `--no-verify`, `continue-on-error: true`) vào CI pipeline chỉ để ép build xanh.
- **CẤM** hardcode secret hoặc credentials vào Dockerfile/Compose chỉ để test cho nhanh.
- **CẤM** tự ý đánh dấu PASS cho 8 Gates nếu thiếu bằng chứng thực tế.

### ⚖️ Verify Before Claim Rule (XÁC MINH TRƯỚC KHI BÁO CÁO - R-G-14.7)
- **Cấm tuyên bố 8 Cổng Đạt nếu chưa chạy lệnh:** Phải chạy test suite và build trước khi tick xanh các cổng Gate 1 và Gate 2.
- **Báo cáo trung thực:** Nếu không có Docker daemon chạy cục bộ hoặc không có quyền truy cập CI runner, AI phải ghi rõ: `"Trạng thái: NOT VERIFIED — Đã kiểm tra cú pháp Dockerfile/CI tĩnh. Chưa build image thực tế trong môi trường này"`.

---

## 2. Ranh Giới & Phạm Vi Kỹ Thuật (Hard Boundaries)

### ✅ Việc skill này BẮT BUỘC làm:
- **Production-Ready Dockerfile:** Multi-stage build, Non-root user (`USER node/appuser`), layer caching tối ưu, và healthcheck directive.
- **8-Gate Production Gatekeeper:** Rà soát nghiêm ngặt 8 cổng an toàn trước khi deploy. **Chỉ cần 1 cổng đỏ = CHẶN release ngay lập tức**.
- **Accurate Documentation (Code-First Truth):** Viết tài liệu khớp 100% với code thực tế đang chạy.
- **Institutional Memory (`.ai-local/`, `/learn`):** Ghi nhớ các quyết định kiến trúc và bài học fix bug phức tạp vào `.ai-local/knowledge/` (đã gitignore).

### ❌ Việc skill này TUYỆT ĐỐI KHÔNG làm (Chuyển giao quyền):
- Viết API endpoint hay logic truy vấn database ứng dụng → Chuyển sang `qk-backend-data`.
- Điều tra bug crash logic trong mã nguồn → Chuyển sang `qk-bug-resolution`.

---

## 3. 8 Cổng Kiểm Soát Phát Hành Production (8-Gate Checklist)

```
Gate 1: Test Suite Green       ── 100% tests pass (Verify bằng lệnh thực tế)
Gate 2: Security Clean         ── 0 lỗ hổng Critical/High, 0 secret leak trong commit
Gate 3: Safe DB Migrations     ── Migration có tính tương thích ngược và có down script
Gate 4: Environment Variables  ── Mọi biến mới đã được khai báo trong .env.example
Gate 5: Rapid Rollback Plan    ── Quy trình rollback được xác định rõ ràng (< 5 phút)
Gate 6: Smoke Test Plan        ── Danh sách 3-5 endpoints then chốt để test ngay sau deploy
Gate 7: SemVer & Git Tag       ── Đã bump version đúng chuẩn Semantic Versioning
Gate 8: Release Notes Ready    ── Bản tóm tắt thay đổi sẵn sàng
```

---

## 4. Xử Lý Sự Cố Khi Release Gate Thất Bại (Failure Path)

Nếu bất kỳ cổng nào trong 8 cổng không đạt:
1. **CHẶN RELEASE NGAY:** Không nhắm mắt làm ngơ cho deploy.
2. **Nêu rõ cổng thất bại:** Báo cáo chi tiết lý do cổng bị chặn (ví dụ: Gate 1 fail do 2 unit test đỏ; Gate 4 fail do biến `STRIPE_SECRET_KEY` chưa có trong `.env.example`).
3. **Kế hoạch khôi phục khi deploy dở dang:** Kích hoạt rollback ngay lập tức:
   ```bash
   git revert <commit_hash>
   # hoặc pull lại container image tag an toàn trước đó
   ```

---

## 5. Thích Ứng Theo Role Kỹ Thuật (Role Adaptation)

| Role | Trọng tâm khi chạy DevOps & Release | Hành vi kỹ thuật đặc thù |
|---|---|---|
| `devops` | Dockerfile, CI/CD pipeline, Kubernetes/Helm, secrets management | Tối ưu image size, caching layers, rollback automation |
| `ai-engineer` | RAG architecture, vector db, prompt template, evaluation metrics | Chunking strategy, reranking, scorecard eval |
| `pm` | Release notes, changelog, feature readiness, user impact | Viết release notes tóm tắt giá trị cho người dùng |
| `fullstack` | Docker-compose cho local dev, đồng bộ env vars, verify smoke test | Cập nhật `.env.example`, kiểm tra build bundle size |

---

## 6. Báo Cáo Nghiệm Thu Chuẩn Xác (Truth-First Report)

```markdown
🚀 DevOps & Release Summary                           [Role: <role> | Task: <Deploy / CI-CD / Docs>]
─────────────────────────────────────────────────────────────────────
Mục tiêu thực hiện: [Cấu hình CI/CD / 8-Gate Release Check / Sync Docs]
Trạng thái:         [SẴN SÀNG RELEASE / BỊ CHẶN (RELEASE BLOCKED) / ĐÃ CẤU HÌNH]

Chi tiết kỹ thuật:
  • [Docker]        [Dockerfile](file:///<workspace-root>/Dockerfile): Multi-stage, Non-root
  • [CI/CD]         [.github/workflows/ci.yml](file:///<workspace-root>/.github/workflows/ci.yml)
  • [Documentation] [README.md](file:///<workspace-root>/README.md): Đồng bộ với code thực tế

Tình trạng 8 Cổng An Toàn (Truth-First):
  • Gate 1 (Tests):        [Pass 100% (Đã chạy thực tế) / Chưa verify]
  • Gate 2 (Security):     [0 Critical / Cần quét]
  • Gate 3 (Migration):    [Tương thích ngược / Không có migration]
  • Gate 4 (Env Vars):     [Đã cập nhật .env.example]
  • Gate 5 (Rollback):     [Sẵn sàng lệnh revert]
  • Gate 6 (Smoke Test):   [Đã có 3 endpoints kiểm tra]
  • Gate 7 (SemVer):       [Bump vX.Y.Z]
  • Gate 8 (Changelog):    [Sẵn sàng Release Notes]
```

---

## 7. Mô Hình Độ Tin Cậy (Confidence Model)

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence available | Proceed |
| MEDIUM | Some assumptions needed | Note assumptions |
| LOW | Insufficient evidence | EXIT: BLOCKED |

---

## 8. Thoái Ra Mã (Exit Codes)

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Task completed and verified | All acceptance criteria met |
| PARTIAL | Task done with minor gaps | Some checks skipped |
| BLOCKED | Missing precondition or info | Ask user |
| FAILED | Task failed after max retries | Report error |

---

## 9. Bằng Chứng Định Dạng (Evidence Format)

```
[SEVERITY] path/to/file.ts:LINE
Reason:     [why this matters]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [suggestion]
```

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
