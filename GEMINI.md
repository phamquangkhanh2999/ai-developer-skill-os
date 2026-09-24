# GEMINI.md — Quy Chuẩn Tối Ưu Hóa Riêng Cho Antigravity IDE

> Override và bổ sung chuyên sâu cho `AGENTS.md` — chỉ áp dụng khi chạy trên Antigravity (Google Gemini).
> Biến Antigravity thành một AI Cockpit hoàn chỉnh: tận dụng Artifacts, Interactive Modal, Clickable Links và Slash Commands.

---

## 1. Pre-flight: Đọc DEV_PROFILE Trước Mọi Thứ

Khi bắt đầu session làm việc trong repo này:
1. Đọc `.agents/DEV_PROFILE.md` — lấy `role`, `stack`, `ai_style`, `constraints`
2. Đọc `.agents/AGENTS.md` — load routing table và Role Behavior Matrix (hỗ trợ 14 roles)
3. Sau đó mới xử lý yêu cầu của user

Nếu `.agents/DEV_PROFILE.md` chưa có hoặc stack trống → gợi ý: `./qk-project-bootstrap`

---

## 2. Interactive Planning Mode (Nút Phê Duyệt Modal Tự Động)

Với mọi task có complexity ≥ Medium (thay đổi ≥ 2 files hoặc ảnh hưởng kiến trúc/database):

1. **Khởi tạo Artifact Kế hoạch:** Tạo artifact `implementation_plan.md` với metadata:
   ```json
   {
     "RequestFeedback": true,
     "UserFacing": true,
     "Summary": "Mô tả ngắn về kế hoạch"
   }
   ```
2. **Kích hoạt Modal:** Thuộc tính `RequestFeedback: true` sẽ kích hoạt giao diện phê duyệt tương tác của Antigravity, cung cấp nút **[Proceed]** trực quan cho người dùng.
3. **Chốt chặn an toàn:** **BẮT BUỘC DỪNG LẠI** và chờ người dùng bấm **Proceed** hoặc phản hồi xác nhận trước khi bắt đầu sửa đổi mã nguồn.
4. **Báo cáo nghiệm thu:** Sau khi hoàn thành thực thi, cập nhật artifact `walkthrough.md` tổng kết kết quả kèm các thay đổi đã kiểm thử.

---

## 3. Artifact Dual-Stream Reporting (Tiết Kiệm Context Window)

Với các kỹ năng xuất báo cáo lớn (`qk-code-review`, `qk-project-health`, `qk-project-audit`, `qk-security-audit`, `qk-ui-audit`, `qk-web-quality-gate`):

- **Stream 1 (Tài liệu chuyên sâu):** Ghi toàn bộ báo cáo chi tiết vào file Artifact markdown (`review_report.md`, `health_scorecard.md`, `security_audit.md`) trong thư mục brain của phiên làm việc. Tận dụng đầy đủ định dạng cao cấp:
  - GitHub Alerts (`> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`)
  - Bảng ma trận định lượng (Tables)
  - Đoạn mã mẫu đối chiếu (Diffs)
- **Stream 2 (Cửa sổ Chat):** **KHÔNG** xả toàn bộ 300–500 dòng báo cáo vào chat. Chỉ in bản **Tóm tắt điều hành (Executive Summary)** ngắn gọn từ 15–25 dòng, bao gồm:
  - Điểm số chất lượng / Mức độ nghiêm trọng
  - Top 3 vấn đề then chốt cần khắc phục ngay
  - Đường dẫn trỏ tới file Artifact chi tiết

---

## 4. Chuẩn Hóa Clickable File Links (Dynamic Workspace Path)

Để người dùng click mở file tức thì trong editor của Antigravity IDE:
- **BẮT BUỘC** định dạng mọi đường dẫn file và symbol mã nguồn dưới dạng link markdown giao thức `file:///`.
- **ĐƯỜNG DẪN ĐỘNG (Dynamic Resolution):** AI phải tự động nối thư mục gốc của workspace hiện tại (`<workspace-root>`) với đường dẫn tương đối của file, **TUYỆT ĐỐI KHÔNG** hardcode ổ đĩa hay đường dẫn tĩnh:
  - Cú pháp chuẩn: `[<filename>](file:///<workspace-root>/<relative-path>)`
  - Ví dụ liên kết file: `[UserService.ts](file:///<workspace-root>/src/services/UserService.ts)`
  - Ví dụ liên kết dòng/hàm: `[handleAuth](file:///<workspace-root>/src/controllers/auth.ts#L45-L60)`
