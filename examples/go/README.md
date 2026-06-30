# Go Examples

This directory contains small, framework-free Go examples that support the documentation by showing pattern boundaries in plain code.

The examples are intentionally minimal:

- one focused pattern or pattern combination per example
- small package structure
- explicit dependency passing
- no web framework or external SDK dependency unless the example truly requires it

## Coverage Map

| Example | Primary Docs |
|---|---|
| [`payment-strategy`](./payment-strategy/README.md) | [Strategy](../../docs/02-gof-patterns/behavioral/strategy.md), [Factory](../../docs/02-gof-patterns/creational/factory.md), [Payment system](../../docs/05-real-world-scenarios/payment-system.md) |
| [`notification-adapter`](./notification-adapter/README.md) | [Adapter](../../docs/02-gof-patterns/structural/adapter.md), [Decorator](../../docs/02-gof-patterns/structural/decorator.md), [Notification system](../../docs/05-real-world-scenarios/notification-system.md) |
| [`checkout-chain`](./checkout-chain/README.md) | [Chain of Responsibility](../../docs/02-gof-patterns/behavioral/chain-of-responsibility.md), [Command](../../docs/02-gof-patterns/behavioral/command.md), [E-commerce checkout](../../docs/05-real-world-scenarios/ecommerce-checkout.md) |
| [`order-processing-state`](./order-processing-state/README.md) | [State](../../docs/02-gof-patterns/behavioral/state.md), [Domain Event](../../docs/04-enterprise-patterns/domain-event.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-repository-dto`](./order-repository-dto/README.md) | [Repository](../../docs/04-enterprise-patterns/repository.md), [DTO](../../docs/04-enterprise-patterns/dto.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-domain-event`](./order-domain-event/README.md) | [Domain Event](../../docs/04-enterprise-patterns/domain-event.md), [Command](../../docs/02-gof-patterns/behavioral/command.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-specification`](./order-specification/README.md) | [Specification](../../docs/04-enterprise-patterns/specification.md), [Repository](../../docs/04-enterprise-patterns/repository.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |

## Start With

- `payment-strategy` for policy selection and a small factory seam
- `notification-adapter` for external boundary translation and a lightweight decorator
- `checkout-chain` for ordered workflow steps and an explicit command boundary
- `order-processing-state` for lifecycle transitions and simple domain event recording
- `order-repository-dto` for repository boundaries and stable fulfillment payload mapping
- `order-domain-event` for decoupled follow-up reactions around an explicit business event
- `order-specification` for named business rules and repository-style filtering

## Intentional Gaps

The current Go set does not try to cover every document in the repository.

Still documentation-first:

- architecture guides such as layered, hexagonal, and modular monolith
- anti-pattern guides
- review checklists and introduction material

Examples should be added only where runnable code makes the pattern boundary more concrete than prose alone.
