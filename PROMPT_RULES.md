# PROMPT_RULES.md — BỘ QUY TẮC VIẾT PROMPT HIỆU QUẢ

## Chuẩn hóa Prompt cho Dự án, AI Coding, Phân tích, Nghiên cứu và Công việc thực tế

> **Version:** 1.0  
> **Mục tiêu:** Biến yêu cầu của con người thành chỉ dẫn rõ ràng, có ngữ cảnh, có tiêu chí kiểm chứng và tạo ra kết quả có thể sử dụng ngay.

---

# 1. MỤC TIÊU CỐT LÕI

Một prompt tốt không phải là prompt dài.

Một prompt tốt phải giúp AI trả lời:

1. **Tôi phải làm gì?**
2. **Tại sao phải làm?**
3. **Dựa trên dữ liệu nào?**
4. **Trong phạm vi nào?**
5. **Không được làm gì?**
6. **Kết quả phải có hình dạng như thế nào?**
7. **Tiêu chí nào để biết kết quả đúng?**
8. **Nếu thiếu thông tin hoặc có mâu thuẫn thì phải xử lý thế nào?**

Công thức nền tảng:

```text
PROMPT HIỆU QUẢ
=
ROLE
+ CONTEXT
+ OBJECTIVE
+ INPUT
+ CONSTRAINTS
+ PROCESS
+ OUTPUT
+ VALIDATION
+ FAILURE HANDLING
```

---

# 2. NGUYÊN TẮC QUAN TRỌNG NHẤT

## Rule 01 — Nói rõ mục tiêu

Không viết:

```text
Làm báo cáo này tốt hơn.
```

Nên viết:

```text
Phân tích dữ liệu trong file đã cung cấp và tạo báo cáo tổng hợp.
Báo cáo phải:
- chỉ sử dụng dữ liệu có trong file;
- chỉ ra các chỉ số chính;
- phát hiện bất thường;
- phân tích nguyên nhân nếu dữ liệu cho phép;
- đưa ra kết luận;
- đưa ra kiến nghị có căn cứ.
```

---

# 3. RULE OF CONTEXT — LUÔN CUNG CẤP NGỮ CẢNH

AI có thể thực hiện cùng một câu lệnh theo nhiều cách khác nhau nếu thiếu context.

## Context nên bao gồm

```text
Project:
Mục đích:
Người sử dụng:
Hệ thống hiện tại:
Công nghệ:
Dữ liệu:
Trạng thái hiện tại:
Vấn đề:
Mục tiêu cuối:
```

Ví dụ:

```text
Project:
Hệ thống IOC cấp tỉnh.

Mục đích:
Tổng hợp và trực quan hóa dữ liệu hành chính.

Công nghệ:
React + TypeScript + Node.js + PostgreSQL.

Hiện trạng:
Backend đã có API nhưng dữ liệu giữa một số xã không đồng nhất.

Mục tiêu:
Chuẩn hóa dữ liệu trước khi hiển thị dashboard.
```

---

# 4. RULE OF SCOPE — XÁC ĐỊNH PHẠM VI

Một trong những lỗi phổ biến nhất là prompt quá rộng.

Không nên:

```text
Hãy tối ưu toàn bộ hệ thống.
```

Nên:

```text
Chỉ phân tích module Dashboard.

Không thay đổi:
- authentication;
- database schema;
- API contract;
- các module khác.

Chỉ được thay đổi:
- frontend rendering;
- state management;
- data transformation.
```

## Quy tắc

Luôn phân biệt: `IN SCOPE` và `OUT OF SCOPE`.

---

# 5. RULE OF SOURCE — XÁC ĐỊNH NGUỒN SỰ THẬT

Khi có nhiều nguồn dữ liệu, phải xác định nguồn nào được ưu tiên.

Ví dụ:

```text
SOURCE OF TRUTH:

1. File dữ liệu người dùng cung cấp.
2. Database hiện tại.
3. API hiện tại.
4. Documentation.
5. Suy luận của AI.

Không được tự tạo dữ liệu để lấp khoảng trống.
Nếu thiếu dữ liệu, phải đánh dấu rõ là "chưa xác định".
```

