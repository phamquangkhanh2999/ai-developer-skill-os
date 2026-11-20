# AI Developer Skill OS v13.2.0 — Antigravity Edition

> **v13.2.0: Chuẩn hóa Editorial Diagram & Anti-Slop Specs, một hợp đồng nghiệm thu, 2 nhịp thực thi (Iterative Batch vs Milestone Gate), Lifecycle Hooks & Native Plugin.**

## Kiến trúc Antigravity với 5 Core Skills

- **5 Core Skills chính:**
  1. `qk-feature-delivery`: Xây dựng tính năng mới, đổi yêu cầu, tích hợp API, lập đặc tả (chế độ plan-only, discovery-only, prompt-only).
  2. `qk-bug-resolution`: Chẩn đoán nguyên nhân gốc rễ và sửa lỗi mã nguồn theo chu trình khép kín: Observe → Evidence → Cause → Minimal Fix → Verify.
  3. `qk-code-review`: Kiểm toán mã nguồn và bảo mật chỉ đọc (Read-Only) với bằng chứng cụ thể.
  4. `qk-code-cleaner`: Tái cấu trúc bảo toàn hành vi (Zero Behavior Change), nâng cấp thư viện an toàn và viết test.
  5. `qk-devops-release`: Vận hành nền tảng CI/CD, Docker, phát hành có rollback, cập nhật tài liệu và quản lý memory khi được yêu cầu.

- **Tài liệu tham khảo chuyên môn (On-demand References):**
  - Đặt tại `.agents/references/`: `diagram-spec.md`, `requirements.md`, `ui.md`, `backend-data.md`, `api-discovery.md`, `prompt-authoring.md`, `context-discovery.md`.
  - Nạp khi cần thiết, không làm phình context ban đầu.

- **Ánh xạ tên skill cũ (Legacy Aliases):**
  - Khai báo tại `.agents/skill-aliases.yml`: chuyển hướng các tên lệnh cũ (`qk-ui-engineer`, `qk-backend-data`, `qk-api-data-discovery`, `qk-product-spec`, `qk-prompt-compiler`, `qk-orchestrator`) về core skill và reference tương ứng.
  - Đây là hướng dẫn định tuyến cho agent, không tạo executable hay slash command riêng.
  - Bảo đảm các chế độ không sinh code: `plan-only`, `prompt-only`, `discovery-only`.

- **Quản lý phát hành & Migration Manifest:**
  - File quản lý `.ai-skill-os-managed.json` tự động theo dõi checksum của mọi file hệ thống.
  - Khi nâng cấp: tự động dọn sạch các file cũ đã retire mà người dùng không sửa đổi, đồng thời bảo toàn 100% file custom và private memory (`DEV_PROFILE.md`, `.ai-local/`).

### Nâng cấp và cài đặt

```bash
# 1. Cài dạng Native Antigravity Plugin (bật/tắt live trên UI Customizations, khuyến nghị):
node bin/install.js --ide=antigravity --mode=plugin

# 2. Cài Global truyền thống cho mọi dự án trên máy (~/.gemini/config):
node bin/install.js --ide=antigravity --scope=2

# 3. Khi đã có Global/Plugin, chỉ tạo DEV_PROFILE.md riêng cho từng dự án (không nhân đôi Rules):
node bin/install.js --ide=antigravity --scope=profile

# 4. Cài Local độc lập trọn bộ cho một repo nhóm (./.agents/ + ./GEMINI.md):
node bin/install.js --ide=antigravity --scope=1
```

Installer tự động lọc bỏ tài liệu quản trị nội bộ (`.agents/docs/`), backup toàn bộ thư mục đích trước khi cập nhật, hỗ trợ rollback tức thì và đi kèm bộ Lifecycle Safety Hooks (`.agents/hooks.json`: bật sẵn `qk-registry-guard` chặn sửa tay `registry/`, kèm `qk-destructive-command-guard` dạng opt-in).

---

## Cấu Trúc Hệ Thống

```
.agents/
├── DEV_PROFILE.md        ← Khai báo role + stack của bạn (AI đọc đầu mỗi session)
├── AGENTS.md             ← Entry Point chính điều phối đến 5 Core Skills
├── skill-aliases.yml     ← Ánh xạ lệnh cũ sang 5 core skills
├── skills/               ← 5 Core Skills
├── references/           ← Tài liệu chuyên môn nạp theo nhu cầu (UI, Backend, API, Spec)
├── rules/                ← Hợp đồng thực thi chung (global.md, safety, security...)
└── registry/             ← Metadata và graph được tạo tự động (index.yaml, graph.json)
```

