---
title: Notification System
scenario_type: notification
recommended_patterns:
  - Adapter
  - Strategy
  - Decorator
not_recommended_initially:
  - Command
  - Observer
---

# Notification System

## Problem

An application must send notifications through different channels such as email, SMS, or push while keeping business workflows independent from vendor SDKs and channel-specific details.

## Forces and Constraints

- Business constraint: different users or events may require different channels.
- Technical constraint: each delivery provider has its own payload format, limits, and error behavior.
- Maintainability constraint: business workflows should not contain channel branching and vendor request assembly.
- Testing constraint: delivery choices and error handling should be testable without real providers.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Adapter](../02-gof-patterns/structural/adapter.md) | Normalizes channel vendors behind stable internal sender contracts. |
| [Strategy](../02-gof-patterns/behavioral/strategy.md) | Selects the correct channel behavior based on event type, user preference, or delivery rule. |
| [Decorator](../02-gof-patterns/structural/decorator.md) | Adds logging, metrics, or auditing around senders without changing the base delivery implementation. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| [Command](../02-gof-patterns/behavioral/command.md) | Useful later for async delivery queues, but not required for an MVP synchronous send path. |
| Observer | Can make flow less explicit too early if simple notification triggers are still manageable in application services. |

## Suggested Project Structure

```txt
app/
  Notifications/
    Application/
      SendNotification.php
      NotificationChannelStrategy.php
    Infrastructure/
      Channels/
        EmailSenderAdapter.php
        SmsSenderAdapter.php
        PushSenderAdapter.php
      Decorators/
        LoggingNotificationSender.php
```

## Step-by-Step Flow

1. An application use case decides that a notification should be sent.
2. The use case selects a channel strategy based on event type, user preference, or delivery policy.
3. The selected strategy delegates to the appropriate sender adapter.
4. Optional decorators wrap the sender for logging, metrics, or audit behavior.
5. The use case handles normalized success or failure results without vendor-specific branching.

## Failure Modes

- Channel-specific vendor errors leak into application services.
- Business workflows grow `if email / if sms / if push` branches everywhere.
- Decorators accumulate in inconsistent order and obscure the send path.
- A new channel is added by copy-paste instead of extending the strategy family and adapter boundary cleanly.

## Testing Strategy

- Unit tests: channel selection rules and decorator behavior.
- Integration tests: adapter translation and normalized result mapping with fake provider responses.
- Contract tests: ensure every sender adapter honors the same internal delivery contract.
- E2E tests, if necessary: one event path per representative channel with test doubles or sandbox clients.

## Scaling Considerations

As volume grows, asynchronous delivery, retry policies, delivery batching, and event-driven trigger mechanisms may become worthwhile. Those concerns should follow demonstrated operational pressure, not lead the MVP design.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [Choose by Problem](../01-decision-guides/choose-by-problem.md)
- [Choose by Project Layer](../01-decision-guides/choose-by-project-layer.md)
- [Adapter](../02-gof-patterns/structural/adapter.md)
- [Strategy](../02-gof-patterns/behavioral/strategy.md)
- [Decorator](../02-gof-patterns/structural/decorator.md)
