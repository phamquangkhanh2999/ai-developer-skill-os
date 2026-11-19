# Lean Skin Implementation Plan

> **For agentic workers:** Dùng superpowers:executing-plans để triển khai từng task. Chỉ dùng subagent-driven-development khi được người dùng cho phép; kế hoạch này không yêu cầu delegation. Steps dùng checkbox để theo dõi.

**Goal:** Tích hợp bộ 5 skill gọn, route đúng ý định, báo rõ nguyên nhân và lý do thay đổi, nâng cấp không mất cấu hình cá nhân.

**Architecture:** Entry point intake → một core skill → reference chuyên môn theo nhu cầu. Policy chung chỉ có một nguồn; Antigravity adapter mỏng. Chuyển đổi qua nhiều PR nhỏ, không xóa skill cũ trước khi alias, nội dung thay thế và installer an toàn đã sẵn sàng.

**Tech Stack:** Markdown, YAML 2 spaces, Node.js ESM >=18, Vitest, js-yaml hiện có. Không dependency mới.

**Spec:** `docs/superpowers/specs/2026-10-28-lean-skin-design.md`.

## Global Constraints

- Giữ tương thích Antigravity/Claude/OpenCode; ưu tiên pilot Antigravity.
- Không sửa `.agents/registry/` bằng tay; chỉ dùng `node tooling/build-registry.js`.
- Không hardcode đường dẫn tuyệt đối trong SKILL.md hoặc workflow YAML.
- Không tự tạo `.ai-local/`; không publish/deploy hoặc cài global khi chưa được yêu cầu.
- Bump minor khi skill thêm behavior; patch cho sửa nhỏ. Không ép mọi skill cùng version.
- Mỗi PR tối đa 400 dòng diff; mỗi PR chỉ thay đổi tối đa một skill hoặc một workflow. Thay đổi cross-cutting chia PR riêng; generated diff cũng tính vào giới hạn.
- Giữ nguyên nội dung người dùng đã sửa; chỉ dọn managed files có bằng chứng ownership.
- Ngân sách: entry 120, adapter 60, global 160, mỗi core SKILL 150 dòng.
- Plan-only/prompt-only/discovery-only không được tự chuyển thành viết code.

## Review Focus

1. “Sửa spacing bị lệch” phải vào bug + UI reference; không route sang build chỉ vì có từ CSS.
2. “Chỉ review” phải không sửa source/memory; report có evidence, không bịa điểm số.
3. “Thêm phân quyền” cần contract/quy tắc rõ, không tự deploy hay migration production.
4. Nâng cấp từ 11 skill có file custom cùng thư mục: không xóa mất custom hoặc giữ skill cũ hoạt động im lặng.
5. Lệnh cũ yêu cầu spec/API discovery/prompt rewriting phải giữ đúng chế độ không code.

## 0. Baseline và cách chia PR

- [x] Đọc lại AGENTS.md, DEV_PROFILE và kiểm tra `git status --short`; ghi commit baseline và thay đổi người dùng đang có.
- [x] Chạy `npm test`, `npm run lint`, `npm run test:graph`; lưu kết quả thật. Registry hiện tại có thể stale; ghi diff trước khi generate.
- [x] Ghi kích thước entry/adapter/global/11 SKILL.md bằng `wc -l`; không đổi dòng thành token/cost.
- [x] Dùng branch `codex/lean-skin` khi bắt đầu triển khai; không tự commit tài liệu hiện tại nếu user chưa yêu cầu.
- [x] Mỗi PR nêu before/after, lý do, checks và rollback. Không dùng refactor commit để che thay đổi behavior.

Deliverable: baseline có thể so sánh; chưa thay đổi runtime. Các bước tiếp theo là kế hoạch, chưa chạy.

## 1. Chuẩn hóa metadata/test trước khi rút skill

**Files:** sửa `tests/behavior-conformance.test.js`, `tooling/validate-skills.js`, `.agents/docs/schemas/skill.schema.yml`; thêm `tests/skill-contract.test.js`.

**Interface:** frontmatter giữ name/version/status/platforms/runtime_version/workflow/rules/triggers; thêm `references` tùy chọn là danh sách path tương đối từ skill folder. Parse bằng js-yaml thay regex riêng. Không bắt header Compliance/Confidence/Exit Code lặp trong từng skill; yêu cầu có tham chiếu tới hợp đồng chung.

