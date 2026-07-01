# Hướng Dẫn Sử Dụng — AI Developer Skill OS

**Tác giả:** Quang Khánh  
**Phiên bản:** v1.0.0  

Chào mừng bạn đến với **AI Developer Skill OS**, bộ khung quản lý kỹ năng (Skill Framework) biến các trợ lý AI (Claude Code, Kilo Code, Antigravity, Cursor, Windsurf) từ một "cỗ máy sinh code" thành một Senior Software Engineer thực thụ.

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

## 2. Hướng dẫn cài đặt

Bộ Skin này rất linh hoạt và có thể được tích hợp vào hầu hết các AI Agent IDE hiện đại:

### Cho Antigravity / Gemini IDE
Bạn cần copy thư mục chứa các skill này vào thư mục `.agents` của dự án:
```
my-project/
└── .agents/
    └── skills/
        ├── engineering/
        ├── frontend/
        └── backend/
```
Hoặc cấu hình Global trong máy tính của bạn tại:
`C:\Users\<Tên-Máy-Bạn>\.gemini\config\skills\`

### Cho Claude Code & Kilo Code (CLI AI Agents)
Claude Code và Kilo Code đọc các quy tắc (rules) từ thư mục gốc của dự án.
**Cách cài đặt:**
1. Copy toàn bộ thư mục `rules-skill/` vào gốc dự án của bạn.
2. Tạo (hoặc sửa) file `CLAUDE.md` (đối với Claude) hoặc `KILO.md` (đối với Kilo) ở thư mục gốc, dán nội dung sau vào:

```md
# System Instructions
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).

Vui lòng tìm đọc danh sách kỹ năng tại file `./rules-skill/skills.json`.
Trước khi thực hiện bất kỳ yêu cầu nào, hãy gọi file `SKILL.md` tương ứng trong thư mục `./rules-skill/skills/` để biết quy trình làm việc chuẩn.
Luôn giao tiếp bằng tiếng Việt nhưng viết code, đặt tên biến, comment trong code bằng tiếng Anh.
```

### Cho Cursor / Windsurf (AI Code Editors)
Cursor và Windsurf sử dụng file quy tắc riêng biệt.
**Cách cài đặt:**
1. Copy toàn bộ thư mục `rules-skill/` vào gốc dự án của bạn.
2. Mở file `.cursorrules` (với Cursor) hoặc `.windsurfrules` (với Windsurf), dán nội dung sau vào:

```md
# AI Developer Skill OS by Quang Khánh

When answering or generating code, you MUST act as an expert engineer using the skills defined in `./rules-skill/skills.json`.
Always read the relevant `SKILL.md` from `./rules-skill/skills/` before providing a solution.
Speak to me in Vietnamese, but write all code in English.
```

---

## 3. Cách tương tác với AI

Vì AI giờ đây đã có "nghề" (Skill), bạn không cần phải prompt quá dài dòng. Hãy ra lệnh như giao việc cho một kỹ sư.

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

---

## 4. Tùy chỉnh Skin (Dành cho Advanced User)

Nếu bạn muốn thêm kỹ năng mới cho AI, hãy sử dụng mẫu (Template) đã được tác giả chuẩn bị sẵn:
1. Copy file từ thư mục `_template/SKILL.md`.
2. Chỉnh sửa các thông số: Name, Description, Trigger, Scope, v.v.
3. Đăng ký nó vào file `skills.json` ở gốc.
4. Tận hưởng AI với kỹ năng mới của riêng bạn!

---

Để xem danh sách chi tiết và công dụng của từng skill, vui lòng xem [Chi Tiết Skills](CHI_TIET_SKILLS.md).
