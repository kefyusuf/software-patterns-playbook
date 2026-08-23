# Clean Architecture

## One-Line Definition

Clean Architecture arranges code in concentric layers where dependencies point inward only: entities and use cases at the center, frameworks and delivery mechanisms at the edge.

## Problem

Business rules end up welded to a framework version, an ORM, or an HTTP layer. Upgrading the web stack or swapping persistence means rewriting logic that should never have cared, and testing any rule requires booting the whole framework.

## Context

This architecture is strongest when business rules are long-lived while surrounding technology is not — systems expected to outlive several framework generations, or products whose rules must be provable by fast tests without infrastructure.

## When to Use

- Business rules are complex enough to justify isolation from delivery and storage details.
- The system must survive framework migrations without rewriting core behavior.
- Fast, dependency-free unit testing of use cases is a priority.

## When Not to Use

- The application is mostly CRUD over a database; layers would only rename files.
- The team cannot yet agree what counts as an entity versus a use case.
- Delivery speed matters more than longevity, and boundaries have no pressure yet.

## Typical Shape

```txt
Entities (enterprise-wide rules)
Use Cases (application-specific rules)
Interface Adapters (controllers, presenters, gateways)
Frameworks & Drivers (web, db, ui, external)
   ── dependencies point strictly inward ──▶
```

The crossing rule matters more than the folder names: inner circles import nothing from outer circles. Outer layers translate data into shapes inner layers own.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Business rules testable with zero framework | Significant mapping between layers |
| Framework swaps become adapter work | Initial structure slows trivial features |
| Screaming architecture: intent visible from folders | Discipline erodes without review gates |

## Good Fit

- Long-lived systems with real business rules
- Teams burned by framework rewrites
- Domains where correctness provable by cheap tests pays off

## Bad Fit

- Thin CRUD backends
- Prototypes still hunting their boundaries
- Teams unwilling to enforce dependency direction in review

## Related Patterns

- [Hexagonal Architecture](./hexagonal-architecture.md) shares the inward-dependency idea; Clean Architecture adds explicit use-case and entity rings.
- [Layered Architecture](./layered-architecture.md) is the looser ancestor whose dependency rule Clean Architecture hardens.
- [Repository](../04-enterprise-patterns/repository.md) as the classic gateway shape at the persistence boundary.

## Review Checklist

- [ ] Do all source dependencies point inward?
- [ ] Can every use case run in a test without a framework or database?
- [ ] Are entities free of framework imports?
- [ ] Would a simpler layered structure solve the current problem more cheaply?
