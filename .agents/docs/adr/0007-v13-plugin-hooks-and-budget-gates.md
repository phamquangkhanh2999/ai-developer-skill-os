# ADR 0007: v13 Native Antigravity Plugin, Lifecycle Hooks, and Context Budget Gates

- **Status:** Accepted
- **Date:** 2026-11-18
- **Decision owners:** AI Developer Skill OS maintainers

## Context

In Antigravity 2.0 and Antigravity IDE, rules are deduplicated by resolved file paths and share a `20,000`-token `defaultRulesBudget` (`24,000` bytes per rule file). Installing QK both globally (`~/.gemini/config/`) and locally (`<workspace>/.agents/`) caused both rule trees to be injected inline simultaneously. In addition, bare relative paths inside `.agents/AGENTS.md` broke when injected globally without a local `.agents/` tree, `.agents/docs/` governance records were copied into downstream user workspaces, and markdown-only rules could not enforce hard runtime blocks on generated `.agents/registry/` files.

Meanwhile, Antigravity natively supports `plugins/<dir>/plugin.json` bundles, `hooks.json` (`PreToolUse` command hooks), and specialized `research` (read-only sandbox) and `browser` (`BROWSER_HOST_FACTS`) subagents.

## Decision

1. **Normalize Entry-Point Paths & Deduplicate Dual Scope:** Prefix all `.agents/` references explicitly in `.agents/AGENTS.md` (while keeping `.agents/DEV_PROFILE.md` workspace-relative) and add `--scope=profile` so downstream projects can declare only `.agents/DEV_PROFILE.md` without duplicating global/plugin rules.
2. **Exclude Source Governance Docs from Downstream Installs:** Keep `.agents/docs/` and `.agents/LICENSE` in package source for repository contract tests, but exclude them from `generateManifest` and downstream copies so user workspaces remain lean and older upgrades prune unmodified copies automatically.
3. **Add Native Plugin Packaging (`--mode=plugin`):** Support installing a self-contained Antigravity plugin bundle (`qk-skill-os/plugin.json`, `rules/AGENTS.md` without frontmatter, `skills/`, `references/`, `hooks.json`, `assets/logo.svg`) toggled live via `customization://qk-skill-os`.
4. **Ship Lightweight PreToolUse Safety Hooks (`hooks.json`):** Enable `qk-registry-guard` by default to deny direct edits to generated registry files while deferring non-workspace paths to `"ask"` (preserving Antigravity's Non-Workspace File Access prompts), and ship `qk-destructive-command-guard` as opt-in (`enabled: false`, returning `"force_ask"` on destructive commands and `"ask"` otherwise).
5. **Enforce Rule Context Budget & Trigger Uniqueness in `npm run lint`:** Validate per-rule byte caps (`<= 24,000` bytes), aggregate always-on footprint (`<= 16,000` bytes), unique skill triggers, and `hooks.json` integrity.

## Consequences

- Downstream installations no longer carry internal QK ADRs or duplicate 2x rule tokens when paired with `--scope=profile` or `--mode=plugin`.
- Direct agent writes to `.agents/registry/index.yaml` and `graph.json` are deterministically blocked at runtime via `PreToolUse` without bypassing sandbox permissions for non-workspace paths.
- Subagent guidance aligns with Antigravity's real `research`, `browser` (`BROWSER_HOST_FACTS`), and opt-in `swarm` roster while remaining policy guidance contingent on active runtime permissions.
