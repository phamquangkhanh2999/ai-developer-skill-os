# Hướng Dẫn Sử Dụng — AI Developer Skill OS

**Tác giả:** Quang Khánh  
**Phiên bản:** v1.0.1  

Chào mừng bạn đến với **AI Developer Skill OS**, bộ khung quản lý kỹ năng (Skill Framework) biến các trợ lý AI (Gemini, Antigravity, Claude Code, Cursor, Windsurf) từ một "cỗ máy sinh code" thành một Senior Software Engineer thực thụ.

---

## 1. Cơ chế hoạt động (Tại sao lại cần Skin/Skill này?)

Thông thường, khi bạn yêu cầu AI "Làm cho tôi tính năng X", AI sẽ nhảy ngay vào viết code. Điều này ở các dự án lớn thường dẫn đến: phá vỡ kiến trúc, tạo ra code rác, và không tuân thủ các component dùng chung.

Với hệ điều hành kỹ năng (Skill OS) này:
1. Bạn đưa ra yêu cầu.
2. Skill **agent-orchestrator** sẽ tiếp nhận, phân tích và lên kế hoạch (Plan only).
3. Nó gọi **context-manager** để đọc đúng những file cần thiết (chống tràn ngữ cảnh).
4. Nó gọi các skill chuyên biệt (`ui-builder`, `api-integration`, `database-engineer`...) để thực thi từng bước.
5. AI luôn bị ép phải dùng tiếng Anh để viết code/định nghĩa biến, nhưng sẽ dùng tiếng Việt để giao tiếp và báo cáo với bạn.

---

## 2. Hướng dẫn cài đặt qua NPM (Khuyên dùng)

Bộ Skin này rất linh hoạt và được phân phối qua NPM để bạn có thể cài vào bất kỳ dự án nào cực kỳ nhanh chóng.

Mở terminal tại gốc dự án của bạn và chạy lệnh cài đặt tương ứng với công cụ AI bạn đang dùng:

### Dành cho Gemini IDE / Antigravity
Các công cụ này đọc cấu hình từ thư mục `.agents/skills/`. Bạn chỉ cần thêm cờ `--gemini` khi chạy cài đặt:
```bash
npx ai-developer-skill-os init --gemini
```
*Lệnh này sẽ tự tạo thư mục `.agents/skills/` và tải toàn bộ bộ kỹ năng vào đó.*

### Dành cho Cursor / Windsurf / Claude Code / Kilo Code
Các công cụ này linh hoạt hơn, bạn cài đặt mặc định:
```bash
npx ai-developer-skill-os init
```
*Lệnh này sẽ tạo thư mục `rules-skill/` ở gốc dự án.*

---

## 3. Cấu hình cho IDE / AI Agent

Sau khi thư mục kỹ năng đã xuất hiện trong dự án của bạn, hãy cấu hình để AI biết cách sử dụng nó.

### Cho Gemini IDE / Antigravity
**Không cần cấu hình gì thêm!** Gemini/Antigravity sẽ tự động nhận diện các file trong `.agents/skills/` và sẵn sàng làm việc ngay.

### Cho Cursor / Windsurf (AI Code Editors)
Tạo file `.cursorrules` (nếu dùng Cursor) hoặc `.windsurfrules` (nếu dùng Windsurf) ở gốc dự án và dán đoạn sau vào:
```md
# AI Developer Skill OS by Quang Khánh

When answering or generating code, you MUST act as an expert engineer using the skills defined in `./rules-skill/skills.json`.
Always read the relevant `SKILL.md` from `./rules-skill/skills/` before providing a solution.
Speak to me in Vietnamese, but write all code in English.
```

### Cho Claude Code / Kilo Code (CLI Agents)
Tạo file `CLAUDE.md` (hoặc `KILO.md`) ở gốc dự án và dán đoạn sau vào:
```md
# System Instructions
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).

Vui lòng tìm đọc danh sách kỹ năng tại file `./rules-skill/skills.json`.
Trước khi thực hiện bất kỳ yêu cầu nào, hãy gọi file `SKILL.md` tương ứng trong thư mục `./rules-skill/skills/` để biết quy trình làm việc chuẩn.
Luôn giao tiếp bằng tiếng Việt nhưng viết code, đặt tên biến, comment trong code bằng tiếng Anh.
```

---

## 4. Cách tương tác với AI

Giờ đây bạn chỉ cần chat với AI như giao việc cho một kỹ sư thật sự. Không cần viết prompt dài dòng!

**Ví dụ 1: Nhờ AI tự lên kế hoạch (Kích hoạt `agent-orchestrator`)**
> "Quang Khánh ơi, dự án này đang cần thêm tính năng Đăng nhập. Cậu lên kế hoạch giúp mình nên làm gì trước nhé."

**Ví dụ 2: Sửa lỗi (Kích hoạt `bug-fix`)**
> "Bị lỗi Hydration error trên Next.js rồi. Fix giúp mình."

**Ví dụ 3: Review Codebase (Kích hoạt `project-audit`)**
> "Audit nhanh cho tôi thư mục `src/components/`, tìm xem có bị vấn đề về hiệu năng hay code smell không."

**Ví dụ 4: Frontend UI (Kích hoạt `ui-builder` + `design-system`)**
> "Làm cho tôi cái giao diện màn hình Danh sách User. Chú ý dùng chuẩn components của thư mục `src/components/ui/` nhé."

**Ví dụ 5: Tích hợp API (Kích hoạt `api-integration`)**
> "Tích hợp cái swagger login này vào frontend giúp. Nhớ dùng React Query như chuẩn của project."
