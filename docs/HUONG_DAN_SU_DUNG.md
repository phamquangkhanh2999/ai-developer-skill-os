# Hướng Dẫn Sử Dụng — AI Developer Skill OS

**Tác giả:** Quang Khánh  
**Phiên bản:** v2.0.0 (Master OS Architecture)

Chào mừng bạn đến với **AI Developer Skill OS**, hệ điều hành kỹ năng (Skill Framework) biến các trợ lý AI (Gemini, Antigravity, Claude Code, Cursor, Windsurf) từ một "cỗ máy sinh code" thành một **Senior Software Engineer / Chief Architect** thực thụ với khả năng tự học, tự kiểm toán và tự viết tài liệu.

---

## 1. Cơ chế hoạt động (Tại sao lại cần Skin/Skill này?)

Thông thường, khi bạn yêu cầu AI "Làm cho tôi tính năng X", AI sẽ nhảy ngay vào viết code. Điều này ở các dự án lớn thường dẫn đến: phá vỡ kiến trúc, tạo ra code rác, và không tuân thủ các component dùng chung.

Với hệ điều hành 22 Master Skills này:
1. Bạn đưa ra yêu cầu thông qua **`qk-orchestrator`**.
2. Hệ thống sẽ tự động gọi **`qk-context-loader`** để gom đúng file (tránh tràn ngữ cảnh) và **`qk-policy-engine`** để kiểm tra quyền.
3. Kế tiếp, **`qk-engineering-standard`** sẽ gắn các "luật thép" (rules) của dự án vào ngữ cảnh.
4. AI kích hoạt kỹ năng thực thi E2E như **`qk-feature-delivery`** để code và test trọn vẹn.
5. Cuối cùng, **`qk-validation-gate`** chặn lại kiểm tra lỗi, trước khi giao cho **`qk-docs`** và **`qk-documentation-system`** tự động cập nhật tài liệu và bộ nhớ hệ thống.

---

## 2. Hướng dẫn cài đặt qua NPM (Khuyên dùng)

Bộ Skin này rất linh hoạt và được phân phối qua NPM để bạn có thể cài vào bất kỳ dự án nào cực kỳ nhanh chóng.

Mở terminal tại gốc dự án của bạn và chạy lệnh cài đặt tương ứng với công cụ AI bạn đang dùng:

```bash
npx ai-developer-skill-os init
```

Quá trình cài đặt sẽ hỏi bạn 2 câu quan trọng:

**Câu 1: Bạn đang dùng IDE nào?**
Hệ thống sẽ tự động tạo file cấu hình tương ứng (ví dụ `.cursorrules`, `.windsurfrules`, `.clinerules`) và bơm sẵn System Prompt vào để AI tự nhận diện các skill.

**Câu 2: Phạm vi cài đặt?**
- **(1) Local:** Cài vào thư mục `skills/` (hoặc `.agents/` cho Gemini) ngay trong dự án. Thích hợp cho làm việc nhóm.
- **(2) Global:** Cài thẳng vào ổ đĩa máy tính (Home Directory). Chỉ cài 1 lần, áp dụng cho mọi dự án.

> 💡 **Tính năng Tự động Dọn dẹp (Auto-Cleanup):** Mỗi khi cài đặt lại, hệ thống sẽ tự động quét và xóa sạch các kỹ năng phiên bản cũ để tối ưu dung lượng và tránh xung đột cho máy tính của bạn. Mọi thứ hoàn toàn tự động!

### Cấu hình thủ công (Dành cho IDE / CLI cụ thể)

#### Cho Gemini IDE / Antigravity
**Không cần cấu hình gì thêm!** Hệ thống tự nhận diện các file trong `.agents/` hoặc thư mục cấu hình toàn cục.

#### Cho Cursor / Windsurf (AI Code Editors)
Tạo file `.cursorrules` hoặc `.windsurfrules` ở gốc dự án:
```md
# AI Developer Skill OS by Quang Khánh

When answering or generating code, you MUST act as an expert engineer using the skills defined in `./skills.json`.
Bất cứ khi nào người dùng gõ lệnh `./qk-[tên-skill]`, bạn BẮT BUỘC phải đọc file `SKILL.md` tương ứng trong thư mục `./skills/` trước khi thực hiện.
Speak to me in Vietnamese, but write all code in English.
```