---

# 6. RULE OF FACT VS ASSUMPTION

AI phải phân biệt:
- `FACT`: Sự thật có kiểm chứng.
- `ASSUMPTION`: Giả định cần làm rõ.
- `INFERENCE`: Suy luận dựa trên dữ liệu.
- `UNKNOWN`: Chưa có thông tin.

Không được trình bày assumption như fact.

---

# 7. RULE OF NO FABRICATION

AI không được tự tạo: dữ liệu, số liệu, API, tên file, tên bảng, column, endpoint, business rule, kết quả benchmark, nguồn tham khảo, trích dẫn, thông tin chưa được xác minh.

Nếu không biết:
```text
Tôi chưa có đủ thông tin để xác định điều này.
```

---

# 8. RULE OF CLARIFICATION

## Có thể tự xử lý khi:
- yêu cầu rõ;
- thiếu thông tin không quan trọng;
- có thể đưa ra assumption an toàn và không làm thay đổi kết quả cốt lõi.

## Phải hỏi khi:
- thiếu thông tin quan trọng;
- có nhiều cách hiểu;
- hành động có thể gây hậu quả;
- yêu cầu mâu thuẫn;
- không thể xác định output mong muốn.

Format:
```text
Tôi cần xác nhận 1 điểm trước khi thực hiện:
[QUESTION]

Lý do:
[WHY IT MATTERS]

Nếu bạn không có preference, tôi sẽ dùng:
[DEFAULT]
```

---

# 9. RULE OF PRIORITY

Khi có nhiều yêu cầu, phải xác định thứ tự ưu tiên:
```text
P0 — Correctness
P1 — Security
P2 — Data integrity
P3 — Maintainability
P4 — Performance
P5 — UX
P6 — Cosmetic improvements
```

---

# 10. RULE OF CONSTRAINTS

Prompt tốt phải nói rõ giới hạn:
- Không thay đổi database schema.
- Không thêm dependency nếu chưa cần.
- Không rewrite toàn bộ module.
- Không thay đổi public API.
- Không xóa dữ liệu.
- Không hard-code dữ liệu production.
- Không sửa file ngoài phạm vi.

---

# 11. RULE OF EXISTING CODE

Đối với AI Coding:
> Không được mặc định rằng code hiện tại sai chỉ vì có thể viết lại đẹp hơn.

Trước khi sửa:
1. Đọc cấu trúc project.
2. Xác định module liên quan.
3. Đọc code hiện tại.
4. Xác định dependency.
5. Xác định data flow.
6. Xác định nguyên nhân vấn đề.
7. Sau đó mới đề xuất thay đổi.

---

# 12. RULE OF MINIMAL CHANGE

Ưu tiên `SMALLEST SAFE CHANGE` thay vì `LARGEST POSSIBLE REFACTOR`.

---

# 13. RULE OF BEFORE → AFTER

Khi yêu cầu thay đổi hệ thống, mô tả theo luồng: `BEFORE` → `PROBLEM` → `AFTER` → `EXPECTED BEHAVIOR`.

---

# 14. RULE OF DATA CONTRACT

Khi làm dữ liệu/API, luôn mô tả rõ schema `INPUT`, `OUTPUT`, `Required fields`, `Null handling`, và `Invalid data handling`.

---

# 15. RULE OF EDGE CASES

Luôn xem xét và xử lý: `NULL`, `EMPTY`, `ZERO`, `NEGATIVE`, `DUPLICATE`, `MISSING`, `INVALID`, `TIMEOUT`, `PERMISSION ERROR`.

---

# 16. RULE OF DATE & TIME

Không dùng mốc thời gian mơ hồ. Chỉ rõ khoảng thời gian cụ thể và timezone nếu cần.

---

# 17. RULE OF OUTPUT FORMAT

Quy định cấu trúc trả về rõ ràng: Executive Summary, Findings, Root Cause, Recommendation, Action Plan, Risks, Conclusion.

---

# 18. RULE OF ACCEPTANCE CRITERIA

