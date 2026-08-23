# Microservices

## One-Line Definition

Microservices structure a system as independently deployable services, each owning its data and a bounded slice of the business, communicating over networks.

## Problem

A single deployable couples every team to one release train: one bad module blocks all deploys, scaling wastes whole-app resources, and organizational ownership blurs into shared code nobody owns.

## Context

This is an organization-scaling architecture more than a technical one. Its costs — network failures, distributed transactions, operational tooling — are only worth paying when team count and domain size outgrow a modular monolith's boundaries.

## When to Use

- Multiple teams need independent deployment cadences on the same product.
- Domains have genuinely different scaling or technology needs.
- Organizational ownership maps cleanly onto service boundaries.

## When Not to Use

- Small teams; the operational overhead outweighs coordination savings.
- Domain boundaries are still unclear — split later from a [Modular Monolith](./modular-monolith.md) instead.
- Latency-sensitive flows would shatter into network hops.
- Nobody owns on-call, observability, or deployment automation yet.

## Typical Shape

```txt
Service A (own DB) ──events/commands──▶ Service B (own DB)
       │                                     │
   gateway / UI  ◀── composed responses ─────┘
```

Each service owns its schema; no shared databases. Synchronous calls for queries, asynchronous events for state propagation, and explicit contracts at every edge.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Independent deploy and release cadence per team | Distributed-systems failure modes everywhere |
| Targeted scaling and per-service tech choice | Data consistency across services is hard |
| Clear ownership aligns with team topology | Observability and infra investment mandatory |

## Good Fit

- Products with many teams stepping on each other's releases
- Domains with clearly separable bounded contexts
- Organizations able to fund platform/DevOps capability

## Bad Fit

- Startups pre-product-market-fit
- Single-team codebases
- Systems whose "services" constantly need each other's data synchronously (a distributed monolith in disguise)

## Related Patterns

- [Modular Monolith](./modular-monolith.md) is the honest first step; microservices extract modules that already proved their boundaries.
- [Domain Event](../04-enterprise-patterns/domain-event.md) becomes cross-service integration events.
- [Saga](../04-enterprise-patterns/saga.md) replaces cross-service transactions.
- [Outbox](../04-enterprise-patterns/outbox.md) makes state-change publishing reliable between services.

## Review Checklist

- [ ] Does each service own its data exclusively?
- [ ] Is there an answer for every cross-service consistency need?
- [ ] Can each service be deployed alone on a normal Tuesday?
- [ ] Would stronger module boundaries inside one deployable solve today's actual pain?
