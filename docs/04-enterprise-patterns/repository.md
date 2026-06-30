---
title: Repository
category: enterprise
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - DTO
  - Factory
  - Specification
---

# Repository

## One-Line Definition

Repository provides a collection-like interface for retrieving and persisting domain-relevant objects when the business model benefits from a stable access boundary.

## Problem

Application code starts mixing domain behavior with persistence details, or important aggregate retrieval rules are repeated across several use cases.

## Context

Repository is most useful when a domain concept has meaningful retrieval and persistence behavior that should not be scattered across handlers or controllers. It is less useful when the code only performs simple local CRUD with no strong domain language.

## When to Use

- Aggregate retrieval rules matter to the business model.
- Several use cases need the same domain-focused access patterns.
- You want application code to depend on business-relevant access methods rather than storage mechanics.

## When Not to Use

- The repository would only mirror basic ORM methods with no added domain meaning.
- The use case is simple and direct persistence code is clearer.
- The abstraction exists only because repositories are assumed to be standard everywhere.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; presentation should not usually depend on repositories directly. |
| Application | Consumes repository interfaces during use-case orchestration. |
| Domain | May define the repository contract when it is part of the domain language. |
| Infrastructure | Implements the repository against ORM, SQL, or other storage tools. |
| Testing | Replace storage-backed implementations with focused test doubles when useful. |

## Real-World Examples

- `OrderRepository` loads an order aggregate with the invariants needed for checkout completion.
- `SubscriptionRepository` retrieves active subscriptions with business-relevant filtering rules.
- `ApprovalRequestRepository` exposes domain-focused access for pending approval decisions.

## Code Smell Before the Pattern

The smell is repeated persistence logic spread through application handlers:

```php
$order = OrderModel::query()
    ->with('lines')
    ->where('status', 'pending')
    ->findOrFail($orderId);
```

When this same retrieval shape appears in several use cases, application code starts depending on storage details instead of business intent.

## Minimal Example

```php
interface OrderRepository
{
    public function findPendingById(string $orderId): Order;
    public function save(Order $order): void;
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes domain-focused access explicit | Adds another abstraction layer to maintain |
| Keeps storage details out of orchestration code | Can become pass-through noise if used without domain value |
| Helps protect aggregate boundaries | Requires discipline to avoid generic CRUD inflation |

## Related Patterns

- DTO when repository results should be transformed for read-oriented or transport-oriented consumers.
- Factory when aggregate creation is separate from retrieval concerns.
- Specification when query rules grow complex enough to deserve their own reusable expression.

## Common Mistakes

- Wrapping every ORM call in a repository with no stronger domain language.
- Letting repositories become giant query dumping grounds for unrelated screens.
- Treating Repository as mandatory architecture instead of a conditional design choice.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?

## Related Reading

- [Specification](./specification.md)
- [Repository Everywhere](../06-anti-patterns/repository-everywhere.md)
- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