Định nghĩa checklist điều kiện hoàn thành rõ ràng trước khi code.

---

# 19. RULE OF VALIDATION

Không chấp nhận "Đã hoàn thành" nếu không có bước kiểm chứng: Syntax, Tests, Types, Lint, Behavior, Edge Cases.

---

# 20. RULE OF EVIDENCE

Mọi kết luận quan trọng phải có: `Finding`, `Evidence` (Data/Code/Log/Source), và `Confidence` (HIGH/MEDIUM/LOW).

---

# 21. RULE OF CONFIDENCE

Phân cấp độ tin cậy rõ ràng: HIGH, MEDIUM, LOW. Không biến suy luận thành kết luận chắc chắn.

---

# 22. RULE OF REASONING

Cung cấp reasoning có thể kiểm chứng: kết luận, các bước kiểm tra chính, bằng chứng, giả định, lý do lựa chọn, trade-offs.

---

# 23. RULE OF TRADE-OFF

So sánh đa chiều giữa các phương án (Pros, Cons, Risk, Cost, Recommendation).

---

# 24. RULE OF DECISION

Đưa ra khuyến nghị cụ thể kèm điều kiện áp dụng và điều kiện không nên dùng (When NOT to use).

---

# 25. RULE OF ERROR HANDLING

Định nghĩa quy trình xử lý lỗi: xác định lỗi, tìm nguyên nhân, kiểm tra phạm vi, đề xuất cách sửa, không che giấu lỗi, dừng và báo cáo nếu không an toàn.

---

# 26. RULE OF STOP CONDITION

Dừng ngay nếu: thiếu credential, thiếu file bắt buộc, có nguy cơ mất dữ liệu, requirement mâu thuẫn, không xác định được nguồn sự thật, thay đổi destructive trên production, confidence quá thấp.

---

# 27. RULE OF SECURITY

Bảo vệ bí mật, không log dữ liệu nhạy cảm, không bypass xác thực/phân quyền, validate input, sanitize output.

---

# 28. RULE OF PRIVACY

Chỉ sử dụng dữ liệu cần thiết, không đưa thông tin nhận dạng cá nhân (PII) vào log.

---

# 29. RULE OF PERFORMANCE

Định lượng mục tiêu hiệu năng bằng số đo cụ thể thay vì nói chung chung.

---

# 30. RULE OF MAINTAINABILITY

Ưu tiên code dễ đọc, dễ đoán định, dễ test, mang tính module và nhất quán với kiến trúc hiện có.

---

# 31. RULE OF CONSISTENCY

Ưu tiên tái sử dụng patterns hiện có của dự án trước khi tạo mới.

---

# 32. RULE OF NAMING

Không tự ý đổi tên public API, db field, biến môi trường, route, component nếu không có yêu cầu.

---

# 33. RULE OF DEPENDENCIES

Không thêm package mới khi chưa đánh giá: sự cần thiết, package có sẵn, chi phí bảo trì, rủi ro bảo mật, kích thước bundle.

---

# 34. RULE OF FILE CHANGES

Chỉ rõ danh sách file: `MODIFY`, `ADD`, `DELETE`, và `DO NOT TOUCH`.

---

# 35. RULE OF GIT

Không tự ý reset, revert, force push, xóa branch, viết lại lịch sử commit nếu chưa được phép.

---

# 36. RULE OF DATABASE

Cấm các thao tác destructive mặc định (DROP, TRUNCATE, DELETE không WHERE). Phải cảnh báo và chờ phê duyệt.

---

# 37. RULE OF MIGRATION

Migration phải có: Schema hiện tại → Migration → Schema mong muốn → Tính tương thích ngược → Chiến lược Rollback.

---

# 38. RULE OF DATA ANALYSIS

Tuân thủ quy trình 10 bước: Inspect → Schema → Missing → Duplicates → Outliers → Consistency → Metrics → Patterns → Interpret → Recommend.

---

# 39. RULE OF DATA QUALITY

Kiểm tra đủ 6 chiều: Completeness, Accuracy, Consistency, Validity, Uniqueness, Timeliness.

