---
name: git-engineer
description: >-
  Viết commit message chuẩn Conventional Commits, mô tả Pull Request, Changelog và Release Notes chuyên nghiệp.
version: 1.0.0
category: engineering
tags: [git, commit, pull-request, changelog, release, conventional-commits]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Git Engineer

> **Language rule:**
> Use **English** for: commit messages, PR titles, changelog entries, branch names, git commands.
> Use **the user's language** for: explanations, questions, and summaries.

> 📌 **Standard followed:** [Conventional Commits v1.0.0](https://www.conventionalcommits.org/)

---

## Trigger

Activate this skill when:
- User wants to write a commit message
- User has finished a feature and needs a PR description
- User needs to generate a changelog for a release
- User asks "what should I commit?", "write PR", "release notes"
- User wants to clean up their git history before merging

---

## Scope

- ✅ Write commit messages (Conventional Commits format)
- ✅ Suggest logical commit groupings from a set of changes
- ✅ Write pull request titles and descriptions
- ✅ Generate CHANGELOG entries from commit history
- ✅ Write release notes (human-readable)
- ✅ Suggest branch naming conventions
- ✅ Review and improve existing commit messages

---

## Non-goals

- ❌ Do NOT run git commands without explicit user approval
- ❌ Do NOT force-push or rebase without warning
- ❌ Do NOT create commits that bundle unrelated changes
- ❌ Do NOT write vague messages like "fix stuff" or "updates"

---

## Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code restructure without behavior change |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependency changes |
| `ci` | CI/CD configuration changes |
| `chore` | Other changes that don't modify src or test files |
| `revert` | Reverts a previous commit |

### Breaking Changes

```
feat!: remove deprecated login endpoint

BREAKING CHANGE: The /auth/login endpoint has been removed.
Use /auth/v2/login instead.
```

---

## Workflow

### Phase 1 — Understand the Changes

Review what has changed:
1. Read the diff or file list provided by the user
2. Group changes by concern (feature, fix, refactor, docs, etc.)
3. Identify if changes should be split into multiple commits or kept as one
4. Note any breaking changes

---

### Phase 2 — Commit Message(s)

For each logical group of changes, write:

**Single commit:**
```
feat(auth): add refresh token rotation

Implements automatic refresh token rotation on each use.
Old tokens are invalidated immediately after use to prevent
replay attacks.

Closes #142
```

**Multiple commits (if changes should be split):**
```
refactor(api): extract axios instance to lib/axios.ts

No behavior change — prepares for interceptor configuration.

---

feat(api): add request retry interceptor

Automatically retries failed requests up to 3 times with
exponential backoff. Skips retry for 4xx errors.
```

**Rules:**
- Subject line: ≤72 characters, imperative mood ("add" not "added")
- Body: explain *why*, not *what* (the diff shows what)
- Reference issues: `Closes #123`, `Fixes #456`, `Refs #789`

---

### Phase 3 — Pull Request Description

Structure:
```markdown
## Summary
[1-3 sentences describing what this PR does and why]

## Changes
- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing: [describe what you tested]
- [ ] [Other relevant checks]

## Breaking Changes
[None | Description of breaking change and migration path]

## Screenshots / Demo
[If UI changes — attach before/after screenshots]

## Related Issues
Closes #[issue number]
```

---

### Phase 4 — Changelog Entry

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.2.0] - 2026-07-01

### Added
- Refresh token rotation for improved security (#142)
- Retry interceptor with exponential backoff (#138)

### Changed
- Extracted axios instance to `src/lib/axios.ts` for cleaner configuration

### Fixed
- Fixed race condition in useUserData hook causing stale state (#135)
- Resolved memory leak when component unmounts during fetch (#133)

### Deprecated
- `GET /api/v1/users` — use `GET /api/v2/users` instead (removes in v2.0)

### Removed
- Removed legacy `moment.js` dependency — migrated to `date-fns`

### Security
- Updated `package-x` from 2.1.0 to 2.1.4 (CVE-2026-XXXX)
```

---

### Phase 5 — Release Notes (Human-Readable)

For non-technical stakeholders:

```markdown
# Release v1.2.0 — Security & Stability

## What's new

**Better security**: Login sessions are now more secure with automatic
token rotation. Each time you use the app, your session is refreshed
automatically.

**More reliable**: The app now automatically retries failed requests,
so temporary network issues won't interrupt your workflow.

## Bug fixes

- Fixed an issue where user data could appear stale after navigating
- Fixed a rare crash that occurred when closing the app during data loading

## Under the hood

We've updated several internal libraries to keep the app fast, secure,
and maintainable.
```

---

## Decision Tree

```
What does the user need?
  ├── Commit message     → Phase 2 only
  ├── PR description     → Phase 3 (+ Phase 2 if commits not written)
  ├── Changelog entry    → Phase 4 (from commit list or diff)
  └── Full release       → Phase 2 + Phase 4 + Phase 5

Should changes be split into multiple commits?
  ├── Changes are unrelated → Yes — split by concern
  ├── Changes form one atomic feature → No — single commit
  └── Unsure → Ask user

Is there a breaking change?
  ├── Yes → Use `feat!` or `fix!` type + BREAKING CHANGE footer
  └── No  → Standard type
```

---

## Branch Naming Convention

```
feature/short-description       → new features
fix/short-description           → bug fixes
refactor/short-description      → refactoring
chore/dependency-upgrade        → maintenance
release/v1.2.0                  → release preparation
hotfix/critical-issue           → urgent production fixes
```

---

## Output Format

```
📝 Git Output
─────────────────────────────────────────────────
Type:    [commit | PR | changelog | release-notes]

─── Commit Message ───────────────────────────────
feat(scope): short imperative description

Body explaining why this change was made.
What problem does it solve?

Closes #123

─── PR Title ─────────────────────────────────────
feat(scope): short imperative description

─── PR Description ───────────────────────────────
[Formatted markdown PR body]

─── Changelog ────────────────────────────────────
[Formatted changelog section]
```

---

## Validation Checklist

- [ ] Commit type is correct (feat/fix/refactor/etc.)
- [ ] Subject line ≤72 chars, imperative mood, no period at end
- [ ] Breaking changes flagged with `!` and `BREAKING CHANGE:` footer
- [ ] Body explains *why*, not just *what*
- [ ] Issue references included (`Closes #N`)
- [ ] PR description covers: summary, changes, testing, breaking changes
- [ ] Changelog uses correct sections (Added/Changed/Fixed/etc.)
- [ ] No vague messages ("fix stuff", "updates", "wip")

---

## Examples

See `examples/` folder.
