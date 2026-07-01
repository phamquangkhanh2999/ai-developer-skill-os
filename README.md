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
*Lệnh này sẽ tự động tải và khởi tạo thư mục ẩn `.qk-ai-skill-os/` chứa toàn bộ kỹ năng vào dự án của bạn.*

### Cách 2: Sử dụng Git Submodule
Nếu bạn không dùng Node.js, bạn có thể nhúng trực tiếp qua Git:
```bash
git submodule add https://github.com/phamquangkhanh2999/ai-developer-skill-os.git .qk-ai-skill-os
```

---

## 🛠️ Cấu hình cho IDE / AI Agent

Sau khi thư mục kỹ năng đã xuất hiện trong dự án của bạn, hãy cấu hình để AI biết cách sử dụng nó.

### Cho Antigravity / Gemini IDE
**Không cần cấu hình gì thêm!** Nếu bạn đã cài đặt bằng cờ `--gemini` (thư mục `.agents/skills/`), hệ thống sẽ tự động quét và load toàn bộ 23 kỹ năng này. Bạn có thể sử dụng ngay lập tức!

### Cho Claude Code / Kilo Code (CLI Agents)
Tạo file `CLAUDE.md` (hoặc `KILO.md`) ở gốc dự án và dán đoạn sau vào:
```md
# System Instructions
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).

Vui lòng tìm đọc danh sách kỹ năng tại file `./.qk-ai-skill-os/skills.json`.
ĐẶC BIỆT LƯU Ý: Bất cứ khi nào người dùng gõ lệnh bắt đầu bằng `./qk [tên-skill]`, bạn BẮT BUỘC phải gọi và đọc nội dung file `SKILL.md` tương ứng trong thư mục `./.qk-ai-skill-os/skills/` trước khi phân tích hoặc viết code.
Luôn giao tiếp bằng tiếng Việt nhưng viết code, đặt tên biến, comment trong code bằng tiếng Anh.
```

### Cho Cline / Roo Code (VS Code Extensions)
Tạo file `.clinerules` hoặc `.roorules` ở gốc dự án và dán nội dung:
```md
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).
Vui lòng tìm đọc danh sách kỹ năng tại file `./.qk-ai-skill-os/skills.json`.
Bất cứ khi nào người dùng gõ lệnh `./qk [tên-skill]`, bạn BẮT BUỘC phải đọc file `SKILL.md` tương ứng trong thư mục `./.qk-ai-skill-os/skills/`.
Luôn giao tiếp bằng tiếng Việt nhưng viết code bằng tiếng Anh.
```

### Cho GitHub Copilot
Tạo file `.github/copilot-instructions.md` và dán đoạn prompt tương tự như trên vào file này để Copilot học được các kỹ năng.

---

## 🎯 Cách kiểm tra cài đặt thành công

Để biết AI của bạn đã thực sự "nhập môn" bộ Skill OS này chưa, hãy mở khung chat AI trong dự án và gõ cú pháp lệnh chuyên nghiệp sau:
> **`./qk project-audit`** Hãy cho tôi biết bạn sẽ làm những gì.

✅ **Thành công:** Nếu AI trả lời bằng tiếng Việt, liệt kê đúng các bước khám bệnh (Phase 1, Phase 2, Phase 3...) theo đúng như trong file `SKILL.md` của `project-audit`.
❌ **Thất bại:** Nếu AI trả lời chung chung hoặc bảo không biết skill này là gì, bạn cần kiểm tra lại đường dẫn file cấu hình ở bước trên.

---

## 🚀 Cách gọi lệnh Skill chuyên nghiệp (Usage)

AI sẽ tự động nhận diện skill qua ngữ cảnh, nhưng để chắc chắn 100% và tiết kiệm thời gian gõ prompt, bạn hãy dùng cú pháp lệnh độc quyền: **`./qk [tên-skill]`**

Dưới đây là các ví dụ cụ thể để bạn copy - paste và trải nghiệm ngay:

### 1. Khi bắt đầu dự án / Nhờ AI lên kế hoạch (Planning)
> **`./qk agent-orchestrator`** Hãy lên kế hoạch làm tính năng Giỏ Hàng cho tôi. Nhớ gọi thêm **`./qk context-manager`** để kiểm tra thư mục hiện tại có những file gì trước nhé.

### 2. Khi muốn tạo Giao diện (UI)
> **`./qk ui-builder`** & **`./qk design-system`** Hãy tạo cho tôi một màn hình Đăng Nhập (Login) sử dụng Tailwind CSS. 

### 3. Khi muốn làm việc với Database (Backend)
> **`./qk database-engineer`** Hãy viết cho tôi schema Prisma cho bảng Product và User có quan hệ 1-N. 

### 4. Khi gặp Bug cứng đầu
> **`./qk frontend-debug`** & **`./qk bug-fix`** Code đang bị crash với lỗi `Hydration error`. Hãy tìm hiểu nguyên nhân gốc rễ và sửa nó giúp tôi.

👉 [Đọc Hướng Dẫn Sử Dụng chi tiết tại đây](docs/HUONG_DAN_SU_DUNG.md)

---

## 📄 License
Được phát hành dưới giấy phép [MIT](LICENSE). Tự do sử dụng, chỉnh sửa và chia sẻ.
