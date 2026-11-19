# Antigravity-Only Skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI Developer Skill OS install, describe, validate, and package only the Antigravity skin while preserving behavior, upgrade safety, and maintainability.

**Architecture:** The installer has one explicit target (`antigravity`) with local/global scopes. Skills carry their own execution guidance and only reference Antigravity metadata; YAML workflow contracts and other-platform adapters are removed after unique behavior is migrated. Keep only the developer tooling needed for installation, routing regression, rules, registry, and graph validation.

**Tech Stack:** Node.js 18+, npm, Vitest, YAML frontmatter, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-02-antigravity-only-design.md`

## Global Constraints

- Do not change user-installed files under `~/.gemini` or any other personal config.
- Do not publish npm or push Git.
- Preserve current uncommitted v11.0.1 work and the user's root `docs/` content.
- All shipped skills have `platforms: [antigravity]` and no `workflow` field.
- Never edit `.agents/registry/` by hand; regenerate it with `node tooling/build-registry.js`.
- Keep installer backup, managed-file conflict protection, and `GEMINI.md` backup-then-replace behavior.
- Preserve subagent orchestration behavior through Antigravity-compatible skill/rule instructions before deleting workflow YAML.
- Select release version after checking npm publication state; do not publish.

## Review Focus

- Existing installations with customized managed files retain their edits and still back up `GEMINI.md`; installer upgrade tests cover local/global installs and conflict behavior.
- Unsupported `--ide` values fail before modifying a target; an installer contract test covers Claude/OpenCode and unknown values.
- Removing workflow files does not remove any unique core-skill behavior; tests assert the five skills are standalone and contain their required execution/reporting contracts.
- Registry defaults cannot silently reintroduce Claude/OpenCode metadata; registry and validator tests cover omitted and explicit platform fields.
- The package excludes untracked root `docs/`, test-only files, and personal state; dry-run and archive inspection cover the tarball contents.

---

### Task 1: Restrict runtime and skill metadata to Antigravity

**Files:**
- Modify: `bin/install.js`
- Modify: `tooling/validate-skills.js`
- Modify: `tooling/build-registry.js`
- Modify: `.agents/skills/qk-*/SKILL.md`
- Test: `tests/install-script.test.js`
- Test: `tests/skill-contract.test.js`
- Test: `tests/registry-generation.test.js`

**Interfaces:** The CLI continues to accept `--ide=antigravity --scope=local|global`; `--ide=claude`, `--ide=opencode`, numeric legacy platform selections, and unknown platform names return a clear error before filesystem mutation. Skill metadata is exactly `platforms: [antigravity]` and drops the non-native `workflow` key in Task 2.

- [ ] Add failing validator/installer tests for antigravity-only platform metadata and unsupported target rejection.
- [ ] Run `npx vitest run tests/install-script.test.js tests/skill-contract.test.js tests/registry-generation.test.js` and verify the new assertions fail against current multi-platform behavior.
- [ ] Remove Claude/OpenCode install handlers and platform selection menu while retaining safe Antigravity local/global install logic.
- [ ] Update platform validation and registry defaults to Antigravity only; update skill frontmatter metadata.
- [ ] Run the targeted tests and verify Antigravity path/backup behavior still passes.

### Task 2: Remove YAML workflows without losing core behavior

**Files:**
- Modify: `.agents/skills/qk-*/SKILL.md`
- Modify: `.agents/rules/subagent-orchestration.md` if behavior is not already preserved
- Modify: `tooling/validate-skills.js`
- Delete: `.agents/workflows/**`
- Delete: `.agents/docs/schemas/workflow.schema.yml`
- Delete: `.agents/blueprints/workflow/project.yaml.tpl`
- Delete: `tests/orchestration-workflows.test.js`
- Test: `tests/skill-contract.test.js`, `tests/antigravity-rule-contract.test.js`

**Interfaces:** Skills remain independently discoverable from `SKILL.md`; validation still checks references/rules/triggers and global policy, but does not require an external workflow file.

- [ ] Add failing tests proving every core skill states its own intake, execution, verification, and report behavior, including Antigravity subagent guardrails where applicable.
- [ ] Run targeted skill contract tests and verify failures expose currently missing standalone behavior.
- [ ] Compare the five referenced workflows against their core skill and rule counterparts; migrate only unique, still-valid requirements into the appropriate skill/rule.
- [ ] Remove workflow frontmatter and validator workflow dependency; then delete the non-runtime workflow tree/schema/blueprint and workflow-only test.
- [ ] Run `npm run lint`, `npm run test:graph`, and targeted skill/rule contract tests.

### Task 3: Remove obsolete tooling and platform-only tests

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `tooling/build-registry.js` if remaining cross-platform fallback metadata exists
- Modify: `tests/behavior-conformance.test.js`, `tests/install-upgrade.test.js`
- Delete: `tooling/sync-versions.js`, `tooling/run-aar.js`, `tooling/generate-evaluation-cases.cjs`
- Test: `tests/`

**Interfaces:** Retain `build-registry`, `validate-graph`, `validate-skills`, installer, managed-file utilities, and route resolver. Keep npm scripts for tests, lint, registry/graph, and Antigravity local/global install only.

- [ ] Add or update tests that reject cross-platform assumptions in generated registry and package scripts.
- [ ] Confirm removed tools have no active caller other than the command being removed or historical changelog text.
- [ ] Remove stale scripts/files and Claude-specific upgrade expectations while preserving equivalent Antigravity upgrade/conflict tests.
- [ ] Run registry, routing, installer, and managed-files tests.

### Task 4: Align docs, schemas, CI, and project entrypoints

**Files:**
- Modify: `README.md`, `AGENTS.md`, `.agents/AGENTS.md`, `.agents/docs/ARCHITECTURE.md`, `.agents/docs/SPEC.md`, `.agents/docs/schemas/skill.schema.yml`, `.agents/docs/GOVERNANCE.md`
- Modify: `.github/workflows/ci.yml`
- Delete: `CLAUDE.md`
- Modify historical `_specs/plan/*.md` only to mark deleted workflow paths as historical, not active instructions.
- Test: `tests/antigravity-rule-contract.test.js`, `tests/shared-policy.test.js`

**Interfaces:** Current docs and schemas describe one supported platform and accurately identify Antigravity-native files; old changelog history remains intact.

- [ ] Add failing documentation/schema tests for only-Antigravity support and no Claude/OpenCode install examples.
- [ ] Run the targeted doc contract tests and verify they fail on current cross-platform docs/CI.
- [ ] Update current docs/schema and remove the Claude-specific entrypoint; update CI snapshot to run Antigravity in an isolated temporary home/workspace.
- [ ] Run targeted doc contracts and inspect workflows for stale platform paths.

### Task 5: Release metadata, registry, and npm tarball

**Files:**
- Modify: `package.json`, `package-lock.json`, `CHANGELOG.md`, `README.md`
- Regenerate: `.agents/registry/index.yaml`, `.agents/registry/graph.json`
- Create: `ai-developer-skill-os-<selected-version>.tgz`

**Interfaces:** npm package name and executable names remain stable. Select `12.0.0` if a v11 release is public; if not, retain `11.0.1` as the first unpublished release version. No npm/Git publishing.

- [ ] Check npm availability for `ai-developer-skill-os@11.0.1`; record the evidence and choose the release version according to the spec.
- [ ] Update package and lockfile versions and Antigravity-only keywords/description; write the release changelog.
- [ ] Regenerate the registry with `node tooling/build-registry.js` and verify no generated metadata mentions unsupported platforms.
- [ ] Run `npm run lint`, `npm run test:graph`, full `npx vitest run`, `git diff --check`, and `npm pack --dry-run --json`.
- [ ] Create the tarball, inspect its metadata and file list, verify user docs/tests/personal data are excluded, and record SHA-256.
- [ ] Attempt Antigravity prompt smoke tests for feature, bug, and review only if the local CLI responds; otherwise report `NOT VERIFIED`.

