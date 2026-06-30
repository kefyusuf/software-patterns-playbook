---
title: Facade
category: structural
level: beginner-to-intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Adapter
  - Decorator
  - Factory
---

# Facade

## One-Line Definition

Facade provides one simplified entry point over a set of related collaborators when callers should not need to understand every subsystem detail directly.

## Problem

Callers must coordinate several services, clients, or steps just to perform one common task. The flow is repetitive and easy to misuse because too much subsystem knowledge leaks to every caller.

## Context

This usually appears around checkout orchestration helpers, report generation, third-party SDK bundles, notification setup, or administrative workflows that require several lower-level operations to happen in the correct order.

## When to Use

- Several collaborators are commonly used together for one higher-level task.
- Callers keep repeating the same coordination logic.
- You want one simpler API without exposing subsystem sprawl.

## When Not to Use

- The underlying subsystem is already small and readable.
- The facade would become a God Service that hides unrelated responsibilities.
- The real problem is interface mismatch with one external system, which is usually Adapter instead.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Simplify access to a UI-oriented workflow helper in limited cases. |
| Application | Common place for orchestration-friendly entry points over several services. |
| Domain | Rare; domain rules should usually stay explicit rather than hidden behind convenience APIs. |
| Infrastructure | Wrap complex vendor SDK surfaces behind one simpler client entry point. |
| Testing | Can reduce repetitive fixture setup when several collaborators are always composed together. |

## Real-World Examples

- A checkout facade wraps cart validation, payment authorization, and order creation for a narrow use case.
- A reporting facade coordinates several query services and formatters into one export operation.
- A cloud storage facade hides a large vendor SDK behind a small internal API for upload, fetch, and delete.

## Code Smell Before the Pattern

The smell is repeated coordination at the call site:

```php
$cartValidator->validate($cart);
$inventoryService->reserve($cart);
$paymentService->authorize($payment);
$orderService->create($cart, $payment);
```

The flow may be valid, but every caller now needs to know the same ordering and dependencies.

## Minimal Example

```php
final class CheckoutFacade
{
    public function __construct(
        private CartValidator $cartValidator,
        private InventoryService $inventoryService,
        private PaymentService $paymentService,
        private OrderService $orderService
    ) {}

    public function complete(CheckoutRequest $request): Order
    {
        $this->cartValidator->validate($request->cart);
        $this->inventoryService->reserve($request->cart);
        $this->paymentService->authorize($request->payment);

        return $this->orderService->create($request->cart, $request->payment);
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Simplifies repeated subsystem coordination | Can hide too much if it grows into a large catch-all service |
| Gives callers a smaller API surface | Adds another layer that must stay aligned with subsystem behavior |
| Reduces misuse of ordering details | May tempt teams to mix unrelated concerns into one facade |

## Related Patterns

- Adapter when the issue is translating one external interface rather than simplifying many collaborators.
- Decorator when you want to add behavior around one stable service.
- Factory when the main problem is selecting which collaborator family to create.

## Common Mistakes

- Treating Facade as a place to dump every workflow in the module.
- Confusing Facade with Adapter and using it only to rename one external API.
- Hiding important domain rules inside a convenience wrapper with no clear boundaries.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
