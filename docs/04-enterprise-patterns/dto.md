---
title: DTO
category: enterprise
level: beginner-to-intermediate
project_layers:
  - presentation
  - application
  - infrastructure
related_patterns:
  - Repository
  - Facade
  - Adapter
---

# DTO

## One-Line Definition

DTO, short for Data Transfer Object, packages data into a stable shape for transport between boundaries when passing raw arrays or rich domain objects would create coupling or ambiguity.

## Problem

Data crosses a boundary such as HTTP, queue transport, service orchestration, or integration mapping, and the current shape is too loose, too implicit, or too coupled to internal models.

## Context

DTO is most useful where structure, validation expectations, or boundary clarity matter. It is less useful when the data stays local and a small explicit structure would already be clear enough.

## When to Use

- Data crosses a boundary and needs a stable explicit shape.
- Raw arrays or hashes are becoming hard to reason about.
- You want to separate transport shape from domain model shape.

## When Not to Use

- The data stays inside one small local function or module.
- The DTO would just wrap two fields with no real clarity gain.
- The team starts creating DTOs for every value by default.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Request and response payloads, form data, and API resources. |
| Application | Input models for use cases and output models for orchestration boundaries. |
| Domain | Rare; rich domain objects usually express behavior, not just transfer shape. |
| Infrastructure | Mapping external payloads to stable internal boundary objects. |
| Testing | Helpful when tests need readable boundary data setup. |

## Real-World Examples

- `CheckoutCommand` carries request data into a checkout handler.
- `PaymentResultDto` normalizes gateway outcomes for application code.
- `ProductFeedItemDto` carries mapped data from an external API adapter.

## Code Smell Before the Pattern

The smell is a boundary that passes loose arrays with unclear expectations:

```php
$service->sync([
    'sku' => $payload['sku'],
    'price' => $payload['price'],
    'stock' => $payload['qty'],
]);
```

The caller and callee now rely on implicit field names and conventions instead of an explicit boundary contract.

## Minimal Example

```php
final class ProductFeedItemDto
{
    public function __construct(
        public string $sku,
        public int $price,
        public int $stock
    ) {}
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes boundary data explicit and readable | Adds more types to maintain |
| Decouples transport shape from internal models | Can become excessive if created for trivial local values |
| Helps mapping and testing at boundaries | May be confused with full domain modeling if overused |

## Related Patterns

- Repository when DTOs serve read-oriented results or boundary-safe access to stored data.
- Facade when one higher-level API returns stable transfer shapes over several collaborators.
- Adapter when external payloads must be translated into internal DTOs.

## Common Mistakes

- Creating DTOs for every tiny local value with no boundary benefit.
- Letting DTOs accumulate business behavior that belongs elsewhere.
- Passing raw persistence or vendor models around even after introducing DTOs.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
