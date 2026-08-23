---
title: Inbox
category: enterprise
level: intermediate-to-advanced
project_layers:
  - application
  - infrastructure
related_patterns:
  - Outbox
  - Domain Event
---

# Inbox

## One-Line Definition

Inbox records incoming message IDs before processing them inside the same transaction as their effects, so at-least-once delivery cannot cause duplicate side effects.

## Problem

Brokers and relays deliver *at least once*; a consumer that processes an event twice double-charges, double-ships, or double-counts. Acknowledging before processing risks loss instead — the mirror-image failure.

## Context

The receiving twin of the Outbox. Any consumer of integration events with non-idempotent effects needs this: order services consuming payment events, projectors updating read models, sagas reacting to step completions.

## When to Use

- Consuming events whose effects must not repeat (money, inventory, notifications).
- Broker ordering guarantees are weak and duplicates arrive across partitions.
- Processing and dedup-record must commit atomically.

## When Not to Use

- Handlers are naturally idempotent ("set status = shipped"); direct processing is simpler.
- Exactly-once is genuinely required — no table gives you that end-to-end; redesign the flow.
- Pure read-model projections where recomputation from source is cheap and safe.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | None. |
| Application | Wrapping handler dispatch with inbox checks. |
| Domain | None. |
| Infrastructure | Inbox table, unique message-ID constraint, relay/consumer glue. |
| Testing | Redelivering the same event and asserting single effect. |

## Real-World Examples

- A payment-confirmed event redelivered by the broker still credits exactly one invoice.
- A projector skips an already-applied event after consumer rebalancing.
- A saga's "payment completed" reaction fires once despite duplicate deliveries during failover.

## Code Smell Before the Pattern

The smell is process-then-ack with hope:

```php
$broker->consume(function (Message $m) {
    $this->invoices->credit($m->orderId); // duplicates double-credit
    $m->ack();
});
// ack-first variant loses the credit on crash before processing
```

## Minimal Example

```php
final class InboxConsumer
{
    public function handle(Message $message): void
    {
        $this->db->transaction(function () use ($message) {
            $inserted = $this->db->insertIfNew(
                'inbox',
                ['message_id' => $message->id(), 'received_at' => now()],
            );
            if (!$inserted) {
                return; // already processed: skip safely
            }
            ($this->handlers)($message);      // effect
            // inbox row + effect commit together
        });
        $message->ack();                      // only after durable success
    }
}
```

The unique index on `message_id` does the real work; everything else is plumbing.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Duplicates stop causing duplicate business effects | One more table per consumer service |
| Crash between receive and process stays correct | Requires transactional storage alongside the handler |
| Simple mental model: seen-before means skip | Inbox grows forever without pruning policy |

## Related Patterns

- [Outbox](./outbox.md) produces the at-least-once stream this pattern consumes safely.
- [Domain Event](./domain-event.md) handlers are the typical wrapped units.
- Idempotent handlers (natural keying by aggregate ID + version) can replace an inbox where effects are inherently idempotent.

## Common Mistakes

- Recording inbox membership in one database while applying effects in another — the atomicity is the whole point.
- Pruning processed rows too eagerly, so late redeliveries re-execute.
- Assuming brokers dedupe for you across producer retries; they do not.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
