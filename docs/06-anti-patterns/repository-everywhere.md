---
title: Repository Everywhere
category: enterprise
related_patterns:
  - Adapter
  - Factory
---

# Repository Everywhere

## Definition

Repository Everywhere is the reflex to wrap every persistence call in a repository even when the repository only forwards ORM or query builder methods without adding meaningful domain value.

## Symptoms

- Repositories contain thin pass-through methods such as `findById` and `save` with no domain language.
- Service classes depend on repositories for trivial CRUD without gaining clearer intent.
- New query methods are added mechanically for every screen or endpoint.

## Why It Happens

Teams learn Repository as a common recommendation and apply it universally, often without checking whether the domain actually benefits from the extra boundary.

## Why It Is Harmful

It creates indirection without stronger modeling. Query logic spreads across generic wrappers and the codebase pays the cost of another layer with little gain in language, testing, or change safety.

## Before Example

A `UserRepository` contains only thin `create`, `update`, `delete`, and `find` wrappers around the ORM while application services still contain all real business decisions.

## Better Alternatives

- Use direct ORM access when the use case is simple and local.
- Introduce repositories only where domain language, aggregate boundaries, or query isolation clearly matter.
- Keep query objects or focused data access helpers when they express intent more directly.

## Refactoring Path

1. Identify repositories that only mirror the persistence tool.
2. Inline trivial pass-through methods back into clearer application code or focused query helpers.
3. Keep repositories only where they protect meaningful domain boundaries.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?

## Related Reading

- [Repository](../04-enterprise-patterns/repository.md)
- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
- [Choose by Project Layer](../01-decision-guides/choose-by-project-layer.md)
