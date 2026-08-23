# CQRS

## One-Line Definition

CQRS separates the model that handles commands (writes) from the model that serves queries (reads), letting each side adopt the shape, storage, and scaling it actually needs.

## Problem

One model serves both writing business invariants and answering read queries. Writes need validation, aggregates, and transactions; reads need flat joins, search shapes, and denormalized views. Forcing both through one object graph produces awkward repositories, N+1 queries, and domain models polluted with read projections.

## Context

The friction appears when read and write workloads diverge: dashboards querying across thousands of records while writes flow through strict aggregate rules. CQRS is a modeling decision first; separate databases are an optional later step.

## When to Use

- Read shapes differ so much from write aggregates that one model compromises both.
- Reads and writes scale independently (heavy reporting vs transactional writes).
- The team can maintain explicit command handlers and query services.

## When Not to Use

- Simple CRUD where the read shape equals the stored shape.
- Small teams without capacity for two mental models.
- You only want caching or read replicas — those solve scaling without splitting the model.

## Typical Shape

```txt
Command side:  Command → Handler → Aggregate → Persistence
Query side:    Query   → Reader/Projection → Read store/view
                          ▲
        events from write side keep projections current
```

Start with one database and two code paths. Extract a separate read store only when measured load demands it.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Each side gets its optimal shape and scaling | Two models to keep consistent |
| Read paths simplify into direct projections | Eventual consistency leaks into UX decisions |
| Write logic stays small and invariant-focused | Infrastructure grows if stores split |

## Good Fit

- Systems where reporting/read pressure distorts the domain model
- Teams already comfortable with domain events
- Products needing independent read/write scaling

## Bad Fit

- Basic admin CRUD
- Teams without appetite for projection maintenance
- Apps whose reads are trivially served by the same aggregates

## Related Patterns

- [Event Sourcing](./event-sourcing.md) is the natural write-side companion; CQRS works fine without it.
- [Domain Event](../04-enterprise-patterns/domain-event.md) carries changes from write side to projections.
- [Repository](../04-enterprise-patterns/repository.md) typically remains on the command side only.

## Review Checklist

- [ ] Do read and write shapes genuinely diverge today?
- [ ] Is there a plan for keeping projections current?
- [ ] Can users tolerate read-side lag where it occurs?
- [ ] Would two code paths over one database deliver most of the benefit first?
