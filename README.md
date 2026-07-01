# 🚀 AI Developer Skill OS

[![npm version](https://badge.fury.io/js/ai-developer-skill-os.svg)](https://badge.fury.io/js/ai-developer-skill-os)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A multi-agent skill package for AI coding assistants (Claude Code, Cursor, Windsurf, Antigravity/Gemini).**  
Hệ điều hành kỹ năng (Skill OS) giúp biến AI của bạn từ một "cỗ máy sinh code" thành một Senior Software Engineer thực thụ với quy trình làm việc chuẩn mực.

> Tác giả: **Quang Khánh**

---

## 🌟 Tính năng nổi bật (Features)

Bộ Skill OS cung cấp **23 kỹ năng chuyên biệt**, chia làm 3 nhóm chính:
- 🛠️ **Engineering Core (8 skills):** Agent Orchestrator (Lên kế hoạch), Context Manager, Project Audit, Bug Fix, Refactor, API Integration, Migration, Git Engineer.
- 🎨 **Frontend (11 skills):** Frontend Architecture, Design System, UI Builder, Component Generator, State Management, Form Builder, Table CRUD, Debug, Testing, Performance, A11Y Audit.
- ⚙️ **Backend (4 skills):** Backend Architecture, Database Engineer, Auth & Security, Deployment (DevOps).

👉 [Xem chi tiết chức năng của toàn bộ 23 Skills tại đây](docs/CHI_TIET_SKILLS.md)

---

## 📦 Cài đặt (Installation)

Bạn có thể cài đặt bộ Skill này vào bất kỳ dự án nào cực kỳ nhanh chóng qua NPM hoặc Git.

### Cách 1: Sử dụng NPM (Khuyên dùng)
Mở terminal tại thư mục gốc dự án của bạn và chạy:
```bash
npx ai-developer-skill-os init
```
*Lệnh này sẽ tự động tải và khởi tạo thư mục `rules-skill/` chứa toàn bộ kỹ năng vào dự án của bạn.*

### Cách 2: Sử dụng Git Submodule
Nếu bạn không dùng Node.js, bạn có thể nhúng trực tiếp qua Git:
```bash
git submodule add https://github.com/phamquangkhanh2999/ai-developer-skill-os.git rules-skill
```

---

## 🛠️ Cấu hình cho IDE / AI Agent

Sau khi thư mục kỹ năng đã xuất hiện trong dự án của bạn, hãy cấu hình để AI biết cách sử dụng nó.

### Cho Antigravity / Gemini IDE
**Không cần cấu hình gì thêm!** Nếu bạn đã cài đặt bằng cờ `--gemini` (thư mục `.agents/skills/`), hệ thống sẽ tự động quét và load toàn bộ 23 kỹ năng này. Bạn có thể sử dụng ngay lập tức!

### Cho Cursor / Windsurf (AI Code Editors)
Tạo file `.cursorrules` (nếu dùng Cursor) hoặc `.windsurfrules` (nếu dùng Windsurf) ở gốc dự án và dán đoạn sau vào:
```md
# AI Developer Skill OS by Quang Khánh

When answering or generating code, you MUST act as an expert engineer using the skills defined in `./rules-skill/skills.json`.
Always read the relevant `SKILL.md` from `./rules-skill/skills/` before providing a solution.
Speak to me in Vietnamese, but write all code in English.
```

### Cho Cline / Roo Code / Kilo Code (VS Code Extensions)
Tạo file `.clinerules`, `.roorules` hoặc `KILO.md` ở gốc dự án và dán nội dung:
```md
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).
Vui lòng tìm đọc danh sách kỹ năng tại file `./rules-skill/skills.json`. Trước khi thực hiện bất kỳ yêu cầu nào, hãy gọi file `SKILL.md` tương ứng trong thư mục `./rules-skill/skills/`.
Luôn giao tiếp bằng tiếng Việt nhưng viết code bằng tiếng Anh.
```

### Cho GitHub Copilot
Tạo file `.github/copilot-instructions.md` và dán đoạn prompt tương tự như trên vào file này để Copilot học được các kỹ năng.

---

## 🎯 Cách kiểm tra cài đặt thành công

Để biết AI của bạn đã thực sự "nhập môn" bộ Skill OS này chưa, hãy mở khung chat AI trong dự án và gõ chính xác câu sau:
> *"Hãy kích hoạt skill project-audit và cho tôi biết bạn sẽ làm những gì."*

✅ **Thành công:** Nếu AI trả lời bằng tiếng Việt, liệt kê đúng các bước khám bệnh (Phase 1, Phase 2, Phase 3...) theo đúng như trong file `SKILL.md` của `project-audit`.
❌ **Thất bại:** Nếu AI trả lời chung chung hoặc bảo không biết skill này là gì, bạn cần kiểm tra lại đường dẫn file cấu hình ở bước trên.

---

## 🚀 Cách sử dụng (Usage)

Giờ đây bạn chỉ cần chat với AI như giao việc cho một kỹ sư thật sự. Không cần viết prompt dài dòng!

- **Nhờ AI lên kế hoạch:** *"Dự án này đang cần thêm tính năng Đăng nhập. Cậu lên kế hoạch giúp mình nhé."* (Kích hoạt `agent-orchestrator`)
- **Fix lỗi:** *"Bị lỗi Hydration error trên Next.js rồi. Fix giúp mình."* (Kích hoạt `bug-fix` / `frontend-debug`)
- **Audit Code:** *"Audit nhanh cho tôi thư mục src/components/ xem có vấn đề gì không."* (Kích hoạt `project-audit`)

👉 [Đọc Hướng Dẫn Sử Dụng chi tiết tại đây](docs/HUONG_DAN_SU_DUNG.md)

---

## 📄 License
Được phát hành dưới giấy phép [MIT](LICENSE). Tự do sử dụng, chỉnh sửa và chia sẻ.
