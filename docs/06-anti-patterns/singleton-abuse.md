---
title: Singleton Abuse
category: code-organization
related_patterns:
  - Factory
---

# Singleton Abuse

## Definition

Singleton Abuse happens when process-wide global access is used as a convenience pattern for ordinary application services or mutable state.

## Symptoms

- Business services expose `instance()` or static accessors.
- Tests fail depending on run order because global state is shared.
- Request-specific state is stored in globally reachable objects.

## Why It Happens

Global access feels simpler than explicit dependency injection. It removes constructor wiring in the short term and hides lifetime choices from the caller.

## Why It Is Harmful

It damages test isolation, hides dependencies, and makes multi-request or multi-tenant behavior harder to reason about. It also blocks later refactoring because the whole codebase depends on implicit state.

## Before Example

Checkout, notification, and config services all call `SomeService::instance()` directly from anywhere.

## Better Alternatives

- Use dependency injection with explicit lifetimes.
- Pass collaborators through constructors or well-scoped factories.
- Keep shared resources narrow and infrastructure-focused if they must exist once.

## Refactoring Path

1. Replace direct singleton access with injected interfaces in one boundary at a time.
2. Move mutable state into scoped services or request context.
3. Reserve process-wide uniqueness for rare infrastructure resources with explicit justification.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?
