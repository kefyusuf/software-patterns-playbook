# Testing With Patterns

Use this guide when a design pattern changes how tests should be written, or when test doubles and mocks are starting to drive the design instead of clarify it.

## Testing Principle

Patterns should make tests more focused and easier to trust. If a pattern forces tests to mock many internal calls, the abstraction may be in the wrong place or too early.

## Test Double Decision Table

| Situation | Prefer | Why |
|---|---|---|
| External API behind an [Adapter](../02-gof-patterns/structural/adapter.md) | Fake adapter or contract tests | Keeps vendor behavior out of unit tests while preserving the internal contract. |
| Several [Strategy](../02-gof-patterns/behavioral/strategy.md) implementations | Real strategies with shared scenario cases | Proves each policy obeys the same business intent. |
| [Command](../02-gof-patterns/behavioral/command.md) handler orchestration | Handler tests with explicit command input | Keeps action boundaries visible without mocking the command object itself. |
| [Observer](../02-gof-patterns/behavioral/observer.md) or [Domain Event](../04-enterprise-patterns/domain-event.md) reactions | Assert emitted facts and key listeners separately | Avoids turning one use-case test into a full reaction graph. |
| [Repository](../04-enterprise-patterns/repository.md) boundary | In-memory fake for unit tests, integration test for persistence rules | Separates domain behavior from storage behavior. |
| Fixture-heavy setup | [Builder](../02-gof-patterns/creational/builder.md) or [Factory](../02-gof-patterns/creational/factory.md) | Keeps test data readable without global mutable helpers. |
| Shared algorithm skeleton through [Template Method](../02-gof-patterns/behavioral/template-method.md) | Base workflow test plus focused subclass variation tests | Proves the invariant order once and tests each variable step directly. |

## Mock, Fake, or Real Object

| Choice | Use When | Avoid When |
|---|---|---|
| Mock | You need to verify a boundary call, especially to an external collaborator. | You are mocking private implementation steps or every collaborator in a simple unit. |
| Fake | Many tests need a stable, lightweight replacement with real behavior. | The fake is more complex than the production boundary or drifts from its contract. |
| Real object | The object is deterministic, fast, and does not cross an expensive boundary. | The real object reaches network, clock, filesystem, database, queue, or global state. |

## Common Testing Smells

- The test knows the exact order of many internal method calls that are not business-visible.
- A mock returns data shaped differently from the real collaborator.
- A test helper hides important setup such as tenant, user role, currency, or lifecycle state.
- A pattern was introduced only to make mocking easier, but the production code became harder to read.

## Review Questions

- Does the test verify behavior at a meaningful boundary?
- Can the same test fail for a real business regression, not only for refactoring noise?
- Is the test double simpler than the dependency it replaces?
- Is at least one integration or contract test protecting important adapter or repository behavior?

## See Also

- [Choose by Project Layer](./choose-by-project-layer.md)
- [Pattern Review Checklist](../07-checklists/pattern-review-checklist.md)
- [Adapter](../02-gof-patterns/structural/adapter.md)
- [Repository](../04-enterprise-patterns/repository.md)
