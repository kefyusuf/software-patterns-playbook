---
title: Service Layer
category: enterprise
level: intermediate
project_layers:
  - application
related_patterns:
  - Facade
  - Repository
  - Domain Event
---

# Service Layer

## One-Line Definition

Service Layer defines an application's boundary as explicit use-case methods — each one transaction, one authorization point, and the only place orchestrating domain objects and infrastructure for that flow.

## Problem

Controllers grow fat: validation, permission checks, transaction boundaries, repository calls, event dispatch, and response mapping interleaved in one method. The same flow duplicated across HTTP handler, CLI command, and job worker drifts apart.

## Context

Sits between delivery mechanisms (HTTP, queue, CLI) and the domain. Thin over a rich domain; thicker where flows mostly orchestrate reads and writes without deep rules.

## When to Use

- Multiple entry points must run identical business flows.
- Transaction and authorization scope needs one obvious home per use case.
- Controllers should reduce to "parse request, call service, map response".

## When Not to Use

- Pure CRUD with no orchestration; calling a repository from the controller is honest.
- The "layer" would just forward every call untouched.
- Rich domains where aggregate methods already express the whole flow.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Calls service methods, maps results to responses. |
| Application | *Is* this layer: `PlaceOrderService`, `CancelSubscriptionService`. |
| Domain | Invoked by services; unaware of them. |
| Infrastructure | Injected as interfaces behind services. |
| Testing | Services tested as the application's true API. |

## Real-World Examples

- `CheckoutService::place()` owns validation, pricing, reservation, and event emission for web, mobile, and job callers alike.
- A `UserService` exposing `register()`, `changeEmail()`, `deactivate()` used by both admin panel and public API.
- Background jobs calling the same `InvoiceService::issue()` humans trigger from UI.

## Code Smell Before the Pattern

The smell is orchestration trapped in delivery code:

```php
public function place(Request $r): Response
{
    $this->auth->must('order.place');           // rule lives in transport layer
    DB::transaction(function () use ($r) {      // ...and so do transactions
        $order = Order::create($r->all());
        $this->stock->reserve($order);
        event(new OrderPlaced($order));
    });
}
```

The CLI import path re-implements all of it, minus the auth check it forgot.

## Minimal Example

```php
final class CheckoutService
{
    public function __construct(
        private readonly Orders $orders,
        private readonly Stock  $stock,
        private readonly Events $events,
        private readonly TransactionScope $tx,
    ) {}

    public function place(PlaceOrderCommand $cmd): OrderId
    {
        return $this->tx->run(function () use ($cmd) {
            $order = Order::place($cmd->customerId, $cmd->items);
            $this->orders->add($order);
            $this->stock->reserveFor($order);
            $this->events->emit(...$order->pullDomainEvents());
            return $order->id();
        });
    }
}
```

Controllers shrink to translation; the use case has exactly one definition.

## Trade-Offs

| Benefit | Cost |
|---|---|
| One authoritative implementation per use case | Anemic risk: logic drains out of domain into services |
| Natural seam for transactions and authorization | Another layer of indirection on every feature |
| Delivery-agnostic: HTTP/CLI/jobs share flows | Service interfaces churn as flows change |

## Related Patterns

- [Facade](../02-gof-patterns/structural/facade.md) simplifies subsystem calls but holds no policy; a service layer owns transaction/auth/orchestration policy.
- [Repository](./repository.md) supplies persistence access beneath services.
- [Domain Event](./domain-event.md) emissions typically happen inside service-managed boundaries.
- [DTO](./dto.md) shapes commands entering and results leaving the layer.

## Common Mistakes

- Letting services swallow domain rules until entities become bags of getters (see [Anemic Domain Model](../06-anti-patterns/anemic-domain-model.md)).
- One god-service accumulating forty unrelated operations.
- Leaking HTTP request objects into service signatures.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