---

# 40. RULE OF REPORTING

Cấu trúc báo cáo chuyên nghiệp: DATA → OBSERVATION → INTERPRETATION → IMPACT → RECOMMENDATION.

---

# 41. RULE OF RESEARCH

Nghiên cứu theo chu trình: Question → Scope → Sources → Evidence → Comparison → Analysis → Conclusion.

---

# 42. RULE OF WEB RESEARCH

Ưu tiên nguồn chính thống, kiểm tra ngày xuất bản, đối chiếu chéo nhiều nguồn.

---

# 43. RULE OF SOURCE HIERARCHY

Thứ bậc nguồn tin: Official docs > Primary source > Tổ chức chuyên môn > Bài báo khoa học > Ấn phẩm kỹ thuật uy tín > Thảo luận cộng đồng > Snippet tìm kiếm > Nguồn chưa xác minh.

---

# 44–46. MASTER TEMPLATES & UNIVERSAL PROMPT

### Universal Prompt Template
```text
Bạn là [ROLE].

## Bối cảnh
[CONTEXT]

## Mục tiêu
[OBJECTIVE]

## Phạm vi
- Được phép: [IN SCOPE]
- Không được phép: [OUT OF SCOPE]

## Nguồn sự thật
[SOURCES theo thứ tự ưu tiên]

## Quy trình
1. Kiểm tra input → 2. Phân tích → 3. Đề xuất giải pháp → 4. Thực hiện → 5. Kiểm tra → 6. Báo cáo

## Tiêu chí hoàn thành (Acceptance Criteria)
- [ ] Requirement đạt
- [ ] Không vi phạm constraints
- [ ] Đã verify thực tế

## Output
[Cấu trúc trả về]
```

---

# 47–54. CÁC PROMPT MẪU CHUYÊN SÂU

- **Debugging Prompt:** Không sửa ngay; Reproduce → Evidence → Root cause → Minimal fix → Regression test.
- **Refactor Prompt:** Giữ nguyên 100% behavior, API contract và database schema; chỉ tối ưu cấu trúc nội bộ.
- **Code Review Prompt:** Đóng vai Principal Engineer; phân loại Severity, chỉ rõ Location, Problem, Evidence, Impact, Recommendation.
- **Data Analysis Prompt:** Kiểm định chất lượng dữ liệu trước khi tính toán metrics và đưa ra nhận định kinh doanh.
- **Requirement / Idea to Spec:** Bóc tách Use Cases, Functional / Non-functional specs, và BDD Acceptance Criteria.

---

# 55–73. NGUYÊN TẮC THIẾT KẾ VẬN HÀNH

- **Phased Execution:** Discover → Understand → Plan → Implement → Verify → Report.
- **Incremental Delivery:** Chia nhỏ theo batch và kiểm chứng từng phần.
- **Checkpoints & Rollback:** Luôn có điểm dừng kiểm soát và kế hoạch khôi phục khi có sự cố.
- **Observability & Safe Logging:** Không log thông tin nhạy cảm.
- **Don't Overengineer & YAGNI:** Ưu tiên giải pháp đơn giản nhất đáp ứng trọn vẹn yêu cầu hiện tại.
- **Actionability & Smart Defaults:** Khuyến nghị phải đi kèm hành động cụ thể; dùng default an toàn có nêu rõ giả định.
- **Language:** Tiếng Việt tự nhiên cho giải thích; giữ nguyên thuật ngữ kỹ thuật tiếng Anh chuẩn xác.

---

# 74–76. CHECKLIST ĐÁNH GIÁ PROMPT & ANTI-PATTERNS

Checklist 12 điểm:
- [ ] Mục tiêu rõ?
- [ ] Context đủ?
- [ ] Scope rõ (In / Out)?
- [ ] Input & Source of truth rõ?
- [ ] Constraints rõ?
- [ ] Output format rõ?
- [ ] Acceptance criteria rõ?
- [ ] Edge cases được tính đến?
- [ ] Error handling rõ?
- [ ] Security & Privacy đảm bảo?
- [ ] Validation checklist có sẵn?
- [ ] Stop conditions rõ?

