---
title: Decorator
category: structural
level: beginner-to-intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Adapter
  - Strategy
  - Factory
---

# Decorator

## One-Line Definition

Decorator wraps an existing object to add behavior around it without changing the original implementation or creating subclass combinations.

## Problem

You have a stable service contract, but different callers need extra behavior such as logging, retries, metrics, caching, or auditing around the same base operation.

## Context

This often appears in notification sending, API clients, repository reads, payment calls, and other services where the core job is stable but operational behavior grows around it.

## When to Use

- Multiple behaviors need to be layered around one service contract.
- The base implementation should stay focused on its primary responsibility.
- Subclass combinations or copy-pasted wrappers are starting to grow.

## When Not to Use

- Only one caller needs one tiny extra behavior.
- The wrapper does not preserve the original contract cleanly.
- A direct inline call would be clearer and there is no reuse.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Add formatting or instrumentation around view helpers in limited cases. |
| Application | Add auditing or workflow-level cross-cutting behavior around services. |
| Domain | Rare; domain behavior usually should stay explicit rather than wrapped operationally. |
| Infrastructure | Common for logging, retries, metrics, caching, and tracing around clients. |
| Testing | Sometimes used to observe calls while preserving the same contract. |

## Real-World Examples

- Wrapping a notification sender with logging and delivery metrics.
- Wrapping an API client with retry or timeout monitoring.
- Wrapping a payment gateway adapter with audit logging.

## Code Smell Before the Pattern

The common smell is repeated wrapper logic at every call site:

```php
$start = microtime(true);
$sender->send($notification);
$logger->info('notification.sent', ['duration' => microtime(true) - $start]);
```

When this pattern repeats, operational behavior is scattered instead of being composed once.

## Minimal Example

```php
interface NotificationSender
{
    public function send(Notification $notification): void;
}

final class LoggingNotificationSender implements NotificationSender
{
    public function __construct(
        private NotificationSender $inner,
        private LoggerInterface $logger
    ) {}

    public function send(Notification $notification): void
    {
        $this->logger->info('notification.send.start');
        $this->inner->send($notification);
        $this->logger->info('notification.send.finish');
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Adds behavior without modifying the base service | Adds more types and wiring |
| Keeps cross-cutting logic reusable | Can become wrapper noise if overused |
| Avoids subclass explosion | Ordering of multiple decorators can become important |

## Related Patterns

- Adapter when the problem is interface mismatch, not extra behavior.
- Strategy when the main issue is choosing one behavior family.
- Factory when decorators need central composition.

## Common Mistakes

- Wrapping a service for one trivial behavior with no reuse.
- Hiding business decisions inside decorators that should stay explicit elsewhere.
- Stacking many decorators without documenting order expectations.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
