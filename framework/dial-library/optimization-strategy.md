---
id: optimization-strategy
type: dial
description: Defines the approach to database and performance optimization.
---

Levels:
- **Level 1 (Query Fixes):** Resolve N+1 issues and add basic indexes.
- **Level 5 (Caching):** Introduce Redis or Memcached for heavy read paths.
- **Level 10 (Architecture):** CQRS, Read Replicas, Sharding.

Usage:
- Start at Level 1. Never jump to Level 5 or 10 without explicit bottleneck evidence.
