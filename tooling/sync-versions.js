import fs from 'fs';
import path from 'path';

const targetVersion = "9.1.0";
const rootDir = process.cwd();
const skillsDir = path.join(rootDir, '.agents', 'skills');

const skills = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());

let updatedCount = 0;

function getMemoryWorkflow(skillName) {
  const hints = {
    'qk-access-policy': {
      active: 'Architecture/Pattern (vd: ma trận quyền authz, middleware rbac)',
      harvest: 'Quyết định Architecture hoặc Pattern bảo mật (vd: guard mới, chính sách Zero-Trust)',
      ignore: 'Thao tác thêm 1 route/role thông thường vào bảng quyền đã có'
    },
    'qk-agent-observability': {
      active: 'Hard Bug / Convention (vd: mô hình lỗi lặp vô tận, giới hạn token budget)',
      harvest: 'Hard Bug mới có khả năng tái diễn (vd: lỗi loop định tuyến cần blacklist)',
      ignore: 'Trace log của một session đơn lẻ (tự XÓA sau khi thực thi)'
    },
    'qk-ai-builder': {
      active: 'Architecture/Pattern (vd: cấu hình provider LLM, chuẩn RAG pipeline, prompt template)',
      harvest: 'Pattern hoặc Convention mới (vd: quy chuẩn JSON schema cho prompt, scorecard định lượng)',
      ignore: 'Các thao tác tinh chỉnh từ ngữ prompt tạm thời cho 1 task đơn lẻ'
    },
    'qk-api-lifecycle': {
      active: 'Convention/Pattern (vd: cấu trúc wrapper { status, data, error }, pagination format)',
      harvest: 'Pattern hoặc Convention mới của dự án (vd: chuẩn xử lý lỗi API mới, rate limiting)',
      ignore: 'Thao tác thêm 1 CRUD endpoint thông thường theo Hợp đồng sẵn có'
    },
    'qk-bug-resolution': {
      active: 'Hard Bug (vd: lỗi memory leak, race condition, lỗi thư viện tương tự từng gặp)',
      harvest: 'Hard Bug mới có khả năng tái diễn (vd: nguyên nhân sâu xa của crash/leak để phòng ngừa)',
      ignore: 'Lỗi nhỏ chỉ xảy ra một lần (vd: typo, quên import, thiếu ngoặc đơn giản)'
    },
    'qk-code-review': {
      active: 'Architecture / Convention / Pattern hiện hành của dự án (Ground Truth để thẩm định)',
      harvest: 'Pattern hoặc Convention mới (vd: phát hiện anti-pattern lặp đi lặp lại trong codebase)',
      ignore: 'Các góp ý phong cách (formatting/linting) đơn lẻ trong một PR'
    },
    'qk-context-loader': {
      active: 'Pattern / Architecture (vd: sơ đồ phụ thuộc mô-đun, biểu đồ ngữ cảnh O(1))',
      harvest: 'Quyết định Architecture hoặc Pattern quan trọng khi ánh xạ dependency',
      ignore: 'Cache đồ thị ngữ cảnh tạm thời của một lệnh tìm kiếm'
    },
    'qk-data-lifecycle': {
      active: 'Convention / Architecture (vd: chiến lược migration backward-compatible, quy định FK)',
      harvest: 'Quyết định Architecture quan trọng (vd: chuẩn index CSDL, quy tắc phân trang mới)',
      ignore: 'Thao tác thêm trường đơn giản hoặc temporary database fix'
    },
    'qk-db-optimizer': {
      active: 'Pattern / Hard Bug (vd: lỗi slow query từng gặp, kế hoạch index đã duyệt)',
      harvest: 'Quyết định Architecture hoặc Pattern tối ưu (vd: chuẩn composite index, partition strategy)',
      ignore: 'Dữ liệu kết quả EXPLAIN tạm thời của 1 query'
    },
    'qk-design-system-engineering': {
      active: 'Architecture / Convention (vd: hợp đồng màu sắc DESIGN.md, spacing, typography token)',
      harvest: 'Pattern hoặc Convention mới (vd: định danh CSS variables mới cho toàn bộ hệ thống)',
      ignore: 'Sửa đổi CSS cục bộ cho 1 component đơn lẻ'
    },
    'qk-devops-platform': {
      active: 'Architecture / Hard Bug (vd: quy trình CI/CD pipeline, rollback strategy, docker env)',
      harvest: 'Quyết định Architecture quan trọng (vd: thay đổi runner CI, cấu hình rollback mới)',
      ignore: 'Log build tạm thời của CI/CD session'
    },
    'qk-docs': {
      active: 'Convention (vd: chuẩn cấu trúc tài liệu, ngôn ngữ giải thích Tiếng Việt / Code Tiếng Anh)',
      harvest: 'Pattern hoặc Convention mới của dự án (vd: quy chuẩn viết ADR hoặc tài liệu kiến trúc mới)',
      ignore: 'Các lần sửa chính tả, ngữ pháp đơn lẻ'
    },
    'qk-engineering-standard': {
      active: 'Convention / Architecture (vd: ngưỡng định lượng độ phức tạp cyclomatic, DRY, SOLID)',
      harvest: 'Convention hoặc ranh giới kỹ thuật mới (vd: áp đặt giới hạn 100 dòng cho file AGENTS.md)',
      ignore: 'Cảnh báo linter tạm thời'
    },
    'qk-fe-api-integration': {
      active: 'Pattern / Convention (vd: cách quản lý state TanStack Query/Zustand, binding chuẩn)',
      harvest: 'Pattern mới (vd: quy tắc cache/revalidate dữ liệu tầng Frontend)',
      ignore: 'Logic call API của 1 component riêng rẽ'
    },
    'qk-feature-delivery': {
      active: 'Architecture / Pattern / Convention liên quan đến luồng tính năng hiện tại',
      harvest: 'Quyết định Architecture hoặc Pattern mới hình thành khi làm feature',
      ignore: 'Dữ liệu mock phục vụ thử nghiệm tính năng ban đầu'
    },
    'qk-frontend-architecture': {
      active: 'Architecture (vd: quy tắc router TanStack/Next, module routing, state isolation)',
      harvest: 'Quyết định Architecture trọng yếu (vd: đổi chiến lược routing hoặc state management)',
      ignore: 'Refactor UI component thông thường'
    },
    'qk-orchestrator': {
      active: 'Architecture / Convention (vd: bảng điều hướng kỹ năng, ràng buộc ranh giới rõ ràng)',
      harvest: 'Quy luật phân phối routing hiệu quả mới',
      ignore: 'Trình tự gọi lệnh tạm thời của một prompt user'
    },
    'qk-product-specification': {
      active: 'Convention / Pattern (vd: định dạng Acceptance Criteria, cấu trúc PRD)',
      harvest: 'Thỏa thuận Product Spec hoặc cấu trúc requirement mới',
      ignore: 'Ghi chú thảo luận ý tưởng thô ban đầu'
    },
    'qk-production-release': {
      active: 'Convention / Hard Bug (vd: 8-gate checklist release, rủi ro production cũ)',
      harvest: 'Checklist hoặc Gate bảo vệ Production mới được đưa ra từ post-mortem',
      ignore: 'Log deploy staging tạm thời'
    },
    'qk-project-bootstrap': {
      active: 'Architecture / Convention (vd: mô hình 4-folder RAG/Agent, blueprint quy chuẩn V9)',
      harvest: 'Cấu trúc thư mục hoặc template scaffold mẫu mới của dự án',
      ignore: 'File cấu hình local rác (đã đưa vào gitignore)'
    },
    'qk-project-health': {
      active: 'Architecture / Hard Bug (vd: chỉ số sức khỏe codebase 0-100, các điểm nợ kỹ thuật tech debt)',
      harvest: 'Mô hình Code Smell hoặc Tech Debt hệ thống cần theo dõi tiêu diệt',
      ignore: 'Report health tạm thời của 1 đợt scan'
    },
    'qk-refactor': {
      active: 'Pattern / Convention (vd: chiến lược tách file anti-slop, bảo toàn public contract)',
      harvest: 'Pattern tái cấu trúc mã nguồn hiệu quả (vd: bẻ gẫy god-file thành module O(1))',
      ignore: 'Các thao tác đổi tên biến (rename) hoặc format đơn giản'
    },
    'qk-security-audit': {
      active: 'Hard Bug / Architecture (vd: lỗ hổng OWASP, lộ rò rỉ secret, quy chuẩn Zero-Trust R-SEC-04)',
      harvest: 'Lỗ hổng bảo mật mới phát hiện (Hard Bug) hoặc chính sách an toàn mới',
      ignore: 'Cảnh báo scanner giả (false positive) đã xác thực'
    },
    'qk-system-evolution': {
      active: 'Architecture / Hard Bug (vd: kế hoạch nâng cấp thư viện incremental, breaking changes)',
      harvest: 'Kinh nghiệm xử lý xung đột dependency hoặc bài học downgrade/rollback',
      ignore: 'Lockfile changes tạm thời trong local cache'
    },
    'qk-test-engineering': {
      active: 'Convention / Pattern (vd: chiến lược Test Pyramid, mock provider Vitest/Jest, boundary test)',
      harvest: 'Pattern viết mock/stub mới hoặc chiến lược fixture dự án',
      ignore: 'File coverage nháp sinh ra trong quá trình chạy test'
    },
    'qk-ui-audit': {
      active: 'Convention / Pattern (vd: 57 check Anti-Slop, độ tương phản A11y, Design Contract)',
      harvest: 'Các mẫu lỗi AI-Slop phổ biến mới phát hiện trong UI dự án',
      ignore: 'Lỗi lệch vài pixel hoặc sai color shade lẻ tẻ'
    },
    'qk-ui-builder': {
      active: 'Convention / Architecture (vd: bộ token màu sắc, typography, animation từ DESIGN.md)',
      harvest: 'Mẫu layout hoặc component kết hợp chuẩn mực mới của ứng dụng',
      ignore: 'CSS linh tinh không thuộc hệ thống design system'
    },
    'qk-ui-system-builder': {
      active: 'Architecture / Convention (vd: ánh xạ 1:1 từ contract DESIGN.md sang biến CSS)',
      harvest: 'Chuẩn quy tắc đặt tên (--color-role-shade) hoặc cơ chế scale Dark Mode',
      ignore: 'Giá trị màu thử nghiệm ngoài hợp đồng (bị nghiêm cấm)'
    },
    'qk-validation-gate': {
      active: 'Convention / Architecture (vd: các ngưỡng scorecard, quy định zero hallucination)',
      harvest: 'Bộ tiêu chí kiểm định mới (Scorecard metric) được tích hợp vào pipeline',
      ignore: 'Kết quả log pass/fail tạm thời của một build con'
    },
    'qk-web-quality-gate': {
      active: 'Convention / Hard Bug (vd: chỉ số Core Web Vitals LCP/CLS, rủi ro bot SEO/A11y)',
      harvest: 'Mẫu tối ưu hiệu năng web (vd: chiến lược lazyload hình ảnh, bundle partition)',
      ignore: 'Report Lighthouse của lần đo test tạm thời'
    }
  };

  const hint = hints[skillName] || {};

  return `## Memory Workflow

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - \`.agents/knowledge/index.yaml\` (Shared Project Knowledge)
  - \`.ai-local/knowledge/index.yaml\` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái \`Active\` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern${hint.active ? `\n  - 👉 *Domain Focus:* ${hint.active}.` : ''}

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.${hint.harvest ? `\n  - 👉 *Domain Harvest:* ${hint.harvest}.` : ''}

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: \`.ai-local/candidates/\`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - \`/learn\`
    - \`qk-project-memory\`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

\`\`\`
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
\`\`\`

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.${hint.ignore ? `\n- 👉 *Domain Ignore:* ${hint.ignore}.` : ''}

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---

`;
}

