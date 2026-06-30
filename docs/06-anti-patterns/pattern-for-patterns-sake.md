---
title: Pattern for Pattern's Sake
category: architecture
related_patterns:
  - Strategy
  - Factory
---

# Pattern for Pattern's Sake

## Definition

Pattern for Pattern's Sake is the habit of introducing a named pattern because it sounds correct or advanced, even though the code does not yet have the recurring pressure that justifies it.

## Symptoms

- A simple flow is split into many types without a concrete maintenance benefit.
- The team can name the pattern but cannot explain the real problem it solves.
- New abstractions appear before duplication, variation, or coupling are actually visible.

## Why It Happens

Teams often want code to look architected. Books, conference talks, and interview preparation can make named patterns feel safer than small explicit code.

## Why It Is Harmful

It raises the cost of reading and changing the code while solving little or nothing. Developers inherit more files, more indirection, and weaker signal about where real complexity lives.

## Before Example

A service with one conditional becomes a full Strategy family before a second real variation exists.

## Better Alternatives

- Keep the logic local until the pressure repeats.
- Extract small functions before extracting named pattern objects.
- Write down the expected future variation and wait until it becomes real.

## Refactoring Path

1. Identify which abstraction exists only for speculative flexibility.
2. Collapse unnecessary indirection back into explicit code.
3. Reintroduce a pattern only after repeated pressure is visible.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?

## Related Reading

- [Choose by Problem](../01-decision-guides/choose-by-problem.md)
- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
- [Factory](../02-gof-patterns/creational/factory.md)
- [Strategy](../02-gof-patterns/behavioral/strategy.md)