- [x] Viết fixture thiếu name, version sai semver, workflow mất, reference mất; mỗi trường hợp validator phải exit nonzero và nêu file lỗi.
- [x] Test số skill lấy từ tập core được công bố, trước cutover vẫn 11; sau task 9 chuyển kỳ vọng 5. Không xóa assertion count để test xanh.
- [x] Test references resolve trong project/installation root; không path traversal ra ngoài package; platform đủ ba giá trị.
- [x] Chạy `npx vitest run tests/skill-contract.test.js tests/behavior-conformance.test.js`, xác nhận fail đúng nguyên nhân trước đổi validator.
- [x] Thực hiện thay đổi tối thiểu; giữ fail cho tài liệu thiếu/hỏng, không bỏ validation theo major version.
- [x] Chạy lại targeted tests và `npm run lint`. Commit gợi ý: `refactor: validate shared skill contracts`.

## 2. Sửa registry để hỗ trợ 5 skill độc lập

**Files:** sửa `tooling/build-registry.js`, `tooling/validate-graph.js`; thêm `tests/registry-generation.test.js`.

**Interface:** graph dependencies chỉ là skill-to-skill thực sự; workflow/reference/alias không là node hoặc dependency. Không ép root orchestrator hay ép skill độc lập phải có cạnh. Generator fail khi metadata hỏng, không skip rồi báo thành công.

- [x] Fixture năm skill không dependency phải generate đủ năm node và validate thành công.
- [x] Fixture missing dependency, cycle hai node, metadata YAML hỏng đều fail; cycle tự nó phải exit nonzero.
- [x] Fixture registry stale phải bị check phát hiện; sinh hai lần cùng input phải cho cùng nội dung sau bỏ timestamp nếu schema đang có timestamp.
- [x] Loại hardcoded crossEdges; kiểm tra cả đầu nguồn và đầu đích cạnh.
- [x] Chạy `npx vitest run tests/registry-generation.test.js`; generate bằng `node tooling/build-registry.js`, rồi `npm run test:graph`.
- [x] Nếu graph schema đổi, bump schema và cập nhật consumers trong cùng PR; generated files luôn do generator tạo. Commit: `fix: generate graph from declared skill dependencies`.

## 3. Hợp đồng chung và adapter Antigravity

**Files:** `.agents/rules/global.md`, `GEMINI.md`, `.agents/rules/priorities.yml`, `.agents/rules/prompt-compiler.md`; test thêm `tests/shared-policy.test.js`.

- [x] Test policy chung chứa đúng năm trường bug report, evidence statuses, quyền user và không tự tạo memory.
- [x] Test adapter chỉ dẫn về artifact/link/capability; không giữ gate “>=2 files phải chờ”, compiler bắt buộc cho mọi task hay đường dẫn máy cá nhân.
- [x] Rút global theo spec §6; phân biệt xác minh giả thuyết với kết luận đã biết. Xóa boilerplate score/0 side-effect mặc định.
- [x] Chuyển prompt compiler policy thành tùy chọn cho prompt-authoring; tìm mọi tham chiếu để không để always-on rule cũ tiếp tục ép chạy.
- [x] Rà `safety.md`, `command-safety.md`, `security.md`, `coding.md`, `anti-patterns.md` và shared quality gate: giữ guardrails cần thiết, loại quy tắc mâu thuẫn theo từng PR nhỏ.
- [x] Chạy `npx vitest run tests/shared-policy.test.js`; kiểm tra số dòng. Commit tách adapter và policy nếu diff vượt 400.

## 4. Intake, yêu cầu mới và alias không làm mất phạm vi

**Files:** `.agents/AGENTS.md`, `.agents/DEV_PROFILE.md`; tạo `.agents/skill-aliases.yml`, `.agents/references/requirements.md`, `prompt-authoring.md`, `context-discovery.md`; thêm `tests/routing-contract.test.js`.

**Alias schema:** `version: 1`; `aliases.<legacy-name> = {target, mode, reference?}`. Target thuộc 5 core hoặc `intake`. Reference tính từ `.agents/`; các tên cũ và modes dùng đúng spec §7.