skills.forEach(skill => {
  const skillPath = path.join(skillsDir, skill);
  
  // 1. SKILL.md
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    let content = fs.readFileSync(skillMdPath, 'utf8');
    let newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: ${targetVersion}`);
    newContent = newContent.replace(/^# ── V[\d]+: Classification/m, `# ── V9: Classification`);
    
    // Inject or update Memory Workflow (except qk-project-memory which manages memory itself)
    if (skill !== 'qk-project-memory' && skill !== 'qk-help') {
      const block = getMemoryWorkflow(skill);
      if (newContent.includes('## Memory Workflow')) {
        newContent = newContent.replace(/## Memory Workflow[\s\S]*?(?=\r?\n---\r?\n|\r?\n## )/m, block.trimEnd());
      } else if (newContent.includes('## 🧭 V1 Knowledge Protocol')) {
        newContent = newContent.replace(/## 🧭 V1 Knowledge Protocol[\s\S]*?(?=\r?\n---\r?\n|\r?\n## )/m, block.trimEnd());
      } else if (newContent.includes('## Preconditions')) {
        newContent = newContent.replace('## Preconditions', block + '## Preconditions');
      } else if (newContent.includes('## Scope')) {
        newContent = newContent.replace('## Scope', block + '## Scope');
      } else if (newContent.includes('## Workflow')) {
        newContent = newContent.replace('## Workflow', block + '## Workflow');
      } else {
        newContent = newContent.replace(/(# .*\r?\n\r?\n(> .*\r?\n)?\r?\n?---\r?\n\r?\n)/, '$1' + block);
      }
    }

    if (content !== newContent) {
      fs.writeFileSync(skillMdPath, newContent, 'utf8');
      updatedCount++;
    }
  }

  // 2. capability.yaml
  const capPath = path.join(skillPath, 'capability.yaml');
  if (fs.existsSync(capPath)) {
    let content = fs.readFileSync(capPath, 'utf8');
    const newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: "${targetVersion}"`);
    if (content !== newContent) {
      fs.writeFileSync(capPath, newContent, 'utf8');
      updatedCount++;
    }
  }

  // 3. evals/scorecard.yaml
  const evalPath = path.join(skillPath, 'evals', 'scorecard.yaml');
  if (fs.existsSync(evalPath)) {
    let content = fs.readFileSync(evalPath, 'utf8');
    const newContent = content.replace(/^version:\s*["']?[\d.]+["']?/m, `version: ${targetVersion}`);
    if (content !== newContent) {
      fs.writeFileSync(evalPath, newContent, 'utf8');
      updatedCount++;
    }
  }
});

console.log(`✅ Synchronized version to ${targetVersion} & Memory Workflow across ${updatedCount} files.`);
