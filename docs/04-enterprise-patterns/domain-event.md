---
title: Domain Event
category: enterprise
level: intermediate
project_layers:
  - domain
  - application
related_patterns:
  - Command
  - Observer
  - Strategy
---

# Domain Event

## One-Line Definition

Domain Event captures a meaningful business occurrence as an explicit fact so other parts of the application can react without tightly coupling themselves to the original workflow.

## Problem

One use case performs a business action and then directly calls many follow-up behaviors such as notifications, projections, audit logging, or policy checks. Over time, the original workflow becomes crowded with side effects.

## Context

This appears in order placement, account approval, payment success, refund handling, subscription changes, and other business moments that multiple parts of the system care about.

## When to Use

- A business occurrence matters beyond the original use case.
- Several reactions depend on the same domain fact.
- You want downstream behavior to stay decoupled from the initiating action.

## When Not to Use

- The system has only one obvious follow-up and direct code is still clearer.
- The event exists only to look event-driven without solving a coupling problem.
- The team is not ready to reason about eventual reactions, ordering, or observability.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; presentation usually consumes results rather than raises domain events. |
| Application | Dispatch, handler wiring, and side-effect orchestration often live here. |
| Domain | The business event itself belongs here as part of the domain language. |
| Infrastructure | Event transport, persistence, or delivery mechanisms may live here. |
| Testing | Useful for asserting that important business facts are emitted and handled correctly. |

## Real-World Examples

- `OrderPlaced` triggers notification scheduling, analytics, and invoice preparation.
- `PaymentCaptured` triggers receipt creation and fulfillment preparation.
- `UserApproved` triggers welcome messaging and access provisioning.

## Code Smell Before the Pattern

The smell is one use case calling every downstream concern directly:

```php
$order = $orderService->place($cart);
$notificationService->sendOrderConfirmation($order);
$analyticsService->trackOrderPlaced($order);
$auditService->recordOrderPlaced($order);
```

The action that placed the order now knows too many unrelated follow-up details.

## Minimal Example

```php
final class OrderPlaced
{
    public function __construct(
        public string $orderId,
        public string $customerId
    ) {}
}

final class PlaceOrderHandler
{
    public function handle(PlaceOrderCommand $command): void
    {
        // create order
        $this->eventBus->publish(new OrderPlaced($orderId, $customerId));
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Decouples follow-up behavior from the initiating use case | Makes flow less linear and may be harder to trace |
| Keeps business occurrences explicit | Requires discipline around event naming, ownership, and observability |
| Supports incremental reactions over time | Can become overengineered if only one simple follow-up exists |

## Related Patterns

- Command when the main concern is representing the incoming action rather than the resulting business fact.
- Observer as the more general publish-subscribe idea; Domain Event is the business-focused version that names a domain occurrence explicitly.
- Strategy when one policy varies inside a use case but no broader business event is needed.

## Common Mistakes

- Emitting events for trivial internal steps that are not real business facts.
- Using Domain Events to avoid writing clear application flow.
- Publishing events without clear ownership of delivery guarantees or tracing.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
