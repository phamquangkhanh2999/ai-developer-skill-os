---
name: qk-system-evolution
category: maintenance
version: 7.5.1
description: "Nâng cấp thư viện/framework an toàn với rollback plan bắt buộc — incremental, không big-bang."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, report, plan]
consumes: [context-graph, source-code]

token_budget:
  max_files_read: 4
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

# qk-system-evolution — Safe Upgrade Manager

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Preconditions
- [ ] Current version and target version are specified
- [ ] Rollback strategy is defined (git tag OR package-lock.json snapshot)
- [ ] Existing test suite is available to verify after upgrade

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Rollback plan required before any major upgrade. Specify: target version + rollback method."
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Read official Changelog/Migration Guide for breaking changes
- ✅ Apply incremental upgrades (not big-bang)
- ✅ Verify each step with existing tests
- ✅ Document rollback procedure

## Non-Goals
- ❌ Blindly run `npm update` — only targeted upgrades
- ❌ Skip reading Changelog for major version bumps
- ❌ Upgrade multiple major versions at once (one at a time)

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | Read Changelog for breaking changes | Never |
| P2 | Snapshot rollback point (git tag) | Never |
| P3 | Apply upgrade to package.json only | Never |
| P4 | Run tests to detect breakage | Never |
| P5 | Fix breaking changes if minor (< 3 files affected) | Budget < 40% |
| P6 | Update documentation/README | Budget < 70% |

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Breaking Change Analysis

**Steps:**
1. `view_file` or `read_url` — read official Changelog for target version
2. List all `BREAKING CHANGE` entries
3. Map each breaking change to affected files in current codebase (`grep_search`)

**Decision:**
```
IF 0 breaking changes
  → Confidence: HIGH → go to Phase 2 (minor/patch upgrade)

IF 1–3 breaking changes, all in < 5 files
  → Confidence: MEDIUM → go to Phase 2

IF > 3 breaking changes OR affects core files
  → EXIT: BLOCKED — this is architectural migration, not an upgrade
  → Recommend: plan as a dedicated migration project
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

### Phase 2 — Rollback Snapshot

**Steps:**
1. Verify `git tag` or instruct user to create one: `git tag pre-upgrade-[package]-[version]`
2. Copy `package-lock.json` snapshot reference
3. Document exact rollback command:
   ```
   Rollback: git checkout pre-upgrade-[package]-[version]
   OR: npm install [package]@[previous-version]
   ```

**Exit When:** Rollback procedure documented → go to Phase 3

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

### Phase 3 — Incremental Upgrade

**Steps:**
1. Edit `package.json` — change version (one package at a time)
2. Apply code changes for breaking changes (using `replace_file_content`)
3. Run: `npm install` (1 command)

**Decision:**
```
IF install succeeds
  → go to Phase 4

IF install fails (peer dep conflict)
  → EXIT: PARTIAL — report conflict, suggest resolution
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

### Phase 4 — Verification

**Steps:**
1. Run tests: `npm test` (2nd command)
2. Parse test results for failures

**Decision:**
```
IF all tests pass
  → EXIT: SUCCESS

IF 1–3 tests fail (related to upgrade)
  → Fix if minor (< 10 lines change per fix)
  → EXIT: PARTIAL

IF > 3 tests fail OR core tests fail
  → EXIT: FAILED — rollback recommended
  → Provide exact rollback command
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Changelog read, breaking changes mapped, tests pass | Proceed |
| MEDIUM | Changelog read, some uncertainties remain | Proceed with caution, note risks |
| LOW | Cannot access Changelog or no tests available | EXIT: BLOCKED |

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Severity

| Level | Definition |
|-------|-----------|
| CRITICAL | Core authentication/security package upgrade |
| HIGH | ORM, framework, or router upgrade |
| MEDIUM | Utility library, build tool upgrade |
| LOW | Dev dependency, formatter upgrade |

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Evidence Format

```
[SEVERITY] package: [name] v[old] → v[new]
Breaking changes: [list from Changelog]
Affected files:   [N files — list]
Confidence:       [HIGH|MEDIUM|LOW]
Rollback:         git checkout [tag] OR npm install [name]@[old-version]
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Rollback Procedure (Required Output)

Every upgrade must document:
```
🔄 Rollback Procedure
─────────────────────────────────────────────────
Method 1 (Git):  git checkout [tag-name]
Method 2 (npm):  npm install [package]@[previous-version]
Snapshot tag:    [pre-upgrade-[package]-[date]]
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["package_name", "target_version", "rollback_method"],
  "optional_fields": ["changelog_url", "affected_scope"]
}
```

### Produces
```json
{
  "to": "qk-validation-gate",
  "output_fields": ["upgraded_packages", "breaking_changes_fixed", "rollback_procedure", "exit_code"]
}
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---


---

## Escalation Rules


---

## Retry Policy


---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Upgrade complete, all tests pass | Clean upgrade |
| PARTIAL | Upgrade done, some tests fail or peer conflict | Needs follow-up |
| BLOCKED | No rollback plan or too many breaking changes | Plan migration instead |
| FAILED | Tests fail after upgrade, rollback recommended | Provide rollback command |

---



