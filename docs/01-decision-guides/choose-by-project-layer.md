# Choose by Project Layer

Use this guide when the problem is clear and you want to know
where an abstraction should live.

## Layer Rules

Patterns are not layer-neutral. The same abstraction can help
in one layer and create noise in another.

| Layer | Typical Pressure | Good Candidates | Usually Too Much Too Early |
|---|---|---|---|
| Presentation | Formatting, UI actions, request mapping | [Command](../02-gof-patterns/behavioral/command.md), [Decorator](../02-gof-patterns/structural/decorator.md), [DTO](../04-enterprise-patterns/dto.md) | Deep [Strategy](../02-gof-patterns/behavioral/strategy.md) hierarchies for simple view logic |
| Application | Workflow orchestration, policy selection, use-case coordination | [Strategy](../02-gof-patterns/behavioral/strategy.md), [Command](../02-gof-patterns/behavioral/command.md), [Factory](../02-gof-patterns/creational/factory.md), [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md), [Template Method](../02-gof-patterns/behavioral/template-method.md), [Observer](../02-gof-patterns/behavioral/observer.md), [Facade](../02-gof-patterns/structural/facade.md), [DTO](../04-enterprise-patterns/dto.md) | Domain-wide base classes introduced before workflows stabilize |
| Domain | Stable business rules and explicit language | [Strategy](../02-gof-patterns/behavioral/strategy.md), sometimes [Factory](../02-gof-patterns/creational/factory.md), [State](../02-gof-patterns/behavioral/state.md), or [Domain Event](../04-enterprise-patterns/domain-event.md) | [Adapter](../02-gof-patterns/structural/adapter.md) for vendor concerns, infrastructure-driven abstractions |
| Infrastructure | External APIs, persistence, delivery channels | [Adapter](../02-gof-patterns/structural/adapter.md), [Decorator](../02-gof-patterns/structural/decorator.md), [Factory](../02-gof-patterns/creational/factory.md), [Repository](../04-enterprise-patterns/repository.md) | Domain-heavy abstractions that only mirror vendor APIs |
| Testing | Scenario setup, readable fixtures | [Builder](../02-gof-patterns/creational/builder.md), [Factory](../02-gof-patterns/creational/factory.md) | Shared mutable global helpers that hide test intent |

## Fast Heuristics

- If the abstraction speaks vendor language, it usually belongs in infrastructure.
- If it coordinates a user or system workflow, it usually belongs in application.
- If it protects business meaning, it usually belongs in domain.
- If it only makes tests readable, keep it in testing.

## Layer Mistakes

### Adapter in the Domain

If your domain model starts speaking HTTP client or provider SDK terminology, the boundary is already leaking.

### Strategy Everywhere

Not every variation belongs in a Strategy family. When a choice
is local and stable, keep it close to the caller.

### Factory as a Service Locator

A factory should clarify creation. It should not become a hidden
global resolver for unrelated dependencies.

### Observer as Hidden Workflow

Observers are useful for local secondary reactions. They are risky when
they hide critical behavior that a use case must always perform.

## Simpler Alternatives

Before introducing a pattern by layer, ask:

- Would a plain function in the current module be enough?
- Is the variation real now, or only expected later?
- Is the abstraction removing coupling, or just moving it?

## See Also

- [Payment System](../05-real-world-scenarios/payment-system.md)
- [Notification System](../05-real-world-scenarios/notification-system.md)
- [E-commerce Checkout](../05-real-world-scenarios/ecommerce-checkout.md)
- [API Client Integration](../05-real-world-scenarios/api-client-integration.md)
- [Background Job Processing](../05-real-world-scenarios/background-job-processing.md)
- [Testing With Patterns](./testing-with-patterns.md)
