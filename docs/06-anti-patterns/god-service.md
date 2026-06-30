---
title: God Service
category: architecture
related_patterns:
  - Strategy
  - Chain of Responsibility
  - Command
---

# God Service

## Definition

God Service is a large application or domain service that accumulates many unrelated responsibilities until it becomes the default home for every workflow change.

## Symptoms

- One service validates input, applies rules, calls external systems, logs events, and persists results.
- The file grows with many conditional branches for unrelated cases.
- Every new requirement touches the same service.

## Why It Happens

Teams centralize behavior for convenience, especially early in a project when one service feels like the fastest place to add another rule.

## Why It Is Harmful

It becomes hard to test, hard to review, and risky to change. Business rules, integration logic, and orchestration concerns get mixed together, so one edit can break unrelated flows.

## Before Example

A `CheckoutService` validates the cart, charges payment, reserves inventory, applies coupons, logs analytics, and creates the order in one method.

## Better Alternatives

- Split policy variation into Strategy when variation is real.
- Split multi-step workflows into explicit handlers or chains when order matters.
- Keep integration boundaries in adapters instead of mixing them into one service.

## Refactoring Path

1. Identify distinct responsibilities inside the service.
2. Separate boundary logic, policy logic, and workflow coordination.
3. Move repeated variation or ordered steps into clearer focused units.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?

## Related Reading

- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
- [Command](../02-gof-patterns/behavioral/command.md)
- [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md)
- [E-commerce Checkout](../05-real-world-scenarios/ecommerce-checkout.md)
