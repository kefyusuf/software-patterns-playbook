---
title: Golden Hammer
category: code-organization
related_patterns:
  - Strategy
  - Adapter
  - Facade
---

# Golden Hammer

## Definition

Golden Hammer is treating one favored pattern, library, or architecture as the answer to every problem — "when all you have is a hammer, everything looks like a nail" applied to design decisions.

## Symptoms

- Every new requirement is solved by adding another instance of last quarter's pattern.
- A microservices migration, CQRS split, or event-driven rewrite appears in proposals regardless of problem shape.
- Simpler options (a function, a column, a config flag) are dismissed without analysis.
- Code reviews debate pattern purity more than the actual business risk.

## Why It Happens

Pattern familiarity compounds: the recently learned tool dominates the solution space. Resume-driven development and sunk-cost on prior investments reinforce it. Teams also inherit "house styles" that once solved real problems and outlived their context.

## Why It Is Harmful

Misapplied patterns add indirection without removing any coupling — complexity goes up, not down. The hammer hides simpler solutions that would ship faster and break less. Worst of all, overuse discredits the pattern itself, so when the right case finally arrives, nobody believes in it.

## Before Example

```php
// requirement: show total price with VAT on one screen

final class VatTotalQueryBusHandler // ...a bus, a handler, a pipeline...
{
    public function __construct(
        private CommandBus $bus,
        private EventDispatcher $events,
        private CacheLayer $cache,
    ) {}

    public function handle(VatTotalQuery $q): VatTotalResult
    {
        return $this->cache->remember($q, fn() =>
            $this->bus->dispatch($q));
    }
}
// four abstractions for: $total * 1.20
```

## Better Alternatives

- Ask the repository's first question first: what recurring *problem* justifies structure?
- Reach for the smallest tool: inline expression now; extract when it recurs.
- Match pattern to pressure: [Strategy](../02-gof-patterns/behavioral/strategy.md) needs *real* variation; [Facade](../02-gof-patterns/structural/facade.md) needs repeated multi-collaborator tasks; neither needs a single use.

## Refactoring Path

1. For each hammer instance, write the concrete problem it solves; delete those with no honest answer.
2. Inline single-use wrappers back into callers.
3. Keep the genuinely recurring cases; document why each remaining pattern earns its place.

## Review Checklist

- [ ] Is this abstraction solving a real problem?
- [ ] Is global state or pass-through indirection increasing coupling?
- [ ] Would a simpler structure be easier to test and maintain?
