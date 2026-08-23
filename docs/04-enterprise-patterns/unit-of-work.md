---
title: Unit of Work
category: enterprise
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - Repository
  - Data Mapper
  - Identity Map
---

# Unit of Work

## One-Line Definition

Unit of Work tracks every object a business transaction touches and commits all inserts, updates, and deletes as one coordinated write when the transaction completes.

## Problem

A use case modifies several objects — an order, its lines, a customer's loyalty points. Saving each through its own repository call produces multiple transactions: a mid-flow crash leaves half the changes applied, and ordering of writes becomes accidental.

## Context

This pattern sits between application services and persistence. ORMs ship it (Doctrine's `EntityManager`, Hibernate's session, EF's `DbContext`); hand-rolled versions appear where teams avoid full ORMs but still need atomic multi-aggregate writes.

## When to Use

- One business transaction spans changes to multiple objects.
- Write ordering matters (parent before child rows).
- You need one commit point per use case for testability and clarity.

## When Not to Use

- Single-object single-table writes; explicit save calls are clearer.
- Very long operations spanning user think-time; keep transactions short instead.
- The ORM already tracks everything and nobody bypasses it — you already have one.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | None. |
| Application | Opening/committing one unit per command handler. |
| Domain | Unaware — aggregates just mutate. |
| Infrastructure | Change tracking, flush order, transaction scope. |
| Testing | In-memory units asserting exactly which changes flushed. |

## Real-World Examples

- A money transfer debits one account and credits another in one commit.
- A checkout saves the order, decrements stock, and appends an audit row atomically.
- An import job batches thousands of tracked changes into periodic single flushes.

## Code Smell Before the Pattern

The smell is piecemeal saving with crossed fingers:

```php
$this->orders->save($order);
$this->inventory->save($stock);      // crash here = order saved, stock stale
$this->audit->record($event);        // ...and no audit trail
```

Three transactions where business semantics demanded one.

## Minimal Example

```php
final class UnitOfWork
{
    private array $new = [], $dirty = [], $deleted = [];

    public function registerNew(object $e): void   { $this->new[] = $e; }
    public function registerDirty(object $e): void { $this->dirty[] = $e; }
    public function registerDeleted(object $e): void { $this->deleted[] = $e; }

    public function commit(): void
    {
        $this->db->transaction(function () {
            foreach ($this->new as $e)     { $this->mapper->insert($e); }
            foreach ($this->dirty as $e)   { $this->mapper->update($e); }
            foreach ($this->deleted as $e) { $this->mapper->delete($e); }
        });
    }
}

$uow->registerNew($order);
$uow->registerDirty($stock);
$uow->registerNew($auditRow);
$uow->commit(); // all or nothing
```

ORM users get this via `flush()` inside a transaction boundary owned by the use case.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Multi-object atomicity matches business transactions | Tracking overhead and memory per unit |
| One obvious commit point simplifies tests | Long-lived units accumulate surprise writes |
| Coordinated write ordering prevents FK breakage | Mixing units across use cases corrupts intent |

## Related Patterns

- [Repository](./repository.md) feeds registered objects into the unit; they pair constantly.
- [Data Mapper](./data-mapper.md) does the actual object↔row translation at commit.
- Identity Map (same catalog) prevents duplicate loads inside one unit.

## Common Mistakes

- Keeping a unit open across HTTP requests or queue hops.
- Bypassing tracking with raw queries that then conflict on flush.
- Registering read-only fetched objects as dirty "just in case", bloating every commit.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
