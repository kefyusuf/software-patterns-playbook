# Modular Monolith

## One-Line Definition

Modular Monolith keeps one deployable application while enforcing stronger boundaries between internal business modules.

## Problem

The codebase grows beyond what a plain layered application can manage, but splitting into separate services would add deployment and operational complexity too early.

## Context

This architecture is a strong fit when the business has distinct areas such as billing, checkout, identity, catalog, or notifications, and the team wants clear ownership without distributed-system cost.

## When to Use

- The system has multiple business capabilities with meaningful boundaries.
- Teams want module ownership and reduced cross-module entanglement.
- One deployment unit is still operationally simpler than several services.

## When Not to Use

- The application is small and module boundaries would be mostly aspirational.
- Teams are not willing to enforce internal boundaries and explicit module APIs.
- The real problem is only code organization inside one small feature set.

## Typical Shape

```txt
Modules/
  Billing/
  Checkout/
  Identity/
  Notifications/
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Preserves monolith simplicity while improving boundaries | Requires discipline to keep modules from becoming directory labels only |
| Supports clearer ownership and change isolation | Shared data and cross-module calls need explicit design |
| Delays distributed-system overhead | Can still degrade into a big ball of mud if boundaries are weak |

## Good Fit

- Mid-size business systems with several capabilities
- Teams preparing for scale in complexity before scale in deployment
- Products that need stronger module APIs but not service infrastructure

## Bad Fit

- Very small apps
- Teams that expect deployment independence as the main goal right now
- Systems where module boundaries are still unclear

## Related Patterns

- [Domain Event](../04-enterprise-patterns/domain-event.md) for decoupled cross-module reactions.
- [Facade](../02-gof-patterns/structural/facade.md) for stable module entry points.
- [Repository](../04-enterprise-patterns/repository.md) when module persistence rules need explicit boundaries.

## Review Checklist

- [ ] Are modules aligned to business capabilities rather than technical categories?
- [ ] Does each module expose a clear API or entry boundary?
- [ ] Are cross-module dependencies explicit and limited?
- [ ] Would the same goal be achieved with a simpler layered structure?
