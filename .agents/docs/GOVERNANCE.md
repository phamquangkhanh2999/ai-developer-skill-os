# Project Governance

This document serves as the "Constitution" for the AI Developer Skill OS. It dictates how the project evolves, when core files can be modified, and how versions are incremented.

## 1. Core Philosophy
**Architecture-first, features-second.**
Before submitting any Pull Request, ask yourself:
1. *Does this change require modifying the OS Kernel (`AGENTS.md`)?*
2. *If not, can this be solved at the Skill, Knowledge, or Template layer?*

If the problem can be solved in a Skill, Knowledge document, or Template, **do not touch the Kernel**.

## 2. When to modify `AGENTS.md` (The Kernel)
The Kernel is **frozen**. Modifications to `AGENTS.md` are strictly prohibited unless:
- The change introduces a fundamentally new paradigm for ALL agents (e.g., a completely new approach to token management).
- A critical, framework-breaking hallucination loop is discovered that cannot be solved via Skill guidelines.
- **Requirement:** Any modification to `AGENTS.md` MUST be accompanied by a new Architecture Decision Record (ADR).

## 3. When to create an ADR (Architecture Decision Record)
ADRs (located in `docs/adr/`) must be created when:
- Modifying `AGENTS.md` or `SPEC.md`.
- Introducing a new lifecycle phase to the pipeline.
- Deprecating an existing core feature or standard tool.

## 4. Definition of a "Breaking Change"
A change is considered **Breaking** if it:
- Alters the required YAML frontmatter contract in `SPEC.md`.
- Changes the fundamental routing logic or expected `behavior` / `intent` mappings.
- Removes an existing global policy that downstream agents rely on.

## 5. Versioning Strategy (Semantic Versioning)
We strictly adhere to SemVer based on the framework's architecture, not just content.
- **MAJOR (e.g., v4.0.0 to v6.0.0):** Breaking changes to the Kernel (`AGENTS.md`), Metadata Contract (`SPEC.md`), or fundamental routing.
- **MINOR (e.g., v4.0.0 to v4.1.0):** Adding new Capabilities, new default Skills, new Knowledge docs, or new Templates. 
- **PATCH (e.g., v4.0.0 to v4.0.1):** Fixing typos in docs, updating README, or minor bug fixes within an individual skill's SOP.

## 6. PR Review Process
1. **Architecture Compliance:** Does the PR violate the Kernel Freeze? Are all skills compliant with `SPEC.md`?
2. **Documentation Consistency:** Are the changes reflected in `CHANGELOG.md`?
3. **No Redundancy:** Ensure the PR does not re-introduce tool usage rules or verification overrides into individual skills.