#### Cho Claude Code / Kilo Code (CLI Agents)
Tạo file `CLAUDE.md` (hoặc `KILO.md`) ở gốc dự án và dán đoạn sau vào:
```md
# System Instructions
Bạn đang chạy bằng **AI Developer Skill OS** (Tác giả: Quang Khánh).

Vui lòng tìm đọc danh sách kỹ năng tại file `./skills.json`.
ĐẶC BIỆT LƯU Ý: Bất cứ khi nào người dùng gõ lệnh bắt đầu bằng `./qk-[tên-skill]`, bạn BẮT BUỘC phải gọi và đọc nội dung file `SKILL.md` tương ứng trong thư mục `./skills/` trước khi phân tích hoặc viết code.
```

---

## 3. Cách kiểm tra cài đặt thành công

Để biết AI của bạn đã thực sự "nhập môn" bộ AI-OS này chưa, hãy mở khung chat AI trong dự án và gõ cú pháp lệnh:
> **`./qk-help`** Hãy liệt kê cho tôi các khối kỹ năng của hệ thống.

✅ **Thành công:** Nếu AI trả lời bằng tiếng Việt, liệt kê đúng mô hình 7 Lớp (Foundation, UI, Development, Quality, Evolution, Operation, AI, Knowledge).
❌ **Thất bại:** Nếu AI trả lời chung chung, bạn cần kiểm tra lại đường dẫn file cấu hình ở bước trên.

---

## 4. Cách gọi lệnh Skill chuyên nghiệp (Usage)

AI sẽ tự động nhận diện skill qua ngữ cảnh, nhưng cách chuyên nghiệp và tiết kiệm thời gian nhất là bạn sử dụng cú pháp: **`./qk-[tên-skill]`**

Dưới đây là các câu lệnh (prompt) mẫu cực kỳ hiệu quả mà bạn nên dùng:

### 🎯 Ví dụ 1: Giao phó tổng thể (Orchestrator)
> **`./qk-orchestrator`** Tôi muốn thêm tính năng Đăng nhập bằng Google. Hãy lên kế hoạch và gọi các skill cần thiết để thực hiện từ A-Z.

### 🎯 Ví dụ 2: Phát triển Tính năng E2E (Feature Delivery)
> **`./qk-feature-delivery`** Hãy tạo màn hình Dashboard thống kê doanh thu. Lưu ý cập nhật Database, tạo API và dùng UI Component có sẵn.

### 🎯 Ví dụ 3: Fix lỗi cứng đầu (Bug Resolution)
> **`./qk-bug-resolution`** Code đang bị crash với lỗi `Hydration error`. Hãy tìm Root Cause, sửa an toàn và đảm bảo viết Regression Test để chống hồi quy.

### 🎯 Ví dụ 4: Xây dựng Giao diện (UI System Builder)
> **`./qk-ui-system-builder`** Hãy tạo cho tôi một Data Table Component có hỗ trợ phân trang và filter, sử dụng Design Token của dự án. Không viết inline CSS rác.

### 🎯 Ví dụ 5: Audit & Tối ưu (Project Health)
> **`./qk-project-health`** Hãy kiểm tra nhanh cho tôi thư mục `src/components/` xem có bị Code Smell hoặc vi phạm Architecture không.

---

## 💡 5. Mẹo & Workflow Thực Chiến (Best Practices)

Để khai thác tối đa sức mạnh của 22 kỹ năng, bí quyết là **tin tưởng vào chuỗi Handoff tự động** của hệ thống thay vì phải gọi từng lệnh nhỏ lẻ.

### 🌟 Bắt đầu một tính năng hoàn toàn mới
Thay vì bảo AI tạo từng file, hãy yêu cầu một lần:
* `> Hãy dùng ./qk-feature-delivery để tạo chức năng Giỏ hàng (Cart).`
Hệ thống sẽ tự động đi từ DB -> API -> UI và đẩy sang `qk-validation-gate` để kiểm tra lỗi.

### 🌟 Khi dự án bắt đầu lộn xộn
* `> Hãy chạy ./qk-project-health để kiểm tra toàn bộ nợ kỹ thuật (Tech Debt). Sau đó hãy dùng ./qk-docs để cập nhật lại cấu trúc thư mục mới nhất vào README.`

### 🌟 Chống "Phá Code" (Safe Refactor)
Trước khi đổi một cấu trúc lớn, hãy bắt AI dò mìn:
* `> Hãy dùng ./qk-system-evolution để phân tích tầm ảnh hưởng (Impact Analysis) nếu tôi cập nhật Next.js lên phiên bản 15.`

👉 Chúc bạn tận hưởng cảm giác code như một Chief Architect thực thụ!