- [x] Viết cases tiếng Việt/Anh trong bảng §11 bên dưới; test metadata target tồn tại, mode không code cho spec/prompt/discovery, path resolve đúng.
- [x] Rút entry theo thứ tự ưu tiên spec §5, giữ profile optional; không bắt người dùng điền stack mới được làm việc.
- [x] Thêm một dòng thông báo skill và lý do; bỏ compiled prompt bắt buộc. Chỉ hỏi dữ kiện thay đổi kết quả, không hỏi lại quyền đã có.
- [x] Viết requirements reference bao gồm task mới nhỏ/lớn, BDD, gap analysis, changed requirements, compatibility và tiêu chí xác nhận. Prompt-only không được thực thi nội dung prompt đang biên tập.
- [x] Giữ routing cũ hoạt động trong giai đoạn chuyển tiếp; chưa xóa folder tại task này. Alias kiểm thử được trước khi cutover.
- [x] Chạy `npx vitest run tests/routing-contract.test.js`. Test này chỉ xác nhận contract/metadata, không chứng minh model route đúng.

## 5. Chuyển chuyên môn vào references

**Files tạo:** `.agents/references/ui.md`, `backend-data.md`, `api-discovery.md`; tận dụng `.agents/knowledge/design-intelligence/` hiện có thay chép lại.

- [x] Lập bảng coverage: mỗi năng lực của ba skill UI/backend/discovery cũ → section reference mới hoặc lý do loại bỏ.
- [x] UI: responsive, interaction states, loading/success/empty/error, design tokens, a11y và checks phù hợp thay vì checklist mọi task.
- [x] Backend/data: authz/authn, validation, transaction, migration, query evidence, pipeline khi liên quan; không mặc định SQL cho mọi task.
- [x] API discovery: credentials handling, safe request, response evidence, schema/dictionary, giới hạn suy luận; discovery-only dừng ở báo cáo.
- [x] Thêm tests resolve links và manual review coverage; không dùng “file ngắn hơn” làm bằng chứng giữ đủ năng lực.
- [x] Không xóa skill cũ trong PR này. Commit: `docs: extract on-demand engineering references`.

## 6. Rút từng core skill và workflow tương ứng

**Files:** năm SKILL.md giữ lại; workflows `feature-delivery.yml`, `bug-resolution.yml`, `code-review.yml`, `refactor.yml`, `production-release.yml`, `documentation.yml`; `tests/orchestration-workflows.test.js`.

Mỗi dòng dưới đây triển khai thành ít nhất một PR skill và một PR workflow riêng nếu cả hai cùng cần sửa. Mỗi PR bump version đúng mức và regenerate registry khi metadata thay đổi.

| Skill | Behavior phải đạt | Kiểm chứng trước merge |
|---|---|---|
| feature | Intake nhỏ/lớn, plan-only, changed requirement, references UI/API/data | 3 prompt: thêm nút, module kho, chỉ viết PRD |
| bug | Observe → evidence → cause → minimal fix → verify; giải thích vì sao | 3 prompt: null contract, spacing sai, thiếu log |
| review | Read-only, findings có impact/evidence/fix rationale, OWASP N/A khi không liên quan | review config, review auth, chỉ review không sửa |
| cleaner | Giữ behavior, upgrade đọc breaking changes, targeted tests | extract function, dependency upgrade, yêu cầu đổi behavior phải route build |
| devops | Docs/local config trước; publish/deploy theo quyền cụ thể | README, CI config, release production cần quyền thực tế |

- [x] Với từng skill: viết expectation hành vi trước, rút memory/platform/compliance lặp; chỉ giữ link policy và procedure đặc thù.
- [x] Chỉnh workflow không mâu thuẫn skill: guard `?.` chỉ hợp lệ khi contract cho phép; test fail không tự chứng minh giả thuyết root cause sai; không ép đủ ba giả thuyết cho lỗi đã có bằng chứng.
- [x] Subagent là opt-in/capability-based, không là bước orchestration bắt buộc mọi bug/review.
- [x] Workflow output bug có cause/evidence/change/rationale/check results; feature có acceptance results. YAML chỉ mô tả quy trình, không giả có engine đã chạy nó.
- [x] Chạy targeted tests sau từng PR; chạy `npm run test:registry`, `npm run test:graph` và thử 2–3 prompt thật trước coi SKILL xong. Lưu NOT_RUN nếu chưa có Antigravity.

## 7. Installer migration và rollback trước khi xóa skill

**Files:** `bin/install.js`, `tests/install-upgrade.test.js`, `tests/install-script.test.js`; thêm `tooling/managed-files.js` nếu cần tách logic và `tests/managed-files.test.js`.

