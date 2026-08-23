---
title: Saga
category: enterprise
level: advanced
project_layers:
  - application
  - infrastructure
related_patterns:
  - Outbox
  - Inbox
  - Domain Event
  - State
---

# Saga

## One-Line Definition

Saga coordinates a multi-step business transaction across services by breaking it into local transactions plus explicit compensating actions for each step that must be undone on failure.

## Problem

A checkout touches orders, payments, inventory, and shipping — separate databases, maybe separate teams. A distributed ACID transaction across them is either impossible or a performance disaster. Without coordination, a payment success followed by an inventory failure leaves money taken and nothing reserved.

## Context

This is the standard cross-service consistency tool. Sagas come in two styles: *choreography* (services react to each other's events) and *orchestration* (a central coordinator drives steps). Orchestrators are easier to reason about past ~4 steps.

## When to Use

- A business flow spans multiple services/stores with no shared transaction.
- Each step has a defined inverse (refund, release reservation) or is forward-only safe.
- Eventual consistency between steps is acceptable to the business.

## When Not to Use

- One database serves the whole flow; a local transaction is simpler.
- Steps have no compensation — once an email sends it cannot unsend; redesign ordering instead.
- Simple request/response suffices without state machines.
- Strict atomic visibility is required; only a single-store transaction provides that.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Showing saga progress/compensation states to users. |
| Application | Hosting the orchestrator's step machine. |
| Domain | Defining per-service commands and compensations. |
| Infrastructure | Durable saga state store + [Outbox](./outbox.md)/[Inbox](./inbox.md) transport. |
| Testing | Failure injection at each step asserting compensation ran. |

## Real-World Examples

- Checkout: reserve stock → charge card → create shipment; any later failure refunds/releases in reverse.
- Travel booking: flight + hotel + car reserved with partial cancellation on any rejection.
- KYC onboarding: document check → risk score → account creation with cleanup on rejection.

## Code Smell Before the Pattern

The smell is sequential remote calls pretending to be one transaction:

```php
$payment = $this->payments->charge($order);      // remote commit 1
$reserved = $this->inventory->reserve($order);   // remote commit 2
try {
    $this->shipping->create($order);             // throws!
} catch (\Throwable $e) {
    // ...now what? money is gone, stock is held, nothing recorded it
}
```

## Minimal Example

```php
final class CheckoutSaga
{
    private array $completed = [];

    public function run(Order $order): void
    {
        $steps = [
            'reserve' => fn() => $this->inventory->reserve($order),
            'compensate_reserve' => fn() => $this->inventory->release($order),
            'charge' => fn() => $this->payments->charge($order),
            'compensate_charge' => fn() => $this->payments->refund($order),
        ];

        try {
            foreach (['reserve', 'charge'] as $step) {
                $steps[$step]();
                $this->completed[] = $step;
                $this->state->save(get_object_vars($this)); // durable checkpoint
            }
        } catch (\Throwable $e) {
            foreach (array_reverse($this->completed) as $done) {
                $steps['compensate_' . $done]();
            }
            throw $e;
        }
    }
}
```

Real orchestrations persist each transition and resume from checkpoints after crashes.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Cross-service flows become explicit and debuggable | Every step needs a designed compensation |
| No distributed-lock or two-phase-commit bottlenecks | Eventual consistency visible to users mid-saga |
| Crash recovery via persisted saga state | Orchestrator becomes critical infrastructure |

## Related Patterns

- [Outbox](./outbox.md) reliably publishes each step's events; [Inbox](./inbox.md) dedupes their consumption.
- Process manager: the orchestrator flavor of saga, holding explicit state per instance.
- [State](../02-gof-patterns/behavioral/state.md) models the saga instance's progression internally.

## Common Mistakes

- Compensations that assume original data still exists (prices changed since).
- Non-idempotent compensations running twice after redelivered failure events.
- Choreography sprawl: nobody can say where the flow lives anymore.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