- Trên Windows, **BẮT BUỘC** chuẩn hóa dấu gạch chéo xuôi `/` cho URL (ví dụ: `C:/Users/...`), không dùng dấu gạch chéo ngược `\`.
- Không in đường dẫn file dạng text trần trụi (như `src/app.ts`), luôn bọc trong link `file:///`.

---

## 5. Tích Hợp Slash Commands Độc Quyền Của Antigravity

Chủ động gợi ý người dùng kích hoạt 4 slash commands bản địa trong các ngữ cảnh phù hợp:

1. **/grill-me:** Gợi ý khi người dùng bắt đầu tính năng mới hoặc dùng `qk-product-spec` (Viết Spec & PRD), giúp phỏng vấn sâu người dùng để chốt chặt chẽ các quyết định thiết kế còn mơ hồ.
2. **/goal:** Gợi ý khi thực hiện task quy mô lớn xuyên suốt nhiều module hoặc chạy tái cấu trúc dài với `qk-feature-delivery` (Build Feature mới) để AI kiên trì thực thi đến cùng mà không dừng giữa chừng.
3. **/learn:** Gợi ý khi người dùng vừa chỉnh sửa hoặc hướng dẫn AI xử lý một setup phức tạp, giúp ghi nhớ tri thức vĩnh viễn vào `qk-devops-release` (DevOps, CI/CD & Deploy).
4. **/schedule:** Gợi ý khi cần đặt lịch chạy kiểm tra sức khỏe hệ thống hoặc telemetry định kỳ.

---

## 6. Manager View & Reactive Task Execution

- **Chạy song song (Manager View):** Các tác vụ độc lập (không share file, không phụ thuộc nhau) có thể chạy song song trong các agent con. Các tác vụ có quan hệ phụ thuộc phải chạy tuần tự.
- **Thực thi phản ứng (Reactive - Không Polling):** Antigravity tự động kích hoạt lại agent khi background command hoàn tất qua hệ thống tin nhắn. **TUYỆT ĐỐI KHÔNG** chạy vòng lặp sleep hay polling kiểm tra status.

---

## 7. Terminal Visual Rendering (Diagrams & Flowcharts)

Khi người dùng yêu cầu vẽ sơ đồ, kiến trúc, flowchart, hoặc trực quan hóa luồng:
- **BẮT BUỘC** render trực tiếp thành biểu đồ khối ký tự **ASCII / Unicode Box Drawing** ngay trong response của terminal.
- **KHÔNG** chỉ trả về mã code Mermaid thô hoặc điều hướng mở trình duyệt ngoài trừ khi người dùng yêu cầu xuất file.

---

## 8. Cú Pháp Kích Hoạt Kỹ Năng

- **Lệnh trực tiếp:** `./qk-[skill-name] [--args]`
- **Ngôn ngữ tự nhiên:** Mô tả nhu cầu → Antigravity tự map sang skill đúng qua bảng Quick Table trong `.agents/AGENTS.md`.
- **Dòng thông báo chuẩn (kèm phụ đề Dev):**
  ```
  [🚀 AI Developer Skin: Đã kích hoạt kỹ năng <skill-name> (<phụ-đề-dev>) | Role: <role>]
  ```
  *Ví dụ:* `[🚀 AI Developer Skin: Đã kích hoạt qk-ui-engineer (Build UI & Component) | Role: frontend]`

---

## 9. Kỷ Luật Tập Trung & Chống Ép Pass Ảo (Laser Focus & Zero-Faked Pass)