---

## Bắt Đầu Nhanh

### Bước 1 — Khai báo role và stack một lần

Tạo hoặc chỉnh sửa `.agents/DEV_PROFILE.md` trong dự án của bạn:

```yaml
role: fullstack          # fe | be | fullstack | data | ai-engineer | devops | qa | pm | ba...
stack:
  frontend:  Next.js 15 + TypeScript
  backend:   Node.js + Fastify / NestJS
  database:  PostgreSQL + Prisma
  css:       Tailwind CSS
ai_style: concise        # concise | detailed | teaching
```

### Bước 2 — Gọi skill trong Antigravity

Gõ slash command native của một trong 5 skills:

```text
/qk-feature-delivery
/qk-bug-resolution
/qk-code-review
/qk-code-cleaner
/qk-devops-release
```

Antigravity cũng tự chọn skill theo prompt và description. Alias cũ trong `skill-aliases.yml` chỉ là ánh xạ hướng dẫn; để gọi thủ công, dùng core skill đích.

```text
# Hoặc dùng ngôn ngữ tự nhiên — AI tự động nhận diện:
"làm tính năng mới xuất excel"              → qk-feature-delivery + references/ui.md
"viết lại prompt cho task này"              → qk-feature-delivery [prompt-only] + references/prompt-authoring.md
"fix bug crash màn hình checkout"           → qk-bug-resolution
"thiết kế api đặt hàng và migration db"     → qk-feature-delivery + references/backend-data.md
"phân tích postman và lấy schema"           → qk-feature-delivery [discovery-only] + references/api-discovery.md
"review bảo mật và đo nợ kỹ thuật dự án"    → qk-code-review
"tách file UserService.ts bị quá dài"       → qk-code-cleaner
"chuẩn bị release lên production"           → qk-devops-release
```

---

## Danh Mục 5 Core Skills & On-Demand References

| Core Skill | Phụ Đề Dev (Nhiệm vụ cốt lõi) | Phạm vi & Năng lực thực chiến | Tham khảo chuyên môn (On-demand References) |
|---|---|---|---|
| `qk-feature-delivery` | **Build Feature & Tích hợp** | Phát triển tính năng mới trọn gói, đổi yêu cầu, tích hợp API, lập đặc tả (hỗ trợ các chế độ non-code: `plan-only`, `discovery-only`, `prompt-only`) | `requirements.md`, `ui.md`, `backend-data.md`, `api-discovery.md`, `prompt-authoring.md` |
| `qk-bug-resolution` | **Debug & Fix Bug** | Chẩn đoán nguyên nhân gốc rễ và dập lỗi theo chu trình khép kín 5 bước: Observe → Evidence → Cause → Minimal Fix → Verify | `ui.md`, `backend-data.md` |
| `qk-code-review` | **Review Code & Audit** | Đánh giá mã nguồn kiến trúc chỉ đọc (Read-Only), đo lường nợ kỹ thuật, quét bảo mật OWASP Top 10, kiểm toán WCAG | `backend-data.md`, `ui.md` |
| `qk-code-cleaner` | **Refactor & Viết Test** | Tái cấu trúc bảo toàn hành vi (Zero Behavior Change), nâng cấp thư viện tiệm tiến, bổ sung kiểm thử tự động | `backend-data.md`, `ui.md` |
| `qk-devops-release` | **DevOps, CI/CD & Deploy** | Vận hành nền tảng CI/CD (Docker, GitHub Actions), phát hành sản phẩm an toàn có Rollback, đồng bộ tài liệu | `context-discovery.md` |

---

## Công Cụ & Scripts Quản Trị

```bash
# Tái tạo registry từ 5 Core Skills:
node tooling/build-registry.js
```

## Giới hạn và kiểm chứng v13

`tooling/route-resolver.js` là trợ giúp routing offline, không phải hook của Antigravity. Test metadata hay installer chỉ xác nhận lớp tương ứng. Đánh giá hiệu quả phải dùng task thật, trace và kết quả độc lập; không lấy số test tự sinh pass làm chứng nhận. Hợp đồng báo cáo/nghiệm thu duy nhất tại `.agents/rules/global.md`.
