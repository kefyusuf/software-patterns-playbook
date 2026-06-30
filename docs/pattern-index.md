# Pattern Index

This index is a navigation layer for the MVP. It focuses on the patterns and guides that currently exist or are explicitly planned for the first documentation slices.

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

## MVP Core Patterns

| Pattern | Category | Primary Use |
|---|---|---|
| Factory | Creational | Hide object creation choices behind a stable entry point. |
| Builder | Creational | Construct complex objects step by step without telescoping constructors. |
| Singleton | Creational | Control a single shared instance, only when process-wide state is genuinely required. |
| Adapter | Structural | Isolate external or incompatible interfaces from your domain language. |
| Decorator | Structural | Add behavior around an existing service without subclass explosion. |
| Strategy | Behavioral | Switch behavior by rule, provider, or policy without large conditional blocks. |
| Command | Behavioral | Represent an action as an object when invocation, queuing, or auditing matters. |
| Chain of Responsibility | Behavioral | Break a workflow into ordered handlers when each step may pass work onward. |

## MVP Real-World Scenarios

| Scenario | Why It Matters |
|---|---|
| Payment system | Shows provider switching, policy selection, and external isolation. |
| Notification system | Shows channel-specific delivery, wrappers, and fallback behavior. |
| E-commerce checkout | Shows multi-step workflow coordination and validation flow. |
| API client integration | Shows boundary protection and external failure handling basics. |

## Planned Later

These topics are in the roadmap but intentionally outside the current MVP slice:

- `choose-by-domain.md`
- Facade
- Observer / Domain Event
- State
- Repository
- DTO
- Specification
- Multi-tenant SaaS scenario
- Runnable framework examples
- Generated catalog tooling

## Selection Rules

- Prefer the smallest abstraction that solves a recurring problem.
- If a simpler refactor works, do that first.
- A pattern is useful only when its trade-offs are acceptable in the project context.
- If you cannot explain `When Not to Use` a pattern, you probably should not introduce it yet.
