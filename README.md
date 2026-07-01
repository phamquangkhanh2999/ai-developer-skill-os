# 🚀 AI Developer Skill OS

[![npm version](https://badge.fury.io/js/ai-developer-skill-os.svg)](https://badge.fury.io/js/ai-developer-skill-os)
[![Author](https://img.shields.io/badge/Author-Quang%20Kh%C3%A1nh-blue.svg)](https://github.com/phamquangkhanh2999)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **"Biến mọi AI Code Editor (Cursor, Windsurf, Cline) thành một Senior Engineer thực thụ với 23 kỹ năng được lập trình sẵn."**

---

## 🌟 Tại sao bạn cần Skill OS?

Các AI Editor hiện tại rất thông minh, nhưng nếu không có quy trình rõ ràng, chúng thường **lan man, tự ý sửa code lung tung, hoặc viết code không theo chuẩn kiến trúc**. 

**AI Developer Skill OS (by Quang Khánh)** giải quyết triệt để vấn đề này bằng cách:
- 🧠 **Ép AI tư duy theo Workflow (Chain-of-Thought):** Phân tích trước, code sau.
- 🛡️ **Scope & Non-goals rõ ràng:** Khoá chặt giới hạn, tuyệt đối không cho AI sửa hỏng các file không liên quan.
- 🎨 **Output chuyên nghiệp:** Mọi câu trả lời của AI đều được định dạng thành bảng biểu, báo cáo y hệt một hệ thống thật.

### Hệ thống 23 Kỹ năng (Skillset)
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
Hệ thống sẽ cung cấp cho bạn 2 tuỳ chọn cực kỳ linh hoạt:
- **(1) Local:** Cài vào thư mục ẩn `.qk-ai-skill-os/` ngay trong dự án. (Phù hợp khi làm việc nhóm, commit lên Git để ai cũng xài được).
- **(2) Global:** Cài thẳng vào ổ đĩa máy tính (Home Directory). Từ đó trở đi, bạn mở **BẤT KỲ DỰ ÁN NÀO** cũng sẽ tự động gọi được 23 kỹ năng mà không cần tải lại file! (Rất tuyệt vời cho cá nhân sử dụng).

> 💡 **Tính năng Tự động Dọn dẹp (Auto-Cleanup):** Mỗi khi cài đặt lại, hệ thống sẽ tự động quét và xóa sạch các kỹ năng phiên bản cũ để tối ưu dung lượng và tránh xung đột cho máy tính của bạn. Mọi thứ hoàn toàn tự động!

### Cách 2: Sử dụng Git Submodule
Nếu bạn không dùng Node.js, bạn có thể nhúng trực tiếp qua Git (Chỉ hỗ trợ dạng Local):
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

AI sẽ tự động nhận diện skill qua ngữ cảnh, nhưng để chắc chắn 100% và tiết kiệm thời gian gõ prompt, bạn hãy dùng cú pháp lệnh độc quyền: **`./qk-[tên-skill]`**

Dưới đây là các ví dụ cụ thể để bạn copy - paste và trải nghiệm ngay:

### 1. Nhờ AI lên kế hoạch (Planning) & Kiến trúc
> **`./qk-agent-orchestrator`** Hãy lên kế hoạch làm tính năng Giỏ Hàng cho tôi. Nhớ gọi thêm **`./qk-context-manager`** để đọc cấu trúc dự án trước nhé.

### 2. Xây dựng Giao diện (Frontend/UI)
> **`./qk-ui-builder`** & **`./qk-design-system`** Hãy tạo cho tôi một màn hình Đăng Nhập (Login) xịn xò. Đảm bảo Responsive và dùng đúng chuẩn Component.

### 3. Thiết kế Database (Backend)
> **`./qk-database-engineer`** Hãy viết cho tôi schema Prisma cho bảng Product và User có quan hệ 1-N. Tối ưu index cho truy vấn nhanh.

### 4. Tìm và Diệt Bug (Debugging)
> **`./qk-frontend-debug`** & **`./qk-bug-fix`** Code đang bị crash với lỗi `Hydration error`. Hãy tìm nguyên nhân gốc rễ và sửa dứt điểm giúp tôi.

---

## 💡 Mẹo & Workflow Thực Chiến (Best Practices)

Để khai thác tối đa sức mạnh của 23 kỹ năng, bí quyết là **kết hợp (chaining) nhiều skill** lại với nhau trong cùng một luồng công việc. Dưới đây là các Workflow kinh điển:

### 🌟 1. Workflow Bắt đầu một New Chat (Bắt buộc)
Khi mở một New Chat, AI hoàn toàn chưa biết gì về dự án. Đừng bắt nó code ngay!
* **Bước 1:** `> Dùng ./qk-context-manager để đọc cấu trúc toàn bộ dự án này.`
* **Bước 2:** `> Dùng ./qk-agent-orchestrator để phân tích yêu cầu sau đây và lên kế hoạch: [Yêu cầu của bạn]`

### 🌟 2. Workflow Làm tính năng mới (VD: Tích hợp API)
Muốn tạo một màn hình hiển thị danh sách từ API trả về? Hãy gõ:
* `> Hãy dùng ./qk-api-integration để tạo file gọi API fetch danh sách Users.`
* `> Tiếp theo dùng ./qk-state-management để lưu data này vào Zustand/Redux.`
* `> Cuối cùng dùng ./qk-ui-builder để vẽ màn hình Table hiển thị data đó.`

### 🌟 3. Workflow Chống "Phá Code" (Safe Refactor)
Trước khi đổi một cấu trúc lớn, hãy bắt AI dò mìn:
* `> Hãy chạy ./qk-project-audit để dò xem việc đổi tên biến X có ảnh hưởng đến các component khác không.`
* `> OK, giờ hãy dùng ./qk-refactor để sửa lại một cách an toàn.`

---

## 💎 **Danh sách đầy đủ các Kỹ năng đang có trong Skill OS:**
*(Bạn có thể gọi trực tiếp trên Terminal hoặc Chat)*

> 💡 **Mẹo (Pro-Tip):** Bất cứ khi nào bạn quên mất danh sách kỹ năng hoặc cách dùng, chỉ cần gõ lệnh `./qk-help` (hoặc `@qk-help`), hệ thống sẽ xuất ra toàn bộ cẩm nang sử dụng và bí kíp kết hợp Kỹ năng (Skill Chaining) ngay lập tức!

| Kỹ năng (Skill) | Nhiệm vụ chuyên môn |
|-----------------|---------------------|
| 🧠 **`qk-help`** | **[MỚI] Sách hướng dẫn tra cứu nhanh danh sách Skill và Bí kíp kết hợp** |
| 🧑‍💻 **`qk-ui-builder`** | Xây dựng UI, vẽ Màn hình, chia Layout, tạo Modal cực đẹp |
| 🏗️ **Engineering** | `qk-project-audit`, `qk-agent-orchestrator` | Kiểm toán dự án, lập kế hoạch, quản lý Git, Refactor code. |
| 🎨 **Frontend** | `qk-ui-builder`, `qk-frontend-performance` | Dựng UI, tối ưu tốc độ, test component, quản lý State. |
| ⚙️ **Backend** | `qk-database-engineer`, `qk-auth-security` | Thiết kế DB Schema, bảo mật JWT/OAuth, cấu hình CI/CD. |

👉 [Xem danh sách toàn bộ Kỹ năng tại đây](docs/CHI_TIET_SKILLS.md)

---

<div align="center">
  <b>Được thiết kế và phát triển bởi Quang Khánh (QK)</b><br>
  <i>Empowering Vietnamese Developers with World-Class AI Workflows.</i>
</div>

---

## 📄 License
Được phát hành dưới giấy phép [MIT](LICENSE). Tự do sử dụng, chỉnh sửa và chia sẻ.
