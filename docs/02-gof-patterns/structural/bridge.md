---
title: Bridge
category: structural
level: intermediate-to-advanced
project_layers:
  - application
  - infrastructure
related_patterns:
  - Adapter
  - Strategy
  - Abstract Factory
---

# Bridge

## One-Line Definition

Bridge splits two independent variation axes into separate class hierarchies connected by composition, preventing a subclass explosion where every combination needs its own class.

## Problem

Two dimensions of a concept vary independently — message types and transport channels, report formats and delivery targets, shapes and rendering backends. Modeling both axes with inheritance produces M×N classes that must all be maintained.

## Context

This appears when a domain concept (what) and its implementation platform (how) evolve on different schedules: product teams add message types while platform teams change transports.

## When to Use

- Two variation axes are genuinely orthogonal and both keep growing.
- You already feel the cartesian-product pain: names like `EmailSmsNotifier` or `PdfS3Uploader` exist.
- Implementation switching must happen at runtime without touching the abstraction.

## When Not to Use

- One axis is fixed or trivial; a single hierarchy is simpler.
- The "axes" are actually the same concern split in two.
- You only wrap an incompatible external interface; that is [Adapter](./adapter.md).
- Runtime behavior selection with one axis of variation is plain [Strategy](../behavioral/strategy.md).

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Widget kinds × render targets (DOM, PDF, terminal). |
| Application | Notification types × delivery channels. |
| Domain | Rarely; the bridge usually sits at the edge of the domain. |
| Infrastructure | Storage abstractions × provider drivers. |
| Testing | Testing each axis in isolation with fakes for the other. |

## Real-World Examples

- Notifications: `order-shipped`, `password-reset` messages over email, SMS, or push — added independently.
- Reports: quarterly/invoice/ad-hoc reports delivered to S3, email attachment, or printer.
- Drawing app: circle/square/group shapes rendered by Cairo or SVG backends.

## Code Smell Before the Pattern

The smell is inheritance stacking two axes:

```php
abstract class Notification {}
final class ShippedEmailNotification extends Notification {}
final class ShippedSmsNotification   extends Notification {}
final class ResetEmailNotification   extends Notification {}
final class ResetSmsNotification     extends Notification {}
// adding push = editing every message family; adding a message = every channel
```

Each class mixes content logic with channel plumbing.

## Minimal Example

```php
interface Channel
{
    public function send(string $to, string $body): void;
}

final class SmsChannel implements Channel
{
    public function send(string $to, string $body): void { /* sms sdk */ }
}

abstract class Notification
{
    protected function __construct(private readonly Channel $channel) {}

    public function dispatch(string $to): void
    {
        $this->channel->send($to, $this->compose());
    }

    abstract protected function compose(): string;
}

final class OrderShippedNotification extends Notification
{
    protected function compose(): string { return 'Your order has shipped.'; }
}
```

Messages grow along one hierarchy, channels along the other; they meet through composition.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Combinations stop multiplying as classes | Two hierarchies plus wiring to understand |
| Each axis evolves and tests independently | Indirection can obscure simple flows |
| Implementation swap at runtime | Overkill when one axis will never vary |

## Related Patterns

- Adapter makes an existing mismatched interface usable; Bridge plans two evolving interfaces apart from day one.
- Strategy varies *one* algorithm behind one contract; Bridge coordinates two whole hierarchies.
- Abstract Factory often builds the implementation side of a bridge as matched families.

## Common Mistakes

- Bridging concerns that were never independent, creating pointless indirection.
- Letting the abstraction leak channel details into `compose()`.
- Introducing Bridge preemptively before either axis shows real growth.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
