# TypeScript Examples

This directory contains small, framework-free TypeScript examples that support the documentation by showing application boundaries, interfaces, and transport-friendly shapes in plain code.

The examples are intentionally minimal:

- one focused pattern or pattern combination per example
- no framework dependency
- strict TypeScript compilation
- runnable with built-in Node.js tooling after compilation

## Coverage Map

| Example | Primary Docs |
|---|---|
| [`payment-strategy`](./payment-strategy/README.md) | [Strategy](../../docs/02-gof-patterns/behavioral/strategy.md), [Factory](../../docs/02-gof-patterns/creational/factory.md), [Payment system](../../docs/05-real-world-scenarios/payment-system.md) |
| [`notification-adapter`](./notification-adapter/README.md) | [Adapter](../../docs/02-gof-patterns/structural/adapter.md), [Decorator](../../docs/02-gof-patterns/structural/decorator.md), [Notification system](../../docs/05-real-world-scenarios/notification-system.md) |
| [`checkout-chain`](./checkout-chain/README.md) | [Chain of Responsibility](../../docs/02-gof-patterns/behavioral/chain-of-responsibility.md), [Command](../../docs/02-gof-patterns/behavioral/command.md), [E-commerce checkout](../../docs/05-real-world-scenarios/ecommerce-checkout.md) |
| [`order-processing-state`](./order-processing-state/README.md) | [State](../../docs/02-gof-patterns/behavioral/state.md), [Domain Event](../../docs/04-enterprise-patterns/domain-event.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-repository-dto`](./order-repository-dto/README.md) | [Repository](../../docs/04-enterprise-patterns/repository.md), [DTO](../../docs/04-enterprise-patterns/dto.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-specification`](./order-specification/README.md) | [Specification](../../docs/04-enterprise-patterns/specification.md), [Repository](../../docs/04-enterprise-patterns/repository.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |
| [`order-domain-event`](./order-domain-event/README.md) | [Domain Event](../../docs/04-enterprise-patterns/domain-event.md), [Command](../../docs/02-gof-patterns/behavioral/command.md), [Order processing](../../docs/05-real-world-scenarios/order-processing.md) |

## Tooling

Build all examples:

```bash
tsc -p examples/typescript/tsconfig.json
```

Run the current examples:

```bash
node examples/typescript/dist/payment-strategy/main.js
node examples/typescript/dist/notification-adapter/main.js
node examples/typescript/dist/checkout-chain/main.js
node examples/typescript/dist/order-processing-state/main.js
node examples/typescript/dist/order-repository-dto/main.js
node examples/typescript/dist/order-specification/main.js
node examples/typescript/dist/order-domain-event/main.js
```

Run the current tests:

```bash
node examples/typescript/dist/payment-strategy/payment.test.js
node examples/typescript/dist/notification-adapter/notification/notification.test.js
node examples/typescript/dist/checkout-chain/checkout/pipeline.test.js
node examples/typescript/dist/order-processing-state/order/order.test.js
node examples/typescript/dist/order-repository-dto/order/service.test.js
node examples/typescript/dist/order-specification/order/specification.test.js
node examples/typescript/dist/order-domain-event/order/service.test.js
```

## Intentional Gaps

The TypeScript set is starting smaller than the Go set.

Current focus:

- app-boundary examples
- interface-heavy examples
- event and orchestration examples
- typed translation boundaries
- transport-friendly DTO boundaries
- named rule composition

Current language role:

- best fit for interface-heavy boundaries and transport-shape examples
- now also covers workflow-chain and lifecycle examples where parity adds learning value

Later additions can fill in broader parity where that adds learning value instead of duplication.
