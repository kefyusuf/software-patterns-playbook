# Hexagonal Architecture

## One-Line Definition

Hexagonal Architecture centers the application around domain and use-case logic, with adapters at the edges for UI, persistence, messaging, and external systems.

## Problem

Core business logic keeps depending directly on frameworks, databases, and vendor SDKs, making it difficult to test or evolve independently.

## Context

This architecture is strongest when the application must survive framework changes, multiple delivery mechanisms, or heavy integration pressure, and the team is willing to invest in explicit ports and adapters.

## When to Use

- Business logic needs strong protection from infrastructure churn.
- The same core use cases may be driven by multiple interfaces such as HTTP, jobs, or CLI.
- External system boundaries are important and likely to change.

## When Not to Use

- The system is small and simple enough that ports and adapters would mostly add ceremony.
- The team has not identified real boundary pressure yet.
- Most business logic is thin and infrastructure-heavy anyway.

## Typical Shape

```txt
Domain/
Application/
Ports/
Adapters/
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Strongly protects core logic from external coupling | Adds more explicit interfaces and structural ceremony |
| Makes testing of use cases and adapters clearer | Can be overbuilt for small or shallow systems |
| Supports multiple delivery or integration mechanisms cleanly | Requires careful naming and ownership discipline |

## Good Fit

- Integration-heavy systems
- Long-lived business cores with multiple external touchpoints
- Teams that need boundary clarity more than raw implementation speed

## Bad Fit

- Thin applications with little domain logic
- Very early products still searching for stable boundaries
- Teams that will not maintain clear port ownership

## Related Patterns

- [Adapter](../02-gof-patterns/structural/adapter.md) as a core edge pattern in the architecture.
- [DTO](../04-enterprise-patterns/dto.md) for stable boundary contracts.
- [Repository](../04-enterprise-patterns/repository.md) when persistence must be abstracted behind domain-relevant access points.

## Review Checklist

- [ ] Is there enough boundary pressure to justify explicit ports and adapters?
- [ ] Does the architecture protect meaningful business logic, not just trivial code?
- [ ] Are adapter responsibilities clear and narrow?
- [ ] Would a simpler layered or modular structure solve the current problem more cheaply?
