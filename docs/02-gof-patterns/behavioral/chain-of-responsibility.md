---
title: Chain of Responsibility
category: behavioral
level: intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Command
  - Strategy
  - Decorator
---

# Chain of Responsibility

## One-Line Definition

Chain of Responsibility breaks a workflow into ordered handlers where each step can process, reject, or pass work to the next step.

## Problem

One workflow method grows into a long sequence of validation, enrichment, authorization, and side-effect steps that becomes hard to read, test, or reorder safely.

## Context

This appears in checkout pipelines, request validation, approval flows, middleware-like processing, and integration workflows where the order of steps matters.

## When to Use

- A workflow naturally breaks into distinct ordered steps.
- Some handlers may stop the flow or pass work onward.
- You need to add, remove, or reorder steps without rewriting one large method.

## When Not to Use

- The workflow is short, stable, and easy to understand in one place.
- Handlers are so tightly coupled that splitting them hides the real flow.
- You only need one policy choice rather than a multi-step pipeline.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Request preprocessing in limited cases. |
| Application | Main home for checkout, approval, or orchestration pipelines. |
| Domain | Rare; domain rules usually stay explicit methods rather than chained handlers. |
| Infrastructure | Middleware or integration processing chains. |
| Testing | Test handlers independently and then test pipeline order. |

## Real-World Examples

- A checkout flow validates stock, validates payment method, reserves inventory, and creates the order.
- A document approval pipeline checks permissions, policy, and side effects in sequence.
- An inbound integration request runs through normalization, validation, and persistence steps.

## Code Smell Before the Pattern

The smell is a long workflow service with many step blocks:

```php
$this->validateCart($cart);
$this->validateCustomer($customer);
$this->validatePaymentMethod($paymentMethod);
$this->reserveInventory($cart);
$this->createOrder($cart, $customer);
```

The flow may still be valid, but once branching and optional steps grow, one method becomes the bottleneck for every change.

## Minimal Example

```php
interface CheckoutStep
{
    public function handle(CheckoutContext $context, callable $next): void;
}

final class ValidateCartStep implements CheckoutStep
{
    public function handle(CheckoutContext $context, callable $next): void
    {
        // validate cart
        $next($context);
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes long workflows modular and reorderable | Adds more moving parts and pipeline wiring |
| Supports focused testing per step | Can hide the big-picture flow if naming is weak |
| Allows conditional stop or pass behavior | May be unnecessary for short stable workflows |

## Related Patterns

- Command when the workflow needs a first-class request object.
- Strategy when the problem is choosing one policy, not running many steps.
- Decorator when behavior is layered around one service call instead of passed down a chain.

## Common Mistakes

- Splitting a short, stable method into too many handlers.
- Giving handlers unclear names so the pipeline becomes harder to follow than the original code.
- Letting handlers mutate shared context without clear boundaries.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
