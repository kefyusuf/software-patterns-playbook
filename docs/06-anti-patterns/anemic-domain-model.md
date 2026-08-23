---
title: Anemic Domain Model
category: architecture
related_patterns:
  - Value Object
  - Service Layer
  - Specification
---

# Anemic Domain Model

## Definition

Anemic Domain Model is a domain where "entities" are bags of public fields and getters/setters while all real business rules live in separate service classes — objects exist, but none of them own their invariants.

## Symptoms

- Every entity class is only properties plus getters and setters.
- The same rule ("order cannot ship unpaid") is enforced in three different services, slightly differently.
- Constructing a valid object requires knowing which service to call afterwards.
- Tests must set up services to make simple object operations meaningful.

## Why It Happens

ORM tooling generates property-only classes by default. Teams also fear putting logic in entities because "services are where logic goes" — a misreading of layered architecture. Frameworks that map rows directly onto models push this shape from day one.

## Why It Is Harmful

Invariants have no home: any code anywhere can construct an invalid state. Rule duplication grows with every new caller. Behavior and data split means reading one class never explains the rules it obeys, and the domain stops documenting the business.

## Before Example

```php
final class Order // anemia: data here...
{
    public function __construct(
        public string $status,
        public bool $paid,
    ) {}
}

final class OrderService // ...rules elsewhere
{
    public function ship(Order $order): void
    {
        if (!$order->paid) {                       // invariant lives out here
            throw new LogicException('Cannot ship');
        }
        $order->status = 'shipped';                // ...and anyone can bypass it
    }
}

$order = new Order(status: 'processing', paid: false);
$order->status = 'shipped';                        // nothing stops this
```

## Better Alternatives

- Move the rule into the aggregate: `ship()` checks `paid` itself; constructor/`place()` establish validity.
- Use [Value Objects](../04-enterprise-patterns/value-object.md) so invalid primitives (negative money) cannot exist.
- Express reusable criteria with [Specification](../04-enterprise-patterns/specification.md) instead of scattered `if` blocks.
- Keep [Service Layer](../04-enterprise-patterns/service-layer.md) for orchestration (transactions, authorization), not for core invariants.

## Refactoring Path

1. Pick the most-violated invariant; add a method on the owning entity enforcing it; migrate callers.
2. Make fields private; delete setters that no longer have callers.
3. Extract repeated primitive validation into value objects.
4. Target shape: services coordinate; entities decide.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?
