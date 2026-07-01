---
title: Observer
category: behavioral
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - Domain Event
  - Command
  - Mediator
---

# Observer

## One-Line Definition

Observer lets interested listeners react when a subject changes or announces something, without the subject knowing each listener's concrete behavior.

## Problem

One action needs to notify several follow-up behaviors, but direct calls from the main workflow to every receiver create tight coupling and make each new reaction harder to add safely.

## Context

This appears in application events, model lifecycle hooks, UI state updates, cache invalidation, notification fan-out, and internal publish-subscribe flows where one occurrence may matter to multiple parts of the system.

## When to Use

- Several independent receivers should react to the same occurrence.
- The subject should not know every concrete follow-up behavior.
- New listeners are likely to be added without changing the subject.

## When Not to Use

- There is only one obvious follow-up and a direct call is easier to trace.
- The ordering and failure behavior of each reaction is business-critical but not explicit.
- You need durable asynchronous delivery; a message bus or domain-event pipeline may be the better boundary.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | UI state subscriptions or view-model notifications. |
| Application | In-process listeners for use-case follow-up behavior. |
| Domain | Limited; useful only when the notification is part of the domain language. |
| Infrastructure | Framework lifecycle hooks, event dispatchers, or adapter-level notifications. |
| Testing | Assert that listeners are registered or that a subject notifies expected observers. |

## Real-World Examples

- A user profile update notifies cache, audit, and search-index listeners.
- A document status change notifies dashboard and notification listeners.
- A desktop or frontend state store notifies views when the selected entity changes.

## Code Smell Before the Pattern

The smell is one workflow directly calling every receiver:

```php
$userService->updateProfile($user, $input);
$cacheService->forgetUser($user->id);
$auditService->recordProfileUpdate($user->id);
$searchService->reindexUser($user->id);
```

The profile update now knows too many unrelated reaction details.

## Minimal Example

```php
interface UserObserver
{
    public function profileUpdated(User $user): void;
}

final class UserSubject
{
    /** @var list<UserObserver> */
    private array $observers = [];

    public function addObserver(UserObserver $observer): void
    {
        $this->observers[] = $observer;
    }

    public function notifyProfileUpdated(User $user): void
    {
        foreach ($this->observers as $observer) {
            $observer->profileUpdated($user);
        }
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Decouples the subject from concrete reactions | Makes control flow less linear |
| Allows listeners to be added without changing the subject | Requires explicit ordering and failure policies when reactions matter |
| Works well for local notification and UI update flows | Can hide critical business behavior behind registration wiring |

## Related Patterns

- Domain Event when the notification is a named business fact such as `OrderPlaced`.
- Command when the main concern is representing an action to execute later.
- Mediator when many objects communicate through a coordinating object instead of observing one subject.

## Common Mistakes

- Using observers to hide essential business workflow that should stay explicit.
- Letting listener order affect correctness without documenting that order.
- Mixing synchronous local observers with durable asynchronous messaging expectations.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
