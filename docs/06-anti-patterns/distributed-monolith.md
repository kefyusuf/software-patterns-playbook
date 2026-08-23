---
title: Distributed Monolith
category: architecture
related_patterns:
  - Modular Monolith
  - Saga
  - Outbox
---

# Distributed Monolith

## Definition

A Distributed Monolith deploys many services that behave as one tightly coupled unit: they release together, share databases or models, and require synchronized changes — all the operational cost of microservices with none of the independence.

## Symptoms

- Every feature touches five services, which must deploy in a strict order.
- Services read each other's database tables directly "just for this report".
- A change to one team's API breaks three other teams' pipelines.
- No service can scale or fail independently in any useful way.

## Why It Happens

Teams split along *technical* layers (auth-service, data-service, util-service) instead of business capabilities. Conway's law does the rest: an org that coordinates centrally builds "services" that cannot act alone. Splitting before domain boundaries stabilized guarantees shared-model sprawl.

## Why It Is Harmful

You pay every distributed-systems tax — network failure modes, latency, partial consistency, tracing overhead — while keeping single-deploy coupling. Coordination costs multiply across teams; on-call surfaces grow; yet the flexibility that justified splitting never materializes.

## Before Example

```txt
services/
  auth-service/        # reads users-db tables owned by user-service
  user-service/
  notification-service/# imports shared-lib/domain/Order.php from orders-service
  orders-service/

deploy: always all four, in this exact order
```

## Better Alternatives

- [Modular Monolith](../03-architecture-patterns/modular-monolith.md): one deployable, hard module boundaries — split later only where boundaries proved stable.
- Where services must interact: explicit contracts, private data ([Outbox](../04-enterprise-patterns/outbox.md) for propagation), no cross-database reads.
- Cross-service workflows via [Saga](../04-enterprise-patterns/saga.md) instead of ordered group deploys.

## Refactoring Path

1. Map real change-coupling: which services *always* ship together? Those are your monolith.
2. Break direct cross-database access; route through owned APIs/events.
3. Re-merge chronically co-deployed services into modules of one deployable.
4. Target shape: few services, each independently valuable, deployable, and scalable.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?