**Tránh các Anti-Patterns:** "Làm cho tốt hơn", "Fix everything", "Rewrite this project", "Make it faster", "Use your best judgment" mà không có tiêu chí định lượng.

---

# 77–87. NGUYÊN TẮC TỐI THƯỢNG (MASTER RULES)

- **Rule 78:** Định nghĩa rõ ràng "DONE = ?".
- **Rule 79:** Không bao giờ tối ưu sai điểm nghẽn (đo lường trước khi tối ưu).
- **Rule 80:** Bằng chứng trước, kết luận sau (Evidence before conclusion).
- **Rule 81:** Chỉ sửa những gì mình đã hiểu rõ call-flow và phụ thuộc.
- **Rule 82:** Bảo toàn mục tiêu người dùng (không biến fix bug thành rewrite kiến trúc).
- **Rule 83:** Rõ ràng hơn là ngầm hiểu.
- **Rule 86:** Prompt là một CONTRACT giữa con người và AI.
- **Rule 87:** *Hãy viết prompt sao cho một người khác có thể thực hiện đúng yêu cầu mà không cần đọc suy nghĩ của bạn.*

---

# AI PROMPT COMPILER — QUY TRÌNH "VIẾT LẠI PROMPT TRƯỚC KHI LÀM"

## 1. Mục Đích
Người dùng có thể ra lệnh ngắn gọn theo thói quen:
- `"fix bug login"`
- `"sửa cái dashboard này"`
- `"phân tích dữ liệu xã này"`
- `"tối ưu API này"`
- `"thêm chức năng export excel"`

AI có trách nhiệm **biên dịch (compile)** câu lệnh thô đó thành một **Execution Prompt** đầy đủ, có cấu trúc, hiển thị công khai cho người dùng trước khi tiến hành thực thi.

## 2. Chu Trình 3 Bước
1. **Bước 1 — Người dùng ra lệnh ngắn:** Nhập lệnh tự nhiên, không cần viết dài.
2. **Bước 2 — AI hiển thị Prompt đã chuyển hóa:** AI diễn giải lại thành prompt chuẩn, đặt trong khối riêng biệt kèm:
   - Ý định cốt lõi đã hiểu
   - Phạm vi cho phép / không được chạm vào
   - Các bước cụ thể sẽ làm
   - Giả định kỹ thuật (Assumptions)
3. **Bước 3 — Xác nhận & Thực thi:**
   - *Tác vụ an toàn / rõ ràng:* Hiển thị prompt và tự động thực thi (Auto-Proceed).
   - *Tác vụ phức tạp / destructive / mơ hồ:* Chờ người dùng bấm xác nhận trước khi sửa mã nguồn.

## 3. Khung Hiển Thị Mẫu (Standard Display Block)

```markdown
┌────────────────────────────────────────────────────────────────────────┐
│ 🧠 Ý ĐỊNH TÔI HIỂU                                                    │
│ [Mô tả ngắn gọn 1-2 câu về mục tiêu thực sự của bạn]                  │
├────────────────────────────────────────────────────────────────────────┤
│ 📝 PROMPT ĐÃ CHUYỂN HÓA (COMPILED EXECUTION PROMPT)                    │
│ Vai trò: [Role phù hợp]                                                │
│ Nhiệm vụ: [Nhiệm vụ cụ thể]                                            │
│ Ngữ cảnh: [Context từ codebase / files]                                │
│ Phạm vi: Được sửa [In-Scope] | Cấm chạm [Out-of-Scope]                │
│ Ràng buộc: [YAGNI, Không phá vỡ API/DB hiện tại]                       │
│ Tiêu chí nghiệm thu: [Acceptance Criteria cụ thể]                     │
├────────────────────────────────────────────────────────────────────────┤
│ 📋 CÁC BƯỚC THỰC HIỆN                                                 │
│ 1. [Bước 1] → 2. [Bước 2] → 3. [Bước 3] → 4. [Verify & Test]          │
└────────────────────────────────────────────────────────────────────────┘
```
