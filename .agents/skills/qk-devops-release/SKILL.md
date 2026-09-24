---
name: qk-devops-release
version: 10.1.0
status: stable
subtitle: "DevOps, CI/CD & Deploy"
description: "Vận hành Nền tảng, Tự động hóa CI/CD, Cổng kiểm soát phát hành 8-Gate Production, Đồng bộ tài liệu kỹ thuật, Bộ nhớ dự án (.ai-local/) và Kỹ nghệ AI/RAG. Dùng khi: ci/cd, deployment, pipeline, docker, dockerfile, devops, github actions, deploy production, release checklist, go live, rollout, viết docs, readme, swagger, lưu context, project memory, /learn, build ai, rag pipeline, prompt engineering — TUYỆT ĐỐI KHÔNG dùng khi debug lỗi logic ứng dụng (dùng qk-bug-resolution)."
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
