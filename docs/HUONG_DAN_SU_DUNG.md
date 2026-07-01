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
*Lệnh này sẽ tạo thư mục `.qk-ai-skill-os/` ở gốc dự án.*

---

## 3. Cấu hình cho IDE / AI Agent

Sau khi thư mục kỹ năng đã xuất hiện trong dự án của bạn, hãy cấu hình để AI biết cách sử dụng nó.

### Cho Gemini IDE / Antigravity
**Không cần cấu hình gì thêm!** Gemini/Antigravity sẽ tự động nhận diện các file trong `.agents/skills/` và sẵn sàng làm việc ngay.

### Cho Cursor / Windsurf (AI Code Editors)
Tạo file `.cursorrules` (nếu dùng Cursor) hoặc `.windsurfrules` (nếu dùng Windsurf) ở gốc dự án và dán đoạn sau vào:
```md
# AI Developer Skill OS by Quang Khánh

When answering or generating code, you MUST act as an expert engineer using the skills defined in `./.qk-ai-skill-os/skills.json`.
Bất cứ khi nào người dùng gõ lệnh `./qk [tên-skill]`, bạn BẮT BUỘC phải đọc file `SKILL.md` tương ứng trong thư mục `./.qk-ai-skill-os/skills/` trước khi thực hiện.
Speak to me in Vietnamese, but write all code in English.
```

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

## 4. Cách kiểm tra cài đặt thành công

Để biết AI của bạn đã thực sự "nhập môn" bộ Skill OS này chưa, hãy mở khung chat AI trong dự án và gõ cú pháp lệnh chuyên nghiệp sau:
> **`./qk-project-audit`** Hãy cho tôi biết bạn sẽ làm những gì.

✅ **Thành công:** Nếu AI trả lời bằng tiếng Việt, liệt kê đúng các bước khám bệnh (Phase 1, Phase 2, Phase 3...) theo đúng như trong file `SKILL.md` của `qk-project-audit`.  
❌ **Thất bại:** Nếu AI trả lời chung chung hoặc bảo không biết skill này là gì, bạn cần kiểm tra lại đường dẫn file cấu hình ở bước trên.

---

## 5. Cách gọi lệnh Skill chuyên nghiệp (Usage)

AI sẽ tự động nhận diện skill qua ngữ cảnh, nhưng cách chuyên nghiệp và tiết kiệm thời gian gõ prompt nhất là bạn sử dụng cú pháp lệnh độc quyền: **`./qk-[tên-skill]`**

Dưới đây là các câu lệnh (prompt) mẫu cực kỳ hiệu quả mà bạn nên dùng:

### 🎯 Ví dụ 1: Nhờ AI lên kế hoạch (Planning)
> **`./qk-agent-orchestrator`** Hãy lên kế hoạch làm tính năng Đăng nhập này cho tôi. Nhớ gọi thêm **`./qk-context-manager`** để kiểm tra thư mục hiện tại có những file gì trước nhé.

### 🎯 Ví dụ 2: Fix lỗi cứng đầu (Bug Fix)
> **`./qk-frontend-debug`** & **`./qk-bug-fix`** Code đang bị crash với lỗi `Hydration error`. Hãy tìm hiểu nguyên nhân gốc rễ và sửa nó giúp tôi.

### 🎯 Ví dụ 3: Review Codebase (Audit)
> **`./qk-project-audit`** Hãy kiểm tra nhanh cho tôi thư mục `src/components/` xem có bị vấn đề về hiệu năng hay code smell không.

### 🎯 Ví dụ 4: Xây dựng Giao diện Frontend (UI)
> **`./qk-ui-builder`** & **`./qk-design-system`** Hãy tạo cho tôi một màn hình Danh sách User. Chú ý dùng chuẩn components của thư mục `src/components/ui/` nhé.

### 🎯 Ví dụ 5: Làm việc với API (Backend & Integration)
> **`./qk-api-integration`** Tích hợp cái swagger login này vào frontend giúp. Nhớ dùng React Query như chuẩn của project.

### 🎯 Ví dụ 6: Database & Backend
> **`./qk-database-engineer`** Hãy viết cho tôi schema Prisma cho bảng Product và User có quan hệ 1-N. Làm theo đúng chuẩn kiến trúc trong skill.
