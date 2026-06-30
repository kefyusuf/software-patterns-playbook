---
title: Strategy
category: behavioral
level: beginner-to-intermediate
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - Factory
  - Adapter
  - State
---

# Strategy

## One-Line Definition

Strategy encapsulates interchangeable behavior behind one contract so the caller can choose a policy without branching through every case inline.

## Problem

One service grows long conditional logic because behavior changes by provider, payment method, pricing rule, tenant policy, or channel type.

## Context

This pattern shows up when the same workflow stays stable but one part of it varies. Payment authorization, discount rules, delivery channel selection, and export formatting are common examples.

## When to Use

- Several algorithms or rules share one intent but differ in implementation.
- The variation is real, recurring, and expected to grow.
- You want to add a new behavior without editing one large branching method repeatedly.

## When Not to Use

- There are only one or two stable branches and they are still easy to read inline.
- The variation is speculative rather than real.
- The behavior changes because object state evolves over time; that may be State, not Strategy.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Formatting or rendering policies when variation is substantial. |
| Application | Payment, notification, or workflow policy selection. |
| Domain | Rule families with clear business meaning. |
| Infrastructure | Provider-specific behaviors behind a stable internal contract. |
| Testing | Swap policies for focused scenario coverage. |

## Real-World Examples

- A payment module selects card, bank transfer, or wallet charging logic.
- A pricing engine applies different discount strategies by campaign type.
- A notification workflow selects email, SMS, or push delivery logic.

## Code Smell Before the Pattern

The smell is a growing branch cluster:

```php
if ($method === 'card') {
    $this->chargeCard($order);
} elseif ($method === 'bank_transfer') {
    $this->createTransferRequest($order);
} elseif ($method === 'wallet') {
    $this->chargeWallet($order);
}
```

The workflow intent is mixed with every variation detail.

## Minimal Example

```php
interface PaymentMethodStrategy
{
    public function charge(Order $order): void;
}

final class CardStrategy implements PaymentMethodStrategy
{
    public function charge(Order $order): void
    {
        // card-specific charging logic
    }
}

final class WalletStrategy implements PaymentMethodStrategy
{
    public function charge(Order $order): void
    {
        // wallet-specific charging logic
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Removes large branching methods | Adds more types and wiring |
| Supports extension without rewriting one hot spot | Can be overkill when variation is still small |
| Makes behavior tests more focused | Needs clear ownership of selection logic |

## Related Patterns

- Factory when you need a central place to create the chosen strategy.
- Adapter when each strategy wraps a provider with a mismatched external interface.
- State when behavior changes because an object transitions through states rather than because a caller selects a policy.

## Common Mistakes

- Creating a strategy family before the variation is real.
- Keeping all branching logic in the caller and also adding strategies, which duplicates complexity.
- Using Strategy where a simple lookup table or function would be clearer.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
