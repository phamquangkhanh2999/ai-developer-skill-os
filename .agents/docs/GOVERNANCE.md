# Project Governance

This document serves as the "Constitution" for the AI Developer Skill OS. It dictates how the project evolves, when core files can be modified, and how versions are incremented.

## 1. Core Philosophy
**Antigravity-first, features-second.** The supported runtime is Antigravity only.
Before submitting any Pull Request, ask yourself:
1. *Does this change require modifying the OS Kernel (`AGENTS.md`)?*
2. *If not, can this be solved at the Skill, Knowledge, or Template layer?*

If the problem can be solved in a Skill, Knowledge document, or Template, **do not touch the Kernel**.

## 2. When to modify `AGENTS.md` (The Kernel)
Keep the entry point concise and change it only when routing, supported runtime, safety contract, or installed structure changes. A supported-runtime or architecture change must include an ADR and synchronized tests/docs.

## 3. When to create an ADR (Architecture Decision Record)
ADRs (located in `docs/adr/`) must be created when:
- Modifying root `AGENTS.md`, `.agents/AGENTS.md`, or the package contract in `SPEC.md`.
- Introducing a new lifecycle phase to the pipeline.
- Deprecating an existing core feature or standard tool.

## 4. Definition of a "Breaking Change"
A change is considered **Breaking** if it:
- Alters the required YAML frontmatter contract in `SPEC.md`.
- Changes the fundamental routing logic or expected `behavior` / `intent` mappings.
- Removes an existing global policy that downstream agents rely on.

## 5. Versioning Strategy (Semantic Versioning)
We strictly adhere to SemVer based on the framework's architecture, not just content.
- **MAJOR:** Breaking package/runtime or metadata changes, including removing a supported platform.
- **MINOR:** Adding backward-compatible skills or package capabilities.
- **PATCH:** Compatible fixes to docs, validation, installer or individual skill behavior.

## 6. PR Review Process
1. **Architecture Compliance:** Does the PR violate the Kernel Freeze? Are all skills compliant with `SPEC.md`?
2. **Documentation Consistency:** Are the changes reflected in `CHANGELOG.md`?
3. **No Redundancy:** Ensure the PR does not re-introduce tool usage rules or verification overrides into individual skills.
