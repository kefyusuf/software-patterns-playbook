# Event Sourcing

## One-Line Definition

Event Sourcing persists every state change as an immutable, append-only event instead of overwriting rows; current state is rebuilt by replaying the event stream.

## Problem

Standard persistence stores only the *result* of decisions — a balance, a status field — and throws away the decisions themselves. When business asks "why is this order cancelled?", or an audit requires exact history, the answer no longer exists in the data.

## Context

Strongest where history is part of the domain value: ledgers, ordering systems, compliance-heavy workflows. It pairs naturally with CQRS because replay-derived aggregates are expensive to query directly.

## When to Use

- The sequence and reason of changes carry business meaning (audit, dispute resolution).
- Temporal queries matter: state at any past moment.
- Multiple projections can be built from one event stream.

## When Not to Use

- Stakeholders only need current-state CRUD.
- The team has no experience operating event stores and versioning events.
- Events would be few and trivial; plain tables plus an audit log are cheaper.
- Large old streams need rebuilding often without snapshots in place.

## Typical Shape

```txt
Command → Aggregate → new Event(s) → append to stream (transaction)
Read side:  events → projections/views
Replay:     stream → aggregate rehydration (with periodic snapshot)
```

Events are facts in past tense (`OrderShipped`), immutable once written. Changing event *schema* means upcasting old versions, not editing history.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Complete, tamper-evident history for free | Steep learning curve for teams |
| Natural audit trail and temporal queries | Querying needs projections; eventual consistency appears |
| Debugging via replay of real production sequences | Event schema evolution must be managed forever |

## Good Fit

- Financial, ordering, and booking domains where history is contractual
- Systems already committed to CQRS
- Teams able to own event-store tooling and versioning discipline

## Bad Fit

- Simple reference-data CRUD
- Products needing instant strong consistency on reads everywhere
- Teams without capacity to operate projections and upcasting

## Related Patterns

- [CQRS](./cqrs.md) supplies the read side that makes sourced events usable.
- [Domain Event](../04-enterprise-patterns/domain-event.md) is the unit being stored — here it becomes the persistence record itself, not just a notification.
- [Memento](../02-gof-patterns/behavioral/memento.md)-style snapshots keep long-stream replays fast.

## Review Checklist

- [ ] Does history itself carry business value here?
- [ ] Is there a projection strategy for every query need?
- [ ] Are event versioning and upcasting owned by someone?
- [ ] Would an append-only audit table satisfy the actual requirement more cheaply?
