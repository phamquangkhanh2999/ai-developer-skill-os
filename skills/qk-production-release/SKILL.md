---
name: qk-production-release
description: Build, CI/CD, Deploy, Observability, Security Release.
mode_supported: [enterprise]
input: [Release candidate]
output: [Production deployment]
workflow: [1. Build -> 2. CI -> 3. Deploy -> 4. Observe -> 5. Security Audit]
allowed_tools: [run_command]
handoff_to: [none]
---

# 🛠️ qk-production-release - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Build, CI/CD, Deploy, Observability, Security Release.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `none`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Deployment & DevOps

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User asks "how do I deploy this?", "create a Dockerfile", or "setup CI/CD"
- Configuring GitHub Actions, GitLab CI, or Jenkins
- Preparing a project for Vercel, Netlify, Render, or AWS
- Setting up environment variables for production

---

## Scope

- ✅ **Containerization:** Write `Dockerfile` and `docker-compose.yml`.
- ✅ **CI/CD Pipelines:** Write GitHub Actions YAML for testing, building, and deploying.
- ✅ **Environment Setup:** Create `.env.example` and document required production variables.
- ✅ **Build Scripts:** Ensure `package.json` has correct build and start commands.

---

## Non-goals

- ❌ Do NOT expose real production secrets. Always use placeholders or CI secrets.
- ❌ Do NOT over-complicate (e.g., don't setup Kubernetes if a simple Docker container on a VPS is enough).

---

## Workflow

### Phase 1 — Platform Selection

Ask the user where they are deploying (if not specified):
1. **PaaS (Vercel, Render, Heroku):** Very easy, mostly relies on `vercel.json` or standard build scripts. No Docker needed usually.
2. **VPS/VM (DigitalOcean, AWS EC2):** Needs Docker and/or PM2 + Nginx reverse proxy.
3. **Container Service (AWS ECS, Google Cloud Run):** Needs a highly optimized Dockerfile.

### Phase 2 — Containerization (If required)

Create a multi-stage Dockerfile for minimal image size:
1. `deps` stage: Install dependencies.
2. `builder` stage: Build the app.
3. `runner` stage: Copy only the built assets and prod modules, start the app.

### Phase 3 — CI/CD Pipeline

Create `.github/workflows/deploy.yml`:
- Trigger on `push` to `main`.
- Job 1: Setup Node/Python/Go, install deps, run tests, run linter.
- Job 2: Build image and push to registry, or deploy to PaaS.

### Phase 4 — Environment Variables

Audit the codebase for `process.env.XYZ` and create a `.env.example` file listing every required variable.

---

## Output Format

```
🚀 Deployment Plan
─────────────────────────────────────────────────
Target:     [Vercel / Docker VPS / AWS]
Tooling:    [GitHub Actions, Docker]

Files Created/Modified:
  ✅ `Dockerfile` (Multi-stage build)
  ✅ `.github/workflows/deploy.yml`
  ✅ `.env.example`

⚠️ Prerequisites:
  Before deploying, you must set these secrets in GitHub Actions:
  - `DOCKER_USERNAME`
  - `DATABASE_URL`

🔗 Next Steps:
  Commit these files and push to `main` to trigger the pipeline.
```
