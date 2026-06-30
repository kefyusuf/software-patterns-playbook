# How To Read This Repository

This repository is meant to be used by problem shape, not by pattern loyalty.

## Recommended Path

1. Start with the [decision guides](../01-decision-guides) if you know the problem but not the pattern name.
2. Read the [pattern guides](../02-gof-patterns) when you want trade-offs, placement, and misuse warnings.
3. Read a [scenario guide](../05-real-world-scenarios) when you want to see multiple patterns working together.
4. Read the [anti-pattern guides](../06-anti-patterns) when a design feels overbuilt or unclear.

## Use It During Real Work

- Before implementing a new abstraction
- During architecture review
- During pull request review
- When refactoring a growing service or integration boundary

## Suggested Starting Points

- If the problem is provider mismatch, start with [Adapter](../02-gof-patterns/structural/adapter.md) and [API Client Integration](../05-real-world-scenarios/api-client-integration.md).
- If the problem is workflow sprawl, start with [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md), [Command](../02-gof-patterns/behavioral/command.md), and [E-commerce Checkout](../05-real-world-scenarios/ecommerce-checkout.md).
- If the problem is overbuilt abstraction, start with [Pattern for Pattern's Sake](../06-anti-patterns/pattern-for-patterns-sake.md) and [God Service](../06-anti-patterns/god-service.md).

## What To Ignore

Do not treat roadmap items or future slices as mandatory architecture for your project. Use only the parts that solve the current problem.
