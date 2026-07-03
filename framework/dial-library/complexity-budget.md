---
id: complexity-budget
type: dial
description: Defines the ceiling for architectural and code complexity.
---

Levels:
- **Level 1 (Prototype):** Hardcode data, skip tests, minimal validation. Goal is highest speed.
- **Level 5 (Standard):** Monolith, basic SQL/ORM, Zod validation, essential error states.
- **Level 10 (Enterprise):** Event-driven architecture, CQRS, strict rate limiting, 100% test coverage.

Usage:
- The AI must infer the current budget based on the Project Scale (MVP vs Enterprise) and stick to it. Never exceed the budget.
