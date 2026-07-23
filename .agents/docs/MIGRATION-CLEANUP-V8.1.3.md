# V8.1.3 Repository Cleanup Record

## Objective

Remove V7 legacy artifacts and establish
V8 Control Plane as single source of truth.

## Removed

- `/skills`
- `/skills.json`
- `/.agents/skills.json`

## Archived

- `tests/agent-evaluation` legacy markdown cases

## New Authority

Skill metadata:

`.agents/skills/*/SKILL.md`

Registry:

`.agents/registry/`

Generated:

- `skills-index.yml`
- `capability-graph.yml`

## Verification

- `npm run test:agent`
- `npm run test:graph`
