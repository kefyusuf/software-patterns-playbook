---
title: Lazy Load
category: enterprise
level: intermediate
project_layers:
  - infrastructure
  - application
related_patterns:
  - Proxy
  - Repository
  - Data Mapper
---

# Lazy Load

## One-Line Definition

Lazy Load defers fetching an object's data until first access, so a use case touching three fields does not pay to load forty.

## Problem

Loading an aggregate eagerly drags its whole object graph — orders with customers with addresses with histories. Most flows need a sliver; the rest is wasted queries, memory, and latency. The inverse error (manual partial loading everywhere) scatters "load only what's needed" logic through every call site.

## Context

Standard in ORMs (Doctrine/Hibernate proxies, EF navigation lazy loading). Also applies hand-rolled to expensive collaborators: document bodies, image blobs, remote configs.

## When to Use

- Graphs are wide/deep but most flows touch small subsets.
- Related data is rarely accessed relative to the parent.
- Loading cost is high: blobs, remote calls, heavy joins.

## When Not to Use

- Nearly every access needs the related data — eager is simpler and faster.
- Request lifecycles close before lazy triggers fire (session closed → crash).
- Latency predictability matters more than averages; N+1 surprises are costly.
- The domain layer should never see laziness mechanics — keep it behind infrastructure.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Unaware; occasionally triggers accidental loads. |
| Application | Choosing eager vs lazy per query via repository flags. |
| Domain | None — must not know persistence timing. |
| Infrastructure | Proxies, placeholder placeholders, deferred SQL. |
| Testing | Asserting query counts for representative flows. |

## Real-World Examples

- An order list shows customer names without loading full customer profiles.
- A CMS loads article metadata instantly; body text loads on detail view.
- A user record defers loading preferences JSON until settings pages request it.

## Code Smell Before the Pattern

The smell is either everything-eager or manual starvation:

```php
$order = $this->orders->findWithCustomerAndLinesAndHistory($id);
// 6 joins executed; screen shows $order->status() alone
```

or worse, every caller assembling its own minimal loader.

## Minimal Example

```php
final class OrderProxy extends Order // same interface, defers the load
{
    private ?Order $real = null;

    public function __construct(
        private readonly \Closure $loader,
        // cheap fields copied up-front:
        string $id, string $status,
    ) { parent::__construct($id, $status); }

    private function real(): Order
    {
        return $this->real ??= ($this->loader)();
    }

    public function lines(): array
    {
        return $this->real()->lines(); // loads once, on demand
    }
}

// repository hands out proxies for list screens:
return new OrderProxy(fn() => $this->mapper->fullLoad($id), $row['id'], $row['status']);
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Common paths skip unneeded data entirely | N+1 query storms when loops trigger loads |
| Wide graphs stay usable in list views | Performance becomes less predictable per call |
| Works transparently behind same interfaces | Session/lifetime bugs appear at first touch |

## Related Patterns

- [Proxy](../02-gof-patterns/structural/proxy.md) is the canonical wrapper shape; virtual proxy *is* lazy load.
- [Repository](./repository.md) decides and documents eager-vs-lazy per query.
- [Data Mapper](./data-mapper.md) builds the placeholders that defer row hydration.

## Common Mistakes

- Iterating a list of lazy entities inside a view — one query per row.
- Serializing lazy proxies and shipping half-loaded objects to caches/clients.
- Letting domain services depend on load timing, making behavior environment-dependent.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
