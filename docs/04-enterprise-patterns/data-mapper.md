---
title: Data Mapper
category: enterprise
level: intermediate
project_layers:
  - infrastructure
related_patterns:
  - Repository
  - Unit of Work
  - DTO
---

# Data Mapper

## One-Line Definition

Data Mapper moves data between objects and database rows while keeping both completely ignorant of each other — domain objects hold no persistence code, and the mapper knows no business rules.

## Problem

Active-record-style objects carry `save()`, `delete()`, and SQL fragments inside the domain. Business classes now require a live database to construct or test, schema changes ripple into behavior, and the same entity cannot exist in two storage shapes.

## Context

This is the persistence-side separation that makes hexagonal and clean architectures real: the domain speaks its own language; mappers translate at the edge.

## When to Use

- Domain logic is rich enough to deserve framework-free, DB-free objects.
- Multiple representations of one concept exist (ORM row, cache shape, search doc).
- The team wants domain tests without any database.

## When Not to Use

- Simple CRUD where active record or plain query results are honest enough.
- Tiny teams where mapping layers are ceremony with no payoff.
- Reporting-heavy code where rows *are* the model.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | None. |
| Application | Receives clean domain objects from repositories. |
| Domain | Pure — zero mapper imports. |
| Infrastructure | Mapper implementations doing all translation and SQL. |
| Testing | In-memory mappers behind repository interfaces. |

## Real-World Examples

- Doctrine entities (pure PHP) hydrated by EntityManagers; Hibernate's session mapping Java POJOs.
- A legacy-table mapper translating an awkward 40-column table into one clean `Customer`.
- An Elasticsearch document mapper feeding the same domain type the SQL mapper feeds.

## Code Smell Before the Pattern

The smell is persistence leaking into domain types:

```php
final class Customer
{
    public function deactivate(): void
    {
        $this->active = false;
        $this->db->exec('UPDATE customers SET active = 0 WHERE id = ?', [$this->id]);
    }
}
```

`Customer` now needs credentials, a connection, and SQL knowledge to unit-test.

## Minimal Example

```php
// pure domain
final class Customer
{
    public function __construct(
        public readonly CustomerId $id,
        private bool $active = true,
    ) {}

    public function deactivate(): void { $this->active = false; }
    public function isActive(): bool   { return $this->active; }
}

// infrastructure side
final class CustomerMapper
{
    public function toDomain(array $row): Customer
    {
        return new Customer(new CustomerId($row['id']), (bool) $row['active']);
    }

    /** @return array<string, mixed> */
    public function toRow(Customer $c): array
    {
        return ['id' => (string) $c->id, 'active' => $c->isActive() ? 1 : 0];
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Domain tests run with zero database | Mapping code must be written/maintained |
| Schema evolution touches only mappers | Two representations can drift if unmapped fields sneak in |
| Same domain type over many storages | Indirection visible when debugging persistence bugs |

## Related Patterns

- [Repository](./repository.md) exposes collection-like access; mappers often implement its internals.
- [Unit of Work](./unit-of-work.md) batches mapper writes into one transaction.
- Active Record (anti-pattern here only by contrast) merges what this pattern deliberately separates.

## Common Mistakes

- Letting ORM attributes/annotations creep into "pure" domain classes until coupling returns.
- Writing mappers without round-trip tests (`toRow(toDomain(row)) == row`).
- Exposing unmapped raw arrays past the infrastructure boundary.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
