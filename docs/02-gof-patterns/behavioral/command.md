---
title: Command
category: behavioral
level: intermediate
project_layers:
  - presentation
  - application
related_patterns:
  - Chain of Responsibility
  - Strategy
  - Factory
---

# Command

## One-Line Definition

Command represents an action as an object so the system can pass, queue, log, retry, or invoke that action consistently.

## Problem

Direct method calls are no longer enough because the action needs identity, delayed execution, auditing, replay, or transport across boundaries.

## Context

This appears in job queues, controller-to-handler dispatch, admin actions, workflow tasks, and systems where requests become first-class units rather than immediate calls.

## When to Use

- The action should be queued, retried, logged, or dispatched later.
- The same request shape should be handled consistently across boundaries.
- You want to separate request data from the logic that executes it.

## When Not to Use

- A direct method call is immediate, clear, and sufficient.
- The command object would only duplicate a simple function signature.
- There is no meaningful benefit from giving the action its own type.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Convert UI or HTTP actions into discrete requests. |
| Application | Main home for command handlers and action dispatch. |
| Domain | Less common; domain methods usually express behavior directly. |
| Infrastructure | Transport, queue, or persistence support for command delivery. |
| Testing | Useful for asserting discrete action handling behavior. |

## Real-World Examples

- A checkout request becomes a queued command processed by a handler.
- An admin bulk action is captured as a command and audited later.
- A retryable export task is stored and executed asynchronously.

## Code Smell Before the Pattern

The smell is overloaded application services called from many places with loosely structured inputs:

```php
$checkoutService->run(
    $orderId,
    $userId,
    $paymentMethod,
    $couponCode,
    $requestedAt
);
```

The action has meaning of its own, but it is still just a long parameter list.

## Minimal Example

```php
final class CheckoutCommand
{
    public function __construct(
        public string $orderId,
        public string $userId,
        public string $paymentMethod
    ) {}
}

final class CheckoutHandler
{
    public function handle(CheckoutCommand $command): void
    {
        // execute checkout workflow
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Gives actions explicit structure and identity | Adds request and handler types |
| Supports queuing, logging, and retries cleanly | Can feel heavy for simple synchronous calls |
| Makes boundaries clearer | Needs discipline to avoid command explosion |

## Related Patterns

- Chain of Responsibility when one action moves through ordered handlers.
- Strategy when the command stays the same but one policy inside it varies.
- Factory when command creation itself becomes complex or context-driven.

## Common Mistakes

- Creating commands for tiny internal calls with no lifecycle value.
- Putting all business logic directly in the command object.
- Treating commands as generic bags of unrelated data.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
