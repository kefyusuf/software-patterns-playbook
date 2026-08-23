---
title: Outbox
category: enterprise
level: intermediate-to-advanced
project_layers:
  - application
  - infrastructure
related_patterns:
  - Domain Event
  - Inbox
  - Saga
---

# Outbox

## One-Line Definition

Outbox writes events to a database table inside the same transaction as the state change, then a relay publishes them, so "data changed" and "event sent" never diverge.

## Problem

Saving an order and publishing `OrderCreated` are two systems: the database commit and the message broker. Publish-then-commit loses events on rollback; commit-then-publish loses them on crash between the two steps. Both leave downstream consumers permanently wrong.

## Context

This is the standard answer to dual-write inconsistency anywhere state changes must trigger reliable reactions — inside monoliths feeding integrations and across microservices alike.

## When to Use

- Downstream consumers (search indexers, notifications, other services) must not miss changes.
- Business rules require atomicity between state change and announcement.
- At-least-once delivery plus consumer deduplication is acceptable.

## When Not to Use

- Events are advisory-only; losing one occasionally is fine — publish directly.
- No control over a batch/relay process exists in the deployment model.
- The broker supports transactional messaging that your team already operates well.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | None. |
| Application | Appending events while saving aggregates. |
| Domain | Producing domain events as part of command handling. |
| Infrastructure | Outbox table + relay worker + publisher with retries. |
| Testing | Asserting outbox rows exist after failed publishes. |

## Real-World Examples

- Order placement writes the order *and* `OrderPlaced` row atomically; a relay ships it to the notification service.
- A user profile change lands in the outbox and later syncs to a search indexer.
- Billing emits invoice-issued events from its outbox so downstream accounting stays complete.

## Code Smell Before the Pattern

The smell is the dual write:

```php
$this->db->transaction(function () use ($order) {
    $this->orders->save($order);
});
// crash here = order saved, event lost forever
$this->broker->publish(new OrderPlaced($order->id()));
```

Reversing the order just moves the hole: published event, rolled-back order.

## Minimal Example

```php
final class PlaceOrderHandler
{
    public function handle(PlaceOrder $cmd): void
    {
        $this->db->transaction(function () use ($cmd) {
            $order = Order::place($cmd->customerId, $cmd->items);
            $this->orders->save($order);

            foreach ($order->pullDomainEvents() as $event) {
                $this->db->insert('outbox', [
                    'id'         => $event->eventId(),   // uuid for dedup
                    'type'       => $event::name(),
                    'payload'    => json_encode($event),
                    'created_at' => now(),
                ]);
            }
        }); // state + event record commit together or not at all
    }
}

// separate relay loop:
$row = $this->db->fetchPendingOutbox();
$broker->publish($row['type'], $row['payload']);
$this->db->markPublished($row['id']); // at-least-once: consumers dedupe by id
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Eliminates dual-write data loss entirely | Relay infrastructure to build and monitor |
| Events replayable from table during incidents | Consumers must handle duplicates (at-least-once) |
| Simple, boring technology: just a table | Adds write latency and table growth management |

## Related Patterns

- [Inbox](./inbox.md) is the receiving twin, deduplicating exactly these at-least-once deliveries.
- [Domain Event](./domain-event.md) names what travels; Outbox guarantees it arrives.
- Transaction log tailing (CDC) achieves similar guarantees by reading DB logs instead of a table.

## Common Mistakes

- Publishing from the relay but clearing rows before broker confirmation.
- Forgetting consumer-side deduplication and treating the system as exactly-once.
- Storing rich domain objects in payload instead of versioned, serializable event schemas.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
