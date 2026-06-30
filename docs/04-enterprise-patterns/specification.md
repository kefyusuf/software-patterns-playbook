---
title: Specification
category: enterprise
level: intermediate
project_layers:
  - domain
  - application
  - infrastructure
related_patterns:
  - Repository
  - State
  - Strategy
---

# Specification

## One-Line Definition

Specification expresses reusable business criteria as explicit objects or rules so filtering, validation, or eligibility logic can be composed without scattering condition checks everywhere.

## Problem

Business rules such as eligibility, approval, filtering, or policy checks are repeated across queries, handlers, or services, and the same logic keeps reappearing in slightly different forms.

## Context

Specification is most helpful when a rule has business meaning, needs reuse, or benefits from composition. It is much less helpful when the rule is a one-off filter that reads clearly inline.

## When to Use

- The same business criteria appears in more than one place.
- Rules need to be combined with `and`, `or`, or `not` semantics.
- You want rule intent to be named explicitly instead of hidden in query fragments.

## When Not to Use

- The condition is simple, local, and unlikely to repeat.
- The abstraction would only wrap a single obvious boolean check.
- The team is building a specification hierarchy before any real rule reuse exists.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; presentation should usually consume evaluated results, not define business specifications. |
| Application | Orchestrates which specification to use for one use case. |
| Domain | Strong fit when the rule is part of domain language and business meaning. |
| Infrastructure | May translate a specification into query or persistence-specific filtering. |
| Testing | Useful for focused rule tests and composition coverage. |

## Real-World Examples

- `RefundableOrderSpecification` expresses whether an order can still be refunded.
- `ActiveSubscriptionSpecification` defines which subscriptions count as active for billing.
- `HighRiskTenantSpecification` marks tenants that require additional review or restrictions.

## Code Smell Before the Pattern

The smell is rule duplication across several services or queries:

```php
if ($order->isPaid() && ! $order->isRefunded() && $order->placedAt()->isAfter($cutoff)) {
    // allow refund
}
```

If this logic appears in controllers, handlers, and queries, business intent becomes duplicated and easy to drift.

## Minimal Example

```php
interface Specification
{
    public function isSatisfiedBy(mixed $candidate): bool;
}

final class RefundableOrderSpecification implements Specification
{
    public function isSatisfiedBy(mixed $candidate): bool
    {
        return $candidate->isPaid()
            && ! $candidate->isRefunded()
            && $candidate->placedAt()->isAfter($candidate->refundCutoff());
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Gives business rules explicit names and reuse points | Adds more types and rule composition infrastructure |
| Supports composition of related criteria | Can become abstract noise for simple local conditions |
| Helps keep rule drift under control | Requires clear ownership between domain rules and query translation |

## Related Patterns

- Repository when specifications influence domain-focused retrieval rules.
- State when rule validity depends strongly on an object's current lifecycle stage.
- Strategy when the variation is a chosen policy rather than an evaluated rule.

## Common Mistakes

- Turning every trivial filter into a specification.
- Hiding simple readable code behind unnecessary abstraction.
- Mixing domain rule intent with persistence-specific query details in one class without clear boundaries.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
