# Choose by Problem

Use this guide when you can describe the project problem but do not
know the pattern name yet.

## Start With the Problem

Patterns are not goals. Start from a recurring pressure in the
codebase, then pick the smallest abstraction that addresses it.

| Problem | Start Here | Why | Simpler Alternative |
|---|---|---|---|
| External providers have different APIs | [Adapter](../02-gof-patterns/structural/adapter.md) | Protects your application from vendor-specific interfaces. | A thin translation function if there is only one integration point. |
| Business rules switch by payment type, tenant, or channel | [Strategy](../02-gof-patterns/behavioral/strategy.md) | Removes large branching logic from a central service. | One conditional block if the rules are still few and stable. |
| Object creation has many optional parts or setup steps | [Builder](../02-gof-patterns/creational/builder.md) | Makes complex construction readable and explicit. | Named constructors or a plain [Factory](../02-gof-patterns/creational/factory.md) if combinations stay small. |
| A workflow passes through ordered validation or processing steps | [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md) | Keeps a long flow modular and reorderable. | One service method if the flow is short and unlikely to change. |
| Actions need to be queued, retried, or audited | [Command](../02-gof-patterns/behavioral/command.md) | Represents a request as a distinct action unit. | A direct method call if there is no scheduling or action history need. |
| You need one stable entry point for creation choices | [Factory](../02-gof-patterns/creational/factory.md) | Centralizes object creation and selection logic. | Inline construction if there is no variation yet. |
| You need optional behavior wrapped around an existing service | [Decorator](../02-gof-patterns/structural/decorator.md) | Adds cross-cutting behavior without changing the base implementation. | Add the behavior directly if there is only one consumer and low reuse. |
| You think you need one global instance | [Singleton](../02-gof-patterns/creational/singleton.md) | Rarely justified; treat as a warning flag first. | Dependency injection with explicit lifetime management. |

## Common Traps

- Reaching for Strategy when a single conditional is still cheaper and clearer.
- Reaching for Builder when the object is not actually complex.
- Reaching for Singleton to avoid passing dependencies explicitly.
- Reaching for Chain of Responsibility when the flow order never changes.

## Problem Grouping

### Integration Problems

Most integration problems start with Adapter, then sometimes grow into
Strategy or Factory when provider selection becomes dynamic.

### Workflow Problems

Checkout flows, approval flows, and validation pipelines often start
with Command or Chain of Responsibility depending on whether the main
concern is ordered processing or action representation.

### Construction Problems

Use Factory or Builder when object setup begins to obscure intent. If
the construction path is still obvious, stay simple.

## When To Stop

Do not add a pattern just because a category seems to fit. Stop if:

- the problem is still local and unlikely to repeat
- the abstraction costs more than the duplication it removes
- the team cannot explain the trade-offs in one short paragraph

## See Also

- [Payment System](../05-real-world-scenarios/payment-system.md)
- [Notification System](../05-real-world-scenarios/notification-system.md)
- [API Client Integration](../05-real-world-scenarios/api-client-integration.md)
- [E-commerce Checkout](../05-real-world-scenarios/ecommerce-checkout.md)
