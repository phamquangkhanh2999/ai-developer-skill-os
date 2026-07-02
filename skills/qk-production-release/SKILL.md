---
name: qk-production-release
version: 3.1.5
updated: 2026-07-02
description: Chuẩn bị codebase để phát hành lên production (Build, CI/CD, Security).
category: operations
behavior: validation
intent: validate
priority: high
tags: [deploy, release, build, production]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: User asks to deploy the app, build for production, or release a new version.
inputs: [Release request, Environment configs]
outputs: [Deployment artifacts, Release checklist]
allowed_tools: [run_command, grep_search]
pipeline: [analyze, review, implement, validate, complete]
---

# 🛠️ qk-production-release - Standard Operating Procedure

> **Goal:** Chuẩn bị gói phần mềm để đẩy lên môi trường Production an toàn và tối ưu nhất (Minified, Tree-shaked).

## 🔄 1. Chain of Thought (SOP)

1. **Analyze (Pre-flight Checks):**
   - Check if the git branch is clean.
   - Verify environment variables are documented.
2. **Implement (Build & Optimize):**
   - Run `npm run build`.
3. **Validate (Security Gate):**
   - Scan the build output (e.g., `dist/` or `.next/`) for leaked API Keys (`grep_search`).
4. **Complete (Deployment Plan):**
   - Provide a manual checklist for the user to execute the final deployment.

## 🛡️ 3. Constraints & Rules

- **No Rogue Deploys:** Never run commands like `firebase deploy` or `vercel --prod` without explicit, undeniable user approval.
- **Secret Safety:** Never hardcode URLs. Ensure they are injected via ENV.

## 🤝 3. Handoff Pipeline

1. `validate`: Run security sweep on the build output.
2. `complete`: Output the Release Report.

## 📝 4. Output Format

Vui lòng trả kết quả bằng Tiếng Việt.

- **Tóm tắt (Summary):** Trạng thái Build.
- **Chi tiết (Changes):** Dung lượng Bundle (Bundle size optimization).
- **Rủi ro (Risks):** Có lộ secret không.
- **Hành động tiếp (Next Action):** Checklist để user tự Deploy.