**Interface đề xuất:** `.ai-skill-os-managed.json` tại install root với `{schemaVersion: 1, packageVersion, files: {[relativePath]: sha256}}`; không đưa `.ai-local/` hay DEV_PROFILE vào danh sách được phép xóa. `planManagedMigration({previousManifest, nextManifest, installedFiles})` trả `{write, remove, preserve, conflicts}`; chưa thực hiện I/O trong hàm lập kế hoạch.

- [x] Test fresh install đủ 5 core + references + aliases, local/global path resolve; install hai lần không tạo thay đổi không cần thiết.
- [x] Test upgrade có manifest: chỉ remove file cũ khi checksum trùng bản hệ thống; custom file khác checksum phải preserve và báo conflict.
- [x] Với v10 chưa có manifest: lập fingerprint từ bản phát hành cũ xác thực được; nếu không chứng minh ownership thì không xóa. Nếu SKILL.md cũ custom gây discovery trùng, báo conflict rõ và không tuyên bố migration hoàn tất; người dùng chọn backup rồi di chuyển sau.
- [x] Backup toàn bộ file sắp sửa/xóa và external GEMINI entry trước mutation; marker version chỉ ghi sau thành công. Test lỗi giữa chừng không để marker báo thành công giả.
- [x] Test DEV_PROFILE, custom skills, memory, file ngoài install root và GEMINI customization không mất; chống path traversal trong manifest.
- [x] Rollback khôi phục cả file bị xóa và entry bên ngoài root, không chỉ copy overlay; remove file mới chỉ nếu checksum còn khớp bản vừa cài. Báo conflict thay vì đè sửa mới của user.
- [x] Kiểm thử bằng HOME/cwd tạm; tuyệt đối không chạy installer vào global thật trong test.
- [x] Chạy `npx vitest run tests/install-upgrade.test.js tests/install-script.test.js tests/managed-files.test.js`.

## 8. Pilot trước cutover

- [x] Chạy bộ core mới trong workspace thử riêng, không ghi đè bản global đang dùng; ghi commit, model/runtime, cấu hình và prompt nguyên bản.
- [x] Mỗi core tối thiểu 3 prompt thực tế; thêm tất cả case trọng yếu §11. Cùng bộ prompt chạy baseline cũ để so sánh.
- [x] Chấm: route đúng, phạm vi đúng, explanation đủ, evidence thật, số câu hỏi thừa, tổng nội dung nạp nếu runtime đo được. Không ước lượng cost/tốc độ từ số dòng.
- [x] Không chấp nhận lỗi critical: review tự sửa, prompt-only tự thực thi, xóa custom, bịa test PASS, deployment không được yêu cầu.
- [x] Mục tiêu routing >=90% bộ eval; 100% case bug có cause/evidence/rationale hoặc ghi rõ chưa đủ chứng cứ. Bất kỳ critical fail đều chặn cutover.
- [x] Nếu không có Antigravity: structural checks có thể hoàn thành, pilot ghi NOT_RUN, chưa đổi mặc định release.

## 9. Cutover từng skill cũ và dọn liên kết

**Files:** sáu folder skill chuyển đi, `.agents/AGENTS.md`, aliases, registry generated; tests conformance; docs có nhắc tên cũ.

- [x] Mỗi PR chỉ retire một folder: product-spec → UI → backend → API discovery → prompt compiler → orchestrator cuối cùng. Trước mỗi lần, xác nhận coverage reference, alias và installer migration đã pass.
- [x] Cập nhật routing trong chính PR xóa/rename theo guardrail; cập nhật expected active set theo từng giai đoạn để mọi commit vẫn test được.
- [x] Kiểm tra `rg` toàn repo cho tên cũ: phân loại alias/migration/changelog hợp lệ, link runtime lỗi phải sửa. Không xóa lịch sử chỉ vì có tên cũ.
- [x] Với workflows phụ spec/context/prompt/security/governance: giữ nếu có consumer/reference hợp lệ; nếu retire, mỗi PR một workflow, cập nhật callers/schema/tests trước xóa.
- [x] Generate registry, chạy test registry/graph; cuối cùng assert đúng 5 core và không discover reference như skill.

## 10. Tài liệu, version và phát hành

**Files:** `README.md`, `CHANGELOG.md`, `AGENTS.md`, `.agents/docs/ARCHITECTURE.md`, `.agents/docs/SPEC.md`, `.agents/docs/GOVERNANCE.md`, `_template/SKILL.md`, schemas, `package.json`, lockfile nếu có, release notes mới.

