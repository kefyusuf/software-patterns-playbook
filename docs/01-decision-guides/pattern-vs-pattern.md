# Pattern vs Pattern

Use this guide when two patterns appear similar on paper
but lead to different maintenance outcomes.

## Factory vs Builder

| Question | Factory | Builder |
|---|---|---|
| Main concern | Choosing what to create | Controlling how complex construction happens |
| Best when | Variants differ | Setup steps or optional parts grow |
| Too much when | There is only one obvious creation path | The object is simple and stable |

Choose [Factory](../02-gof-patterns/creational/factory.md)
when selection logic is the real problem. Choose
[Builder](../02-gof-patterns/creational/builder.md)
when construction readability is the real problem.

## Adapter vs Decorator

| Question | Adapter | Decorator |
|---|---|---|
| Main concern | Interface mismatch | Behavior extension |
| Best when | External systems speak a different shape | You want to wrap extra behavior around a stable service |
| Too much when | A tiny translation function is enough | The extra behavior is local and one-off |

[Adapter](../02-gof-patterns/structural/adapter.md)
changes the interface you expose.
[Decorator](../02-gof-patterns/structural/decorator.md)
keeps the interface and changes the behavior around it.

## Strategy vs State

| Question | Strategy | State |
|---|---|---|
| Main concern | Pick one behavior from several policies | Behavior changes because the object's state changes |
| Best when | The caller chooses the rule | The object evolves through transitions |
| Good examples | Payment method selection, notification channel selection | Order lifecycle, approval workflow, subscription status |

If the variation is caller-driven, [Strategy](../02-gof-patterns/behavioral/strategy.md) is usually the simpler choice. If the same object behaves differently because it has moved from one meaningful stage to another, [State](../02-gof-patterns/behavioral/state.md) is often the better fit.

## Strategy vs Template Method

| Question | Strategy | Template Method |
|---|---|---|
| Main concern | Swap one policy or algorithm behind a stable contract | Protect a fixed workflow skeleton while selected steps vary |
| Best when | The caller or context chooses behavior at runtime | The sequence must stay fixed across related implementations |
| Risk | Too many tiny policy classes | Inheritance coupling and unclear hooks |

Choose [Strategy](../02-gof-patterns/behavioral/strategy.md)
when composition keeps the design flexible. Choose
[Template Method](../02-gof-patterns/behavioral/template-method.md)
when the algorithm order is the central rule and should not be repeated.

## Command vs Chain of Responsibility

| Question | Command | Chain of Responsibility |
|---|---|---|
| Main concern | Representing an action | Passing work through ordered handlers |
| Best when | You care about queuing, retrying, auditing, undo, or delayed execution | You care about step-by-step processing and conditional handoff |
| Too much when | A direct method call is enough | The workflow is short and fixed |

Use [Command](../02-gof-patterns/behavioral/command.md) when the action itself needs identity. Use [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md) when the sequence of handlers is the design pressure.

## Observer vs Domain Event

| Question | Observer | Domain Event |
|---|---|---|
| Main concern | Let listeners react to a subject notification | Name a meaningful business fact that occurred |
| Best when | Local reactions should be decoupled from the subject | Other parts of the application care about a domain occurrence |
| Too much when | There is one direct follow-up | The event is just an internal implementation detail |

[Observer](../02-gof-patterns/behavioral/observer.md) is the
general notification mechanism. [Domain Event](../04-enterprise-patterns/domain-event.md)
is the business-focused version where the event name is part of the
domain language.

## Factory vs Singleton

| Question | Factory | Singleton |
|---|---|---|
| Main concern | Controlled creation | Enforcing one shared instance |
| Best when | You want flexibility in creation | You truly need a process-wide resource with explicit constraints |
| Risk | Becomes a hidden service locator | Becomes hidden global state |

If you are choosing between these two, the correct answer is usually [Factory](../02-gof-patterns/creational/factory.md) or plain dependency injection, not [Singleton](../02-gof-patterns/creational/singleton.md).

## Default Rule

When two patterns both seem possible, prefer the one with:

- less hidden state
- fewer moving parts
- easier tests
- clearer failure boundaries

## See Also

- [Payment System](../05-real-world-scenarios/payment-system.md)
- [Notification System](../05-real-world-scenarios/notification-system.md)
- [E-commerce Checkout](../05-real-world-scenarios/ecommerce-checkout.md)
- [Order Processing](../05-real-world-scenarios/order-processing.md)
- [Admin Panel / Back-Office Actions](../05-real-world-scenarios/admin-panel.md)
- [Background Job Processing](../05-real-world-scenarios/background-job-processing.md)
