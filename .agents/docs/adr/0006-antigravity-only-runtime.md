# ADR 0006: Antigravity-Only Runtime

- **Status:** Accepted
- **Date:** 2026-11-02
- **Decision owners:** AI Developer Skill OS maintainers

## Context

The package's active product goal is a reliable Antigravity skin. Installer targets, current docs, metadata and CI still carried legacy Claude/OpenCode/Kilo adapters and a YAML workflow tree that Antigravity does not execute. Keeping these surfaces advertised created a broader support contract than the project could validate and added no active Antigravity runtime value.

## Decision

Support Antigravity only. Remove the unsupported installer adapters/configuration, YAML workflow definitions and obsolete maintenance scripts. Keep skill procedures in `SKILL.md`, reusable policy in `.agents/rules/`, and detailed guidance in `.agents/references/`. Keep old changelog/ADR/release notes as historical records, clearly separated from current setup/specification docs.

Subagent delegation remains conditional: repository policy describes safe task boundaries, while actual availability and permission come only from the active Antigravity runtime. The package must not claim delegation as an enforced or guaranteed capability.

## Consequences

- Dropping advertised platforms and the workflow contract is a breaking package change; use major version `12.0.0`.
- `platforms` metadata is exactly `[antigravity]`; no `workflow` frontmatter field is required or generated.
- CI validates skills, rules, graph, installer behavior and an isolated Antigravity local installation.
- Historical documents can mention retired formats, but they must identify themselves as historical and must not be linked as current installation instructions.
- Tests verify repository contracts; they do not substitute for live Antigravity UI/model-routing validation.

## Alternatives considered

1. **Keep all adapters but mark them deprecated:** rejected because it would continue implying untested compatibility and retain maintenance surface.
2. **Keep YAML workflows as Antigravity runtime support:** rejected because current Antigravity skill guidance uses skills, while these files had no runtime consumer in the package.
3. **Remove historical records:** rejected because retaining release history preserves migration context without advertising it as current behavior.
