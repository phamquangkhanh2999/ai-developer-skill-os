---
version: 10.2.1
trigger: model_decision
description: "Standards for creating, routing, validating, maintaining, and retiring Antigravity skills."
domain: rules
applies_to: [skill-authoring, skill-governance]
---

# Skill Quality Rules — Antigravity Skill Governance

## Survival standard

Every skill must own a clear decision boundary, provide reusable capability rather than a static snippet, and route from realistic user language. Merge overlapping skills or retire them with matching updates to `.agents/AGENTS.md`, aliases and generated registry.

## Metadata and routing contract

- Follow the current Antigravity-only frontmatter contract in `.agents/docs/SPEC.md` and validate with `npm run lint`.
- Keep `platforms` exactly `[antigravity]`; do not add unsupported platform adapters or claim a tool capability through metadata.
- Use concise descriptions and concrete `triggers`; verify intended routing with representative prompts when either changes.
- Use `rules` and on-demand `references` for shared policy and domain detail. Do not add a workflow file or `workflow` frontmatter field; skill procedures belong in `SKILL.md`.

## Component versioning

- Bump a skill's own semver when its behavior or routing changes: patch for a focused correction, minor for compatible capability, major for a breaking skill contract.
- Bump a rule's version when its policy changes.
- Package versioning follows SemVer; platform/support removals or contract changes require a major package version.
- After skill metadata changes, run `node tooling/build-registry.js`; never hand-edit generated registry files.
