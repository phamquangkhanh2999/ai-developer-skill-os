---
name: qk-system-evolution
purpose: Nâng cấp version, Impact Analysis, dry-run, apply và rollback.
mode_supported: [enterprise]
input: [Upgrade target]
output: [Upgraded system]
workflow: [1. Analyze -> 2. Plan -> 3. Dry-run -> 4. Apply -> 5. Verify -> 6. Rollback (if fail)]
allowed_tools: [run_command, write_to_file]
handoff_to: [qk-validation-gate]
---

# 🛠️ qk-system-evolution - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Nâng cấp version, Impact Analysis, dry-run, apply và rollback.

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-validation-gate`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Migration & Dependency Upgrade

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

> ⚠️ **Always create a rollback plan before starting any migration.**
> Never apply breaking upgrades to production without a verified fallback.

---

## Trigger

Activate this skill when:
- User wants to upgrade a package or dependency
- Framework has a new major version (React 17→19, Vue 2→3, Next.js 13→15)
- A library is deprecated or has a security vulnerability (CVE)
- User wants to replace one library with another
- `project-audit` flagged outdated or risky dependencies (P1/P2)
- User says "update packages", "upgrade to v5", "migrate to new version"

---

## Scope

- ✅ Dependency version upgrades (patch, minor, major)
- ✅ Framework version migrations with breaking changes
- ✅ Library replacement (swap one library for another)
- ✅ Package conflict resolution
- ✅ Configuration updates required by new versions
- ✅ Code changes required by breaking API changes
- ✅ Rollback planning

---

## Non-goals

- ❌ Do NOT upgrade everything at once — always upgrade incrementally
- ❌ Do NOT skip reading the changelog/migration guide
- ❌ Do NOT ignore peer dependency warnings without investigating
- ❌ Do NOT apply breaking changes without a rollback plan
- ❌ Do NOT upgrade dev dependencies and prod dependencies in the same step

---

## Severity Levels

| Level | Meaning |
|-------|---------|
| P0 | Security vulnerability (CVE) — upgrade immediately |
| P1 | Breaking change affecting core functionality |
| P2 | Deprecated API with upcoming removal |
| P3 | Minor version lag — low risk, upgrade when convenient |

---

## Migration Types

| Type | Risk | Strategy |
|------|------|----------|
| **Patch** (1.0.x → 1.0.y) | Low | Upgrade directly, verify tests |
| **Minor** (1.x.0 → 1.y.0) | Low-Medium | Read changelog, upgrade, verify |
| **Major** (x.0.0 → y.0.0) | High | Read migration guide, upgrade incrementally, test thoroughly |
| **Framework** (React 17→19) | Very High | Follow official migration guide step by step |
| **Library swap** | High | Strangler fig pattern — migrate incrementally |

---

## Workflow

### Phase 1 — Audit Current State

Before upgrading:
1. List all dependencies with current versions
2. Identify which are outdated (use `npm outdated` / `pnpm outdated`)
3. Check for known CVEs (`npm audit` / `pnpm audit`)
4. Classify each outdated package by migration type and risk
5. Check peer dependency constraints

```bash
npm outdated          # See what's outdated
npm audit             # Security vulnerabilities
npx depcheck          # Unused dependencies
```

---

### Phase 2 — Read Migration Guide

For every major version upgrade:
1. Read the official CHANGELOG or migration guide
2. List all breaking changes that affect the project
3. List all deprecated APIs still in use
4. Estimate effort: number of files to change, complexity of changes

Document findings before touching any code.

---

### Phase 3 — Plan the Migration

Create an ordered upgrade sequence:

**Rules:**
- Security fixes first (P0)
- Dev dependencies before prod dependencies (lower risk)
- Upgrade one major dependency at a time — not everything together
- Group related packages (e.g., all `@tanstack/*` together)

**Example order:**
```
Step 1: Security patch — package-x 2.1.0 → 2.1.4 (CVE fix)
Step 2: Dev tools — eslint 8 → 9 (no runtime impact)
Step 3: Minor upgrades — axios 1.4 → 1.7 (non-breaking)
Step 4: Major upgrade — react-query 4 → 5 (breaking — separate PR)
```

---

### Phase 4 — Create Rollback Plan

Before applying any change:
```
Rollback method:
  Option A: git revert / git checkout to previous state
  Option B: Pin version in package.json to previous known-good version
  Option C: Feature flag to disable new behavior

Rollback trigger:
  - Tests fail after upgrade
  - Runtime errors in staging
  - Performance regression detected
```

---

### Phase 5 — Execute the Upgrade

For each package in the plan:

1. **Upgrade package:**
```bash
npm install package-name@version
# or
pnpm add package-name@version
```

2. **Update configuration** (if required by new version)

3. **Fix breaking changes** in code:
   - Update import paths
   - Replace deprecated APIs
   - Update type signatures
   - Update config files

4. **Run verification** (see Phase 6) before moving to next package

---

### Phase 6 — Verify After Each Step

After every upgrade step:
- [ ] `npm install` / `pnpm install` — no resolution errors
- [ ] `npm run build` — builds successfully
- [ ] `npm run type-check` — no new TypeScript errors
- [ ] `npm run lint` — clean
- [ ] `npm test` — all tests pass
- [ ] Manual smoke test of affected features

**If any check fails → rollback this step before continuing.**

---

### Phase 7 — Library Replacement (Strangler Fig Pattern)

When replacing one library with another (e.g., moment → date-fns):

```
Step 1: Install new library alongside old one
Step 2: Create adapter/wrapper that abstracts the library
Step 3: Migrate usage file by file (not all at once)
Step 4: Verify each file after migration
Step 5: Remove old library when 100% migrated
Step 6: Remove adapter if no longer needed
```

This allows incremental migration with rollback possible at any step.

---

## Decision Tree

```
What type of upgrade?
  ├── Patch/Minor → Upgrade directly, run tests
  ├── Major       → Read changelog → plan → upgrade → verify
  └── Framework   → Follow official migration guide step by step

Security vulnerability?
  ├── P0 (critical) → Upgrade immediately, prioritize over other work
  └── P1/P2        → Include in next planned upgrade cycle

Library replacement?
  └── Use strangler fig pattern — never replace all at once
```

---

## Output Format

```
📦 Migration Report
─────────────────────────────────────────────────
Scope:      [What was upgraded / migrated]
Type:       [Patch / Minor / Major / Framework / Library swap]
Risk:       [Low / Medium / High]

Changes:
  ✅ package-x:  2.1.0 → 2.1.4  (CVE fix — no code changes)
  ✅ axios:      1.4.0 → 1.7.2  (minor — updated interceptor config)
  ✅ react:      18.2.0 → 19.0.0 (major — updated 12 files)

Breaking changes handled:
  • [Description of breaking change and how it was resolved]

📋 Rollback plan:
  git revert <commit-hash> or pin to previous version in package.json

✅ Verification:
  Build:      PASS
  Types:      Clean
  Tests:      PASS (N tests)
  Lint:       Clean
  Smoke test: PASS

⚠️  Known issues / follow-up:
  • [Any remaining deprecated APIs to address]
  • [Any packages still pending upgrade]
```

---

## Validation Checklist

- [ ] Migration guide read for every major version change
- [ ] Rollback plan documented before starting
- [ ] Upgraded incrementally — one major change at a time
- [ ] `npm audit` clean after upgrade
- [ ] Build, types, lint, tests all pass
- [ ] Smoke test of affected features complete
- [ ] No new peer dependency warnings left unresolved
- [ ] Breaking changes documented in output

---

## Common Migration Cheat Sheet

```
React 17 → 18:   Concurrent mode, new root API, Suspense updates
React 18 → 19:   Server components, new hooks (useActionState), ref as prop
Vue 2 → 3:       Composition API, new reactivity system, breaking changes in lifecycle
Next.js 12 → 13: App Router introduced (pages/ still works)
Next.js 13 → 14: Server Actions stable, metadata API
Next.js 14 → 15: React 19, async params, updated caching defaults
TanStack Query 4 → 5: New API (no more isLoading/isError split), object syntax
```

---

## Examples

See `examples/` folder.
