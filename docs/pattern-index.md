# Pattern Index

This index is a navigation layer for the current repository state. It focuses on the patterns and guides that already exist, plus a smaller set of topics that are intentionally deferred.

## How To Use This Index

- Start with the decision guides if you know the problem but not the pattern name.
- Use the core pattern list when you already have a candidate abstraction.
- Use the scenario list when you want to see multiple patterns working together.
- Treat items marked `Planned later` as roadmap entries, not available guidance.

## Decision Guides

| Guide | Focus |
|---|---|
| [Choose by Problem](./01-decision-guides/choose-by-problem.md) | Start from a recurring problem such as provider switching or long workflow logic. |
| [Choose by Project Layer](./01-decision-guides/choose-by-project-layer.md) | Decide which patterns make sense in presentation, application, domain, infrastructure, or testing. |
| [Choose by Code Smell](./01-decision-guides/choose-by-code-smell.md) | Move from concrete code smells to candidate patterns or simpler fixes. |
| [Pattern vs Pattern](./01-decision-guides/pattern-vs-pattern.md) | Compare similar or commonly confused patterns. |

## Core Pattern Guides

| Pattern | Category | Primary Use |
|---|---|---|
| [Factory](./02-gof-patterns/creational/factory.md) | Creational | Hide object creation choices behind a stable entry point. |
| [Builder](./02-gof-patterns/creational/builder.md) | Creational | Construct complex objects step by step without telescoping constructors. |
| [Singleton](./02-gof-patterns/creational/singleton.md) | Creational | Control a single shared instance, only when process-wide state is genuinely required. |
| [Adapter](./02-gof-patterns/structural/adapter.md) | Structural | Isolate external or incompatible interfaces from your domain language. |
| [Decorator](./02-gof-patterns/structural/decorator.md) | Structural | Add behavior around an existing service without subclass explosion. |
| [Strategy](./02-gof-patterns/behavioral/strategy.md) | Behavioral | Switch behavior by rule, provider, or policy without large conditional blocks. |
| [Command](./02-gof-patterns/behavioral/command.md) | Behavioral | Represent an action as an object when invocation, queuing, or auditing matters. |
| [Chain of Responsibility](./02-gof-patterns/behavioral/chain-of-responsibility.md) | Behavioral | Break a workflow into ordered handlers when each step may pass work onward. |
| [State](./02-gof-patterns/behavioral/state.md) | Behavioral | Model lifecycle-driven behavior when allowed actions depend on the current stage of an object. |

## Extended Pattern Guides

| Pattern | Category | Primary Use |
|---|---|---|
| [Facade](./02-gof-patterns/structural/facade.md) | Structural | Simplify a repeated higher-level task over several collaborators. |
| [Domain Event](./04-enterprise-patterns/domain-event.md) | Enterprise | Capture meaningful business occurrences so follow-up behavior can react with less coupling. |
| [Repository](./04-enterprise-patterns/repository.md) | Enterprise | Provide a domain-relevant access boundary where retrieval and persistence rules matter. |
| [DTO](./04-enterprise-patterns/dto.md) | Enterprise | Make boundary data explicit when raw arrays or models create coupling. |
| [Specification](./04-enterprise-patterns/specification.md) | Enterprise | Name and compose reusable business criteria when rules drift across handlers and queries. |

## Runnable Example Coverage

The repository is primarily documentation-first, but selected guides now have small runnable counterparts under [examples/go](../examples/go/README.md) and [examples/typescript](../examples/typescript/README.md).

