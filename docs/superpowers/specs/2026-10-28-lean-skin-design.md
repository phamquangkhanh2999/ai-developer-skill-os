# Thiết kế Lean Skin cho Antigravity

Ngày: 2026-10-28. Trạng thái: đề xuất để người dùng triển khai; chưa thay đổi runtime.

## 1. Mục tiêu và giới hạn

Giảm số skill chính từ 11 xuống 5, chọn theo mục tiêu công việc; giữ đủ năng lực làm mới, sửa lỗi, review, refactor và vận hành. Mỗi lần thực thi phải giải thích được chọn gì, vì sao chọn, thay đổi gì, vì sao thay đổi và bằng chứng kiểm chứng.

Ưu tiên Antigravity; giữ tương thích installer Claude/OpenCode. Đây là hệ cấu hình AI, không xây thêm framework routing hay dịch vụ runtime. Không thêm dependency. Không tự tạo memory, không tự chạy subagent, không tự publish/deploy.

Các quyết định dưới đây là đề xuất kỹ thuật của người lập kế hoạch, chưa phải kết quả thử nghiệm trên Antigravity.

## 2. Căn cứ hiện trạng

- 11 SKILL.md chính có tổng 3.805 dòng; đây là kích thước nguồn, không phải số token luôn được nạp.
- `.agents/AGENTS.md` có mẫu báo cáo chung thiếu trường nguyên nhân và lý do bản sửa.
- Skill debug đã có Root-Cause Gate và mẫu nguyên nhân; vấn đề là các lớp chưa dùng chung một hợp đồng đầu ra.
- `GEMINI.md` và global rules cùng áp đặt prompt compiler, gate và thủ tục kế hoạch.
- Các skill lặp Memory Workflow; tự tạo memory trái với entry point.
- `tests/behavior-conformance.test.js` khóa số lượng 11 và version cụ thể.
- `tooling/build-registry.js` hardcode cạnh từ qk-orchestrator; validator graph coi skill độc lập là orphan và chưa fail chỉ vì cycle.
- Installer overlay giữ customization nhưng cũng có nguy cơ giữ skill đã bị loại khỏi bản phát hành mới.

Đây là review tĩnh; chưa xác nhận hành vi thực tế hay tốc độ/cost của model.

## 3. Phương án và lựa chọn đề xuất

| Phương án | Ưu điểm | Đánh đổi |
|---|---|---|
| Giữ 11, chỉ rút chữ | Ít thay đổi installer | Ranh giới chọn skill vẫn chồng lấn |
| 5 skill chính + tài liệu chuyên môn | Giảm quyết định routing, giữ chiều sâu | Cần migration, alias và eval hành vi |
| Một skill tổng | Điểm vào đơn giản | Khó giữ ranh giới nhiệm vụ và nạp đúng chuyên môn |

Chọn đề xuất thứ hai. Giữ tên 5 skill đang có để giảm đổi tên; không tạo 5 tên marketing mới.

## 4. Kiến trúc đích

| Skill chính giữ lại | Trách nhiệm | Workflow chính |
|---|---|---|
| qk-feature-delivery | Làm mới, đổi yêu cầu, tích hợp; chế độ plan-only khi chỉ yêu cầu đặc tả | feature-delivery |
| qk-bug-resolution | Hành vi sai so với yêu cầu hiện có; điều tra nguyên nhân | bug-resolution |
| qk-code-review | Đánh giá chỉ đọc, findings có bằng chứng | code-review |
| qk-code-cleaner | Refactor, dependency upgrade, kiểm thử giữ hành vi | refactor |
| qk-devops-release | CI/CD, release, docs, memory khi được yêu cầu | production-release hoặc documentation theo task |

Entry point thực hiện intake, không cần skill orchestrator riêng. References không có SKILL.md và không được đăng ký như skill.

```text
Yêu cầu → đọc context liên quan → xác định mục tiêu
        → chọn 1 skill chính + lý do
        → đọc reference cần thiết
        → làm rõ nếu thiếu dữ kiện quyết định
        → thực thi/đặc tả đúng phạm vi
        → kiểm chứng → báo cáo có bằng chứng
```