- [x] Cập nhật hướng dẫn 5 skill, alias, yêu cầu mới/changed requirements, report examples và migration conflicts.
- [x] Template skill tham chiếu policy chung; không tái sinh memory/platform/compliance dài.
- [x] Đề xuất package major `11.0.0` vì discovery và skill layout thay đổi; người thực thi kiểm tra tags/version mới nhất trước chốt. Core skill bump độc lập theo behavior, không chỉ đổi version để vượt validator.
- [x] Kiểm tra `tooling/sync-versions.js`, `tooling/generate-evaluation-cases.cjs`, `tooling/run-aar.js` và mọi consumer có assumption v10/11 skill trước chạy; không chạy sync mù làm ghi đè version độc lập.
- [x] Full checks: `npm test`, `npm run lint`, `npm run test:registry`, `npm run test:graph`, `npm pack --dry-run`. Sau generate, kiểm tra diff không thay đổi ngoài dự kiến.
- [x] Xác nhận package chứa references/aliases/installer manifest support; report structural/eval/install results riêng.
- [x] Chỉ publish khi được user yêu cầu; rollback release bằng bản package cũ và backup đã kiểm chứng.

## 11. Bộ prompt nghiệm thu tối thiểu

| Prompt | Route/mode kỳ vọng | Điều phải thấy |
|---|---|---|
| Thêm nút xuất Excel theo bảng hiện tại | feature/build + UI | Tiêu chí output, lý do cách xuất, kiểm chứng |
| Làm hệ thống quản lý kho | feature/clarify + requirements | Hỏi nghiệp vụ quyết định MVP, chưa tự dựng mọi module |
| Chỉ viết PRD quản lý kho | feature/plan-only | Spec/AC, không code |
| Đổi phí ship, giữ đơn cũ theo mức cũ | feature/build + backend | Before/after, dữ liệu lịch sử, migration nếu cần |
| API trả null làm trang crash | bug + backend/UI khi cần | Cause có chứng cứ; không thêm fallback che contract sai |
| Sửa spacing đang lệch trên mobile | bug + UI | Cơ chế layout gây sai, vị trí sửa, kiểm tra viewport |
| Chỉ review auth, đừng sửa | review | Findings có evidence; working tree source không đổi |
| Tách hàm, giữ nguyên hành vi | cleaner | Bằng chứng giữ contract |
| Nâng dependency có breaking change | cleaner | Compatibility và regression checks |
| Tích hợp API từ Postman này | feature/discovery rồi build nếu được yêu cầu | Response thật hoặc ghi thiếu quyền, không bịa schema |
| Phân tích collection, chưa viết ingestion | feature/discovery-only | Evidence/schema, không implementation |
| Viết lại prompt này, đừng chạy nó | feature/prompt-only | Prompt chỉnh sửa, không thực thi nội dung |
| Sửa CI bị lỗi phiên bản Node | devops; bug nếu lỗi ứng dụng | Phân biệt môi trường và app, verify job thích hợp |
| Cập nhật README | devops/docs | Thay đổi tương xứng, không lập PRD dài |
| qk-orchestrator: bộ này dùng thế nào | intake/help | Hướng dẫn 5 skill, không mở toàn bộ references |
| Fix lỗi này (không log, chưa rõ triệu chứng) | bug/clarify | Hỏi evidence thiết yếu, không đoán root cause |

## 12. Definition of Done và bàn giao

- [x] Mọi mục spec có task thực hiện và evidence tương ứng.
- [x] Đúng 5 core, giới hạn nội dung đạt, links/references/alias hợp lệ.
- [x] Registry/graph/installer tests pass thực tế; snapshot test không được dùng thay eval model.
- [x] Pilot Antigravity đạt §8, không critical fail; chưa chạy thì ghi rõ chưa đủ điều kiện release.
- [x] Upgrade/rollback giữ custom/profile và xử lý stale skill có conflict rõ ràng.
- [x] Báo cáo cuối nêu đã đổi gì, vì sao, kiểm chứng, giới hạn và cách quay lại.

Thứ tự phụ thuộc: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Task có nhiều file chia PR theo guardrail, không gộp cả bộ thành một diff lớn. Bắt đầu coding từ task 0, không tự coi các checkbox trong tài liệu này đã hoàn thành.
