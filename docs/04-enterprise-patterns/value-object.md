---
title: Value Object
category: enterprise
level: beginner-to-intermediate
project_layers:
  - domain
related_patterns:
  - DTO
  - Flyweight
  - Specification
---

# Value Object

## One-Line Definition

A Value Object is an immutable type defined entirely by its attribute values — two instances with equal values are interchangeable, and every modification returns a new instance.

## Problem

Money, email addresses, date ranges, and coordinates live as primitive strings and ints. Every call site re-validates them, invalid states spread ("amount: -5"), comparison logic is rewritten per feature, and nothing stops `currency = 'USD'` being added to `currency = 'TRY'`.

## Context

Core to rich domains (DDD's building block) but valuable anywhere a concept has validation rules and operations that keep being duplicated across a codebase.

## When to Use

- A concept measures, quantifies, or describes — and equality by value is the meaningful test.
- Validation rules repeat at multiple entry points today.
- Operations on the concept are scattered (adding money, overlapping ranges).

## When Not to Use

- Identity matters more than value; that is an entity (`User` by ID, not by name).
- One-off fields with no rules or operations — a typed property suffices.
- High-frequency hot paths where allocation churn is profiled as a real cost (see [Flyweight](../02-gof-patterns/structural/flyweight.md)).

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Parsing/formatting for display via the object itself. |
| Application | Command payloads validated once on construction. |
| Domain | Primary home: Money, EmailAddress, DateRange, Quantity. |
| Infrastructure | Mappers translate VOs to/from columns. |
| Testing | Table-driven tests over construction and operations. |

## Real-World Examples

- `Money` refusing addition across currencies; rounding policy encoded once.
- `EmailAddress` guaranteeing shape from constructor onward — no downstream checks.
- `DateRange` owning overlap and duration logic used by bookings and reports alike.

## Code Smell Before the Pattern

The smell is repeated primitive validation:

```php
function transfer(int $amount, string $from, string $to): void
{
    if ($amount <= 0) { throw new InvalidArgumentException(); }
    // caller #2 forgets this check; amount -50 now flows in
}
```

## Minimal Example

```php
final readonly class Money
{
    public function __construct(
        public int $minorUnits,
        public Currency $currency,
    ) {
        if ($this->minorUnits < 0) {
            throw new InvalidArgumentException('Money cannot be negative');
        }
    }

    public function add(self $other): self
    {
        if (!$other->currency->equals($this->currency)) {
            throw new CurrencyMismatch();
        }
        return new self($this->minorUnits + $other->minorUnits, $this->currency);
    }

    public function equals(self $other): bool
    {
        return $this->minorUnits === $other->minorUnits
            && $this->currency->equals($other->currency);
    }
}

$total = new Money(5000, Currency::try_())->add(new Money(2500, Currency::try_()));
```

Invalid money is unrepresentable; every operation returns fresh immutable values.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Invalid states become unrepresentable | More types and mapping boilerplate |
| Behavior lives beside data, written once | Immutability discipline required everywhere |
| Equality/comparison consistent codebase-wide | Teams must resist "just a string" shortcuts |

## Related Patterns

- [DTO](./dto.md) carries data without behavior or guarantees; a VO enforces both.
- [Flyweight](../02-gof-patterns/structural/flyweight.md) shares identical immutable VOs at extreme scale.
- [Specification](./specification.md) composes whole-criteria objects, often built from VOs.

## Common Mistakes

- Adding setters or public mutable fields, destroying the invariant guarantee.
- Treating entities as value objects (comparing users field-by-field).
- Burying construction-time validation elsewhere "for performance".

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