Nguồn quy tắc:
- `.agents/AGENTS.md`: intake, thứ tự ưu tiên, bảng route ngắn, hướng dẫn nạp.
- `.agents/rules/global.md`: hợp đồng thực thi, bằng chứng, báo cáo, memory.
- `.agents/rules/safety.md`, `command-safety.md`, `security.md`: an toàn theo rủi ro thực tế.
- `GEMINI.md`: adapter đường dẫn/artifact/capability; không nhân bản policy nghiệp vụ.
- `SKILL.md`: quy trình đặc thù của đúng một công việc.
- `.agents/references/`: kiến thức theo lĩnh vực, nạp theo nhu cầu.

Instruction của nền tảng và yêu cầu người dùng có ưu tiên hơn policy repo. Reference không được mở rộng quyền hay tự thêm phạm vi. Khi rules cùng mức xung đột: báo điểm xung đột, dùng lựa chọn giữ đúng ý định và ít tác động hơn; hỏi nếu quyết định ảnh hưởng kết quả.

## 5. Intake và routing

Chọn theo kết quả mong muốn, không chỉ dò từ khóa:
1. User chỉ yêu cầu review/giải thích: read-only; review dùng qk-code-review, hỏi đáp đơn giản trả lời trực tiếp.
2. Hành vi sai so với contract hiện tại: qk-bug-resolution, dù lỗi nằm ở CSS/API/CI.
3. Thêm hoặc đổi hành vi mong muốn: qk-feature-delivery.
4. Giữ hành vi, thay cấu trúc/dependency/tests: qk-code-cleaner.
5. Công việc cấu hình CI/CD, phát hành, tài liệu: qk-devops-release; lỗi logic ứng dụng trong release vẫn là bug.
6. Chưa rõ mục tiêu: inspect context đủ hẹp, hỏi một câu có ảnh hưởng quyết định; không chọn đại rồi sửa.

Một task nhiều mục tiêu: chia thành các bước tuần tự có tiêu chí riêng, một skill chính tại mỗi bước. Ví dụ review rồi sửa: hoàn thành review, phân loại fix/refactor, thực thi khi user đã yêu cầu cả hai. Không sinh spec cho mọi task.

### Làm mới và yêu cầu mới

- Nhỏ, rõ: nêu mục tiêu và tiêu chí ngắn rồi thực hiện.
- Lớn nhưng rõ: lập plan tương xứng, chia lát dọc có thể kiểm chứng; không bắt hỏi chỉ vì số file.
- Mơ hồ về nghiệp vụ: hỏi phần quyết định dữ liệu/quyền/tác vụ; tiếp tục khảo sát độc lập.
- Chỉ yêu cầu plan/PRD: feature ở chế độ plan-only, tuyệt đối không code.
- Đổi nghiệp vụ: mô tả before/after, dữ liệu cũ, compatibility, migration và rollback nếu cần.
- Tích hợp API: discovery trước khi viết contract; schema suy luận phải đánh dấu chưa xác nhận.

## 6. Hợp đồng báo cáo

Dòng mở đầu: `Dùng <skill> vì <mục tiêu hoặc vấn đề cụ thể>.`
Không bắt in toàn bộ compiled prompt, role, stack, scorecard cho mọi task.

Bug report có 5 trường bắt buộc:
1. Lỗi và điều kiện xảy ra.
2. Nguyên nhân + bằng chứng file:dòng/log/reproduction; nếu chưa rõ ghi giả thuyết.
3. Sửa gì + vị trí thay đổi.
4. Vì sao thay đổi loại bỏ nguyên nhân; tách rõ workaround nếu chỉ giảm triệu chứng.
5. Kiểm chứng: lệnh thực chạy, kết quả, phần chưa kiểm tra.

Feature report: yêu cầu, cách làm và lý do, đã thay đổi, kiểm chứng theo acceptance criteria, phần còn thiếu.
Review report: severity, evidence, cơ chế/tác động, đề xuất và lý do; không bịa điểm số tổng.
Refactor report: cấu trúc trước/sau, lý do, bằng chứng giữ hành vi.
Release/docs report: thay đổi, lý do, kiểm chứng, trạng thái phát hành, rollback nếu áp dụng.

