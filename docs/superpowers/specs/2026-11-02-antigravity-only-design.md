# Antigravity-Only Skin Design

**Date:** 2026-11-02  
**Status:** Proposed; awaiting user approval  
**Scope:** Reduce AI Developer Skill OS to one supported runtime platform: Google Antigravity.

## Intent

Make Antigravity the only supported installation and runtime target so package metadata, installer behavior, skills, documentation, and CI describe the same product. Remove dead multi-platform adapters and the YAML workflow layer, which the project already documents as internal contracts rather than native Antigravity runtime workflows. Preserve the useful task behavior currently encoded in those contracts before deleting them.

The existing v11.0.1 changes and the user's untracked root `docs/` content are inputs to preserve. Do not publish npm or push Git as part of this change.

## Goals

- Installer supports only Antigravity local and global scopes.
- All shipped skill metadata declares only `antigravity`; validators and registry generation enforce that contract.
- Five core skills are self-contained and do not require non-native `.agents/workflows/*.yml` at runtime.
- Remove Claude Code and OpenCode adapters, aliases in installer, platform-specific tests, documentation, workflow schemas, and unused legacy tools.
- Keep Antigravity's install/upgrade safety, backup and user-file preservation behavior.
- Keep the small developer toolchain needed to validate and package the Antigravity skin.
- Update docs, CI, lockfile, changelog, release metadata, generated registry, and npm tarball consistently.

## Non-goals

- No changes to the user's installed `~/.gemini/config` or other personal files during this source refactor.
- No removal of generic coding knowledge, references, rules, or skills that Antigravity uses.
- No npm publish or Git push.
- No unsupported claim that Antigravity runtime behavior was manually verified unless tested in its UI/CLI.

## Approaches

1. Keep every workflow YAML and merely delete Claude/OpenCode support. This preserves existing internal schemas but keeps a large non-native workflow subsystem in an Antigravity-only product.
2. Remove the YAML workflow subsystem after transferring necessary behavior into the five core skills and shared Antigravity rules. Keep registry, validation, installation, and regression tests that protect the Antigravity runtime. **Selected by the user**, because workflow YAML is not Antigravity's runtime mechanism and they asked to remove tooling/workflows that are unnecessary.
3. Delete nearly all project tooling and tests as well. This makes the source smaller, but removes the ability to catch invalid rule metadata, broken references, registry drift, and installer regressions; it does not fit a release-ready npm package.

## Current dependency findings

- `bin/install.js` contains Antigravity, Claude, and OpenCode target maps, transforms, and an interactive three-platform menu.
- `package.json`, `tooling/validate-skills.js`, `tooling/build-registry.js`, `.agents/registry/*`, CI, and contract tests encode all three platforms.
- Each core skill's `workflow` frontmatter points to YAML. The validator rejects missing workflow files, while README says those YAML files are not Antigravity runtime workflows. Removing YAML requires changing the skill contract and carrying over any task behavior that exists only in the YAML.
- CI's snapshot job currently runs the Claude installer; it must become an isolated Antigravity install test.
- `tooling/sync-versions.js` and `tooling/run-aar.js` have no package-script/runtime callers; the `sync:v10` command is especially unsafe as it hard-codes an old release version. `tooling/generate-evaluation-cases.cjs` contains retired skill identifiers and has no package-script caller.
- Retain `bin/install.js`, `tooling/managed-files.js`, `tooling/validate-skills.js`, `tooling/build-registry.js`, `tooling/validate-graph.js`, and `tooling/route-resolver.js`: these support installation, user-file safety, Antigravity metadata and reference validation, generated indexes, and deterministic routing regression checks.

## Design decisions

### Installer and platform contract

- Restrict `--ide` to `antigravity`; keep the explicit flag for compatibility with current README/npm invocation examples and fail clearly for `claude`, `opencode`, or unknown values.
- Keep `--scope=local|global`, Antigravity destination paths, global path rewriting, existing backup behavior, managed-file conflict protection, and `GEMINI.md` adapter replacement behavior.
- Remove Claude/OpenCode handlers, menu options, package scripts, keywords, tests, and `CLAUDE.md`. The installer must never delete or modify a user's existing Claude/OpenCode configuration.
- Change the default and required skill platform list to exactly `[antigravity]`. Registry generation must not add other platforms when frontmatter omits the field; the validator should require the explicit Antigravity-only value.

### Skills, rules, and workflow removal

- Remove the `workflow` frontmatter field and the workflow-file existence requirement from skill validation.
- Before deleting workflow YAML, review the five workflow files currently referenced by skills (`feature-delivery`, `bug-resolution`, `code-review`, `refactor`, `production-release`). Transfer any unique required execution contract into the corresponding `SKILL.md` or an Antigravity rule/reference. Do not copy redundant or obsolete steps.
- Delete `.agents/workflows/`, workflow-specific schema and blueprint files, and `tests/orchestration-workflows.test.js` once equivalent skill/rule contract tests cover retained behavior.
- Remove historical multi-platform claims from current architecture/spec/schema docs; retain old changelog entries as release history and mark `_specs/` documents as historical where links to deleted workflow paths would otherwise imply they remain active.

### Tooling and tests

- Remove `sync:v10` and `tooling/sync-versions.js`, `tooling/run-aar.js`, and `tooling/generate-evaluation-cases.cjs` after confirming there are no active callers; preserve historical changelog text.
- Keep registry build, skill/rule validation, graph checks, installer, managed-file logic, route resolver, and tests for them. Rewrite installer tests to assert Antigravity local/global paths and explicit rejection of unsupported platforms. Remove Claude/OpenCode-only test cases.
- CI should run install into a temporary HOME/workspace for Antigravity, not create a Claude install artifact. CI path filters should include all Antigravity source, tests, docs, package, and lockfile inputs.

### Release and packaging

- Update `package.json` and `package-lock.json` together; update keywords and README/changelog to describe Antigravity-only support.
- Regenerate registry using `node tooling/build-registry.js`; never edit generated registry files by hand.
- Re-run lint, graph, full Vitest suite, package dry-run, and tarball inspection. Preserve the earlier tarball until the replacement package is verified, then replace it.
- Proposed version is `12.0.0` because removing Claude/OpenCode support is a breaking package contract change if any 11.x release is already public. If 11.0.1 was never published, the user may choose to publish the rebuilt Antigravity-only package as 11.0.1 instead; verify npm availability before selecting/publishing. This change does not publish either version.

## Acceptance criteria

- No active installer, package script, skill metadata, validator default, generated registry entry, or current user-facing documentation offers Claude/OpenCode support.
- Install command succeeds for Antigravity local/global in isolated directories and rejects unsupported platform arguments without touching target files.
- Upgrade tests prove existing customized Antigravity managed files are preserved, backups are created, and `GEMINI.md` replacement is backed up.
- All retained skills validate without workflow YAML; rule triggers and references validate; registry and graph are generated and consistent.
- Full tests and package checks pass; tarball contains the supported Antigravity runtime and release docs, with no root untracked `docs/` content or user files.
- Runtime smoke test is reported `NOT VERIFIED` if Antigravity CLI/UI cannot be exercised.

## Open release decision

Choose the version only after checking whether `11.0.1` is already public: use `12.0.0` when removing support from a published v11 line; if v11.0.1 remains unpublished, publishing the rebuilt package under 11.0.1 avoids an unnecessary gap. No publish action is included here.
