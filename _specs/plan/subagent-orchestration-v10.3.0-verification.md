# Nghiệm thu local 10.3.0

Ngày: 07/10/2026. Trạng thái: implementation local hoàn thành, package đã cài thử; chưa publish/tag hoặc cài đè global của user.

## Thay đổi đã triển khai

| Phần | Kết quả |
|---|---|
| Protocol | Capability check, assignment/result contracts, 2 child/depth 1, scope, ownership, cancel/failure/fallback |
| Review | Review độc lập chỉ đọc, lead kiểm chứng source/evidence và bỏ trùng |
| Feature | Opt-in parallel-write sau pilot, contract trước, ownership, integrate rồi verify final tree |
| Bug | Investigators chỉ đọc, lead writer, regression fail/pass evidence khi có môi trường |
| Versions | Package 10.3.0; ba skills/workflows 10.3.0; skills khác giữ version |
| Registry | Regenerate bằng builder, manifest version từ package, không sửa generated files bằng tay |
| Packaging | GEMINI.md và policy có trong tarball; không chứa .ai-local |
| Installer | Backup trước overlay, giữ profile/custom agents, backup GEMINI riêng, sửa marker và global references |

Working tree trước task có registry, installer, package.json và _specs thay đổi riêng. Không reset/restore chúng. Không tạo PR chung nhiều skills; khi tạo PR cần chia theo từng skill/workflow như implementation plan.

## Checks đã chạy

- Baseline: `npm test` — 94/94 PASS.
- Final: `npm run test:registry` — 100/100 PASS, regenerate registry thành công.
- `npm run test:graph` — 11 nodes, 10 edges, 0 cycles/conflicts/orphans.
- `npm run lint` — 11/11 skills hợp lệ.
- `git diff --check`, `node --check bin/install.js`, `node --check tooling/build-registry.js` — PASS.
- Installer integration: upgrade từ marker 10.2.0, profile/custom agent preservation, backup, same-version no-op, --force reinstall, refuse package-source install, isolated global home/path resolution.
- Workflow tests: YAML parse, unique step IDs, assignment inputs xuất hiện ở bước trước và outputs được execution step dùng.
- `npm pack`: required assets có trong package; đã giải nén và cài Antigravity local từ tarball vào workspace tạm thành công.

Đây là checks cấu trúc/installer, không phải chứng minh model luôn tuân thủ policy.

## PoC Antigravity runtime

- CLI version: 1.2.16.
- Parent conversation: `8882847c-c734-440e-87b3-fe6572e10380`.
- Child conversation: `85b2e7a5-7697-4c78-85f9-43bd36c5fbf1`.
- Fixture chỉ đọc:

```javascript
export function add(a, b) { return a - b; }
```

Prompt yêu cầu đọc policy và fixture trong workspace tạm, chỉ tạo một research child nếu có toolset chỉ đọc, không nesting, không sửa file và lead kiểm chứng finding. Lượt đầu hết thời hạn 45 giây khi chờ child; không coi status SUCCESS ngoài JSON là PASS đầy đủ.

Lượt tiếp theo yêu cầu kết thúc pilot, kiểm chứng kết quả và dừng child. CLI trả actual mode parallel-read; tool calls gồm view_file, invoke_subagent, manage_subagents. Parent báo child SUCCESS, finding math.js:1 dùng phép trừ thay vì cộng; đối chiếu fixture xác nhận đúng. Pilot database quan sát được child conversation và các tool-event markers tương ứng. Cleanup report ghi kill đúng child và list còn 0.

Kết luận PoC: một luồng spawn → finding → lead verification → cleanup đã được xác minh qua CLI. Chưa chạy code regression trong pilot (read-only), chưa xác minh IDE cards/spinner, full skill runtime prompt matrix hoặc benchmark chất lượng/tốc độ.

## Giới hạn và bước nghiệm thu còn lại

- Chạy ba prompt thực tế cho mỗi skill trong Antigravity trên dự án ứng dụng đại diện, gồm nhỏ/phức tạp/no-delegation hoặc failure.
- Test no-tool, stale baseline, cancellation giữa implementation, ownership conflict và multiple-writer integration trên fixture trước opt-in production work.
- Benchmark baseline single-agent so với multi-agent chưa chạy; không claim giảm chi phí/context hoặc tăng tốc theo phần trăm.
- Policy là hướng dẫn hành vi, không phải scheduler hay hard permission enforcement.
- Không phát hành npm/tag khi chưa có yêu cầu phát hành cụ thể. Tarball local là artifact review/install, không chứng minh release production đã nghiệm thu đầy đủ.