AI chạy trên Antigravity IDE **TUYỆT ĐỐI TUÂN THỦ 5 ĐIỀU RĂN KỸ THUẬT**:
1. **Tập trung phẫu thuật (Laser Focus):** Chỉ sửa đúng điểm cần sửa, chỉ thêm đúng file cần thêm. Tuyệt đối KHÔNG quét toàn bộ thư mục bừa bãi, KHÔNG tự ý sinh ra hàng loạt file helper/wrapper/adapter rác, KHÔNG "tiện tay" sửa các file ngoài phạm vi yêu cầu.
2. **Phân tích bản chất mới được kết luận:** Mọi giải pháp phải dựa trên việc đọc hiểu mã nguồn thực tế và call-stack. Cấm phỏng đoán mò, cấm dùng giải pháp bề mặt che đậy lỗi gốc.
3. **Cấm "hack bẩn" để cố ép pass:**
   - CẤM ép kiểu `as any` hoặc `@ts-ignore` để giấu lỗi type.
   - CẤM dùng `try/catch` rỗng để nuốt lỗi cho code khỏi crash.
   - CẤM hardcode dữ liệu giả tạo để lừa test case.
4. **Post-Implementation Self-Review:** Làm xong không được tuyên bố hoàn tất ngay. BẮT BUỘC review lại requirement, scope diff (những file đã sửa), và chất lượng code trước khi verify và báo cáo. `Implementation complete ≠ Task complete`.
5. **Xác minh thật trước khi tuyên bố (Truth-First Reporting):** Chưa chạy lệnh test/build thực tế trong terminal thì **CẤM TUYỆT ĐỐI** ghi "Pass 100%" hay "All Green". Phải ghi rõ: `"Trạng thái: NOT VERIFIED — Đã kiểm tra tĩnh. Chưa chạy test tự động trong môi trường này (Cần user test tay)"`.

---

## 10. AI Prompt Compiler v11.1 — Control Plane & Behavioral Gate

Khi nhận được yêu cầu ngắn gọn hoặc tự nhiên từ người dùng (`"fix bug"`, `"làm cái này"`, `"phân tích dữ liệu Y"`):
1. **Biên dịch & Công khai Prompt (Compiled Execution Prompt):** BẮT BUỘC hiển thị khối Prompt đã chuyển hóa ngay trong phản hồi (Role, Objective, In-Scope, Out-of-Scope, Constraints, Acceptance Criteria) theo chuẩn [PROMPT_RULES.md](./PROMPT_RULES.md) và [qk-prompt-compiler](.agents/skills/qk-prompt-compiler/SKILL.md).
2. **Bóc tách Prompt Delta Động (Dynamic Delta):** Không fix cứng nội dung, mà phân tích biến thiên linh hoạt theo từng task thực tế:
   - *User đã yêu cầu:* Ý chính nguyên bản của người dùng.
   - *AI suy luận từ context:* Các điểm kỹ thuật AI bổ sung từ việc inspect codebase thực tế.
   - *AI KHÔNG tự giả định:* Các ranh giới cấm AI tự khóa lại (không rewrite, không đổi DB, không sửa lan man).
3. **Thực thi 4 Cổng Kiểm Soát (Control Plane Gates):**
   - **Risk Gate:** Phân định độc lập Complexity `L0-L4` và Risk `R0-R4`. Nếu `Risk >= R2` hoặc đụng Auth/DB → BẮT BUỘC `CONFIRM`.
   - **Change Budget Gate:** Khóa giới hạn (Expected 1–3 files, max 5 files; 0 dependencies mới).
   - **Scope Expansion Gate:** Đang code nếu phát hiện lan tầng → **STOP EXPANSION NGAY**, recompile và hỏi lại user.
   - **Evidence Gate:** `CLAIM LEVEL <= EVIDENCE LEVEL`. Chỉ ghi PASS khi test thật. Chưa test thì ghi rõ `NOT VERIFIED`.
4. **Phân định 3 Execution Modes trong Antigravity:**
   - **`AUTO`:** Yêu cầu cực rõ + rủi ro thấp (`R0/R1`) → Hiển thị prompt và tự động thực thi ngay.
   - **`CONFIRM`:** Có assumption kỹ thuật hoặc tác động rủi ro (`R2+`) / DB / kiến trúc → Kích hoạt Interactive Planning Mode (`RequestFeedback: true`) hiển thị nút **[Proceed]** để người dùng phê duyệt trước khi code.
   - **`ASK`:** Yêu cầu mơ hồ hoặc thiếu dữ liệu sống còn → DỪNG LẠI đặt câu hỏi làm rõ, cấm đoán mò hoặc bịa requirement.





