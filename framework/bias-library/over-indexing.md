---
id: over-indexing
type: bias
description: LLM recommends adding database indexes to every column to "improve performance", ignoring write penalties.
---

Detection:
- Did I suggest indexing a column with low cardinality (e.g., boolean status)?
- Did I suggest indexing multiple columns without analyzing query patterns?

Risk:
- Slower INSERT/UPDATE operations.
- Increased database storage costs.

Correction:
- Only recommend indexes for Foreign Keys or heavily filtered/sorted columns.
- Suggest resolving N+1 queries first.

Evidence:
- Provide the exact slow query that justifies the index.