| Guide or Scenario | Runnable Example |
|---|---|
| [Factory](./02-gof-patterns/creational/factory.md) | [`payment-strategy`](../examples/go/payment-strategy/README.md) |
| [Strategy](./02-gof-patterns/behavioral/strategy.md) | [`payment-strategy`](../examples/go/payment-strategy/README.md) |
| [Adapter](./02-gof-patterns/structural/adapter.md) | [`notification-adapter`](../examples/go/notification-adapter/README.md) |
| [Decorator](./02-gof-patterns/structural/decorator.md) | [`notification-adapter`](../examples/go/notification-adapter/README.md) |
| [Command](./02-gof-patterns/behavioral/command.md) | [`checkout-chain` in Go](../examples/go/checkout-chain/README.md), [`checkout-chain` in TypeScript](../examples/typescript/checkout-chain/README.md), [`order-domain-event` in Go](../examples/go/order-domain-event/README.md), [`order-domain-event` in TypeScript](../examples/typescript/order-domain-event/README.md) |
| [Chain of Responsibility](./02-gof-patterns/behavioral/chain-of-responsibility.md) | [`checkout-chain` in Go](../examples/go/checkout-chain/README.md), [`checkout-chain` in TypeScript](../examples/typescript/checkout-chain/README.md) |
| [State](./02-gof-patterns/behavioral/state.md) | [`order-processing-state` in Go](../examples/go/order-processing-state/README.md), [`order-processing-state` in TypeScript](../examples/typescript/order-processing-state/README.md) |
| [Domain Event](./04-enterprise-patterns/domain-event.md) | [`order-domain-event`](../examples/go/order-domain-event/README.md), [`order-processing-state` in Go](../examples/go/order-processing-state/README.md), [`order-processing-state` in TypeScript](../examples/typescript/order-processing-state/README.md) |
| [Repository](./04-enterprise-patterns/repository.md) | [`order-repository-dto` in Go](../examples/go/order-repository-dto/README.md), [`order-repository-dto` in TypeScript](../examples/typescript/order-repository-dto/README.md), [`order-specification` in Go](../examples/go/order-specification/README.md), [`order-specification` in TypeScript](../examples/typescript/order-specification/README.md) |
| [DTO](./04-enterprise-patterns/dto.md) | [`order-repository-dto` in Go](../examples/go/order-repository-dto/README.md), [`order-repository-dto` in TypeScript](../examples/typescript/order-repository-dto/README.md) |
| [Specification](./04-enterprise-patterns/specification.md) | [`order-specification` in Go](../examples/go/order-specification/README.md), [`order-specification` in TypeScript](../examples/typescript/order-specification/README.md) |
| [Payment system](./05-real-world-scenarios/payment-system.md) | [`payment-strategy` in Go](../examples/go/payment-strategy/README.md), [`payment-strategy` in TypeScript](../examples/typescript/payment-strategy/README.md) |
| [Notification system](./05-real-world-scenarios/notification-system.md) | [`notification-adapter` in Go](../examples/go/notification-adapter/README.md), [`notification-adapter` in TypeScript](../examples/typescript/notification-adapter/README.md) |
| [E-commerce checkout](./05-real-world-scenarios/ecommerce-checkout.md) | [`checkout-chain` in Go](../examples/go/checkout-chain/README.md), [`checkout-chain` in TypeScript](../examples/typescript/checkout-chain/README.md) |
| [Order processing](./05-real-world-scenarios/order-processing.md) | [`order-processing-state` in Go](../examples/go/order-processing-state/README.md), [`order-processing-state` in TypeScript](../examples/typescript/order-processing-state/README.md), [`order-repository-dto` in Go](../examples/go/order-repository-dto/README.md), [`order-repository-dto` in TypeScript](../examples/typescript/order-repository-dto/README.md), [`order-domain-event` in Go](../examples/go/order-domain-event/README.md), [`order-domain-event` in TypeScript](../examples/typescript/order-domain-event/README.md), [`order-specification` in Go](../examples/go/order-specification/README.md), [`order-specification` in TypeScript](../examples/typescript/order-specification/README.md) |

Guides not listed here are currently documentation-only by design.

## Coverage Summary

| Coverage State | Topics |
|---|---|
| Runnable in Go and TypeScript | payment system, notification system, e-commerce checkout, state, repository, DTO, domain event, specification |
| Runnable in Go only | none in the current core example set |
| Docs only by design | architecture guides, anti-patterns, introduction material, checklists, several scenarios without a strong small-example fit yet |

## Architecture Guides

| Architecture | Primary Use |
|---|---|
| [Layered Architecture](./03-architecture-patterns/layered-architecture.md) | Use stable responsibility bands when consistent ownership matters more than feature slicing. |
| [Modular Monolith](./03-architecture-patterns/modular-monolith.md) | Keep one deployable application while enforcing stronger business-module boundaries. |
| [Hexagonal Architecture](./03-architecture-patterns/hexagonal-architecture.md) | Protect core logic from external systems when boundary pressure is high. |
| [Vertical Slice](./03-architecture-patterns/vertical-slice.md) | Organize by feature or use case when request-to-behavior traceability matters most. |

## Scenario Guides

| Scenario | Why It Matters |
|---|---|
| [Payment system](./05-real-world-scenarios/payment-system.md) | Shows provider switching, policy selection, and external isolation. |
| [Notification system](./05-real-world-scenarios/notification-system.md) | Shows channel-specific delivery, wrappers, and fallback behavior. |
| [E-commerce checkout](./05-real-world-scenarios/ecommerce-checkout.md) | Shows multi-step workflow coordination and validation flow. |
| [API client integration](./05-real-world-scenarios/api-client-integration.md) | Shows boundary protection and external failure handling basics. |
| [Multi-tenant SaaS](./05-real-world-scenarios/multi-tenant-saas.md) | Shows tenant context resolution, policy variation, and isolation-friendly service composition. |
| [Order processing](./05-real-world-scenarios/order-processing.md) | Shows lifecycle coordination, downstream reactions, and order-state boundaries after checkout. |
| [Admin panel / back-office actions](./05-real-world-scenarios/admin-panel.md) | Shows explicit admin commands, safe orchestration, and auditable operational workflows. |
| [File upload system](./05-real-world-scenarios/file-upload-system.md) | Shows storage boundaries, upload metadata contracts, and optional processing wrappers. |

## Planned Later

These topics are in the roadmap but intentionally outside the current MVP slice:

- `choose-by-domain.md`
- Runnable framework examples
- Generated catalog tooling

## Selection Rules

- Prefer the smallest abstraction that solves a recurring problem.
- If a simpler refactor works, do that first.
- A pattern is useful only when its trade-offs are acceptable in the project context.
- If you cannot explain `When Not to Use` a pattern, you probably should not introduce it yet.
