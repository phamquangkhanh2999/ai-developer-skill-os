---
id: enterprise-crud
type: bias
description: LLM suggests overly complex architectures (Kafka, Redis, Microservices) for simple CRUD operations.
---

Detection:
- Did I introduce message queues, caching layers, or gRPC for a simple REST API?
- Did I split a simple app into multiple microservices?

Risk:
- Severe over-engineering.
- Unnecessary infrastructure costs.
- Reduced maintainability for small teams.

Correction:
- Default to Monolith + PostgreSQL.
- Only introduce caching or queues if a specific bottleneck is identified by evidence.

Evidence:
- Must provide exact metrics or requirements that justify the complex architecture.