Task nhỏ hướng tới 5–10 dòng, không giới hạn cứng khiến mất bằng chứng. Task lớn có artifact chi tiết và tóm tắt đủ hiểu trong chat. Không dùng trường có sẵn giá trị PASS/0 side-effect để agent sao chép.

Trạng thái: VERIFIED (đã thực chạy checks liên quan), PARTIAL (còn tiêu chí chưa đạt/chưa kiểm chứng), BLOCKED (thiếu dữ kiện/quyền thiết yếu), FAILED (checks chứng minh chưa đạt). PASS/FAIL/NOT_RUN áp dụng từng check; VERIFIED không có nghĩa an toàn tuyệt đối.

## 7. Chuyên môn và tương thích lệnh

| Skill cũ chuyển đi | Đích | Reference bắt buộc khi liên quan |
|---|---|---|
| qk-ui-engineer | feature; bug nếu UI sai | ui.md |
| qk-backend-data | feature; bug nếu sai contract | backend-data.md |
| qk-api-data-discovery | feature chế độ discovery-only | api-discovery.md |
| qk-product-spec | feature chế độ plan-only | requirements.md |
| qk-prompt-compiler | feature chế độ prompt-only, không thực thi prompt | prompt-authoring.md |
| qk-orchestrator | intake/help tại entry point | context-discovery.md khi tìm hiểu kiến trúc |

Giữ nội dung nghiệp vụ quan trọng: UI states/a11y, auth/input validation, transaction/migration, bằng chứng API, BDD và gap analysis, tối ưu prompt khi user yêu cầu. Không chuyển nguyên khối memory/compliance vào mỗi reference.

Tạo `.agents/skill-aliases.yml` với schema `version: 1`, `aliases` map tên cũ sang `{target, mode, reference}`. qk-orchestrator có `{target: intake, mode: help}`; intake là target đặc biệt không phải skill. Không tạo graph edges cho alias/reference. File này là nguồn metadata alias, entry point có bảng ngắn tương ứng được test đối chiếu. Đây là alias hướng dẫn AI, không giả vờ đã cung cấp executable shell `./qk-*`.

Nếu Antigravity discovery yêu cầu folder SKILL.md cho lệnh cũ, không giữ các shim làm 11 skill hoạt động trở lại: thông báo migration và chỉ bảo đảm alias ở natural-language/entry point; đánh dấu giới hạn này sau thử nghiệm thực tế.

## 8. Ngân sách nội dung đề xuất

- Entry point tối đa 120 dòng; GEMINI adapter tối đa 60 dòng.
- Mỗi core SKILL.md tối đa 150 dòng, không tính reference.
- Global tối đa 160 dòng; tổng entry + adapter + global + một skill tối đa 490 dòng.
- Reference là nội dung chọn lọc theo task, không tự nạp cả thư mục.

Đây là giới hạn ngăn phình cấu hình, không phải thước đo chất lượng độc lập. Nếu vượt, cần nêu lý do và cập nhật budget công khai; không nén chữ để lách test.

## 9. Tiêu chí nghiệm thu

- Đúng 5 core skill; mọi tên cũ có mapping và không trỏ tới file mất.
- Task mới, bug, review-only, refactor, release/docs đều chọn đúng mục tiêu.
- Báo cáo bug có đủ cơ chế gây lỗi, bằng chứng và lý do bản sửa.
- Không tự tạo memory, không dừng vì chỉ chạm hai file, không tự nhận quyền deploy.
- Không mất UI/API/data/security capability sau chuyển reference.
- Nâng cấp loại bỏ đúng file hệ thống đã quản lý và không xóa customization.
- Registry được generate, không có reference thiếu/cycle; skill độc lập hợp lệ.
- Structural tests và eval hành vi được báo riêng; test regex không chứng minh model tuân thủ.
- Pilot Antigravity phải hoàn thành trước đổi mặc định bản phát hành; chưa chạy ghi NOT_RUN.
