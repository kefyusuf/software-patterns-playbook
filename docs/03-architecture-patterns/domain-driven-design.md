# Domain-Driven Design (Aggregates and Bounded Contexts)

## One-Line Definition

Domain-Driven Design models software around the business language it serves: bounded contexts keep one ubiquitous language per subdomain, and aggregates guard transactional consistency inside them.

## Problem

A single shared model for a whole company collapses: "Order" means something different to sales, warehouse, and billing. Rules scatter across services because no object owns an invariant end-to-end, so every writer re-implements the same guards slightly differently.

## Context

This approach matters when domain complexity — not technical complexity — dominates. It is a modeling discipline first; tactical patterns (aggregates, entities, value objects) only pay off inside a well-chosen context boundary.

## When to Use

- Different departments use conflicting definitions of core nouns.
- Complex invariants must hold across many related objects at once.
- Domain experts are available to refine language continuously with developers.

## When Not to Use

- The system is mostly data in, data out with thin rules.
- No domain expert access exists to validate the language.
- A small team on a CRUD product would drown in strategic ceremony.

## Typical Shape

```txt
Bounded Context "Fulfillment"
  Aggregate root: Shipment
    ├─ invariant: cannot ship unpaid orders
    └─ children: Parcels (reachable only via Shipment)
Bounded Context "Billing"
  Aggregate root: Invoice   ("Order" here is just an id reference)
```

Aggregates are consistency boundaries: one transaction modifies one aggregate; other aggregates react via [Domain Events](../04-enterprise-patterns/domain-event.md), never by direct mutation.

## Trade-Offs

| Benefit | Cost |
|---|---|
| One unambiguous language per context | Strategic modeling demands expert time |
| Invariants enforced exactly where they live | Aggregate boundaries need constant care |
| Contexts evolve independently | Wrong boundaries cost more than no boundaries |

## Good Fit

- Multi-team products with rich, contested business rules
- Domains where experts and engineers can talk weekly
- Systems outgrowing a single shared data model

## Bad Fit

- Thin CRUD applications
- Teams without domain-expert access
- Codebases where "context" would just rename modules without changing language ownership

## Related Patterns

- [Repository](../04-enterprise-patterns/repository.md) gives each aggregate a collection-like access point.
- [Value Object](../04-enterprise-patterns/value-object.md) expresses immutable domain concepts inside aggregates.
- [Specification](../04-enterprise-patterns/specification.md) names composable business criteria.
- [Microservices](./microservices.md) often deploy one bounded context per service.

## Review Checklist

- [ ] Does each context own exactly one meaning per core noun?
- [ ] Can every aggregate state its invariants in one sentence?
- [ ] Do transactions stay within one aggregate boundary?
- [ ] Is the ubiquitous language written down and used in code names?
