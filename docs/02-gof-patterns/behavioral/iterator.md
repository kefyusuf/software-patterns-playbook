---
title: Iterator
category: behavioral
level: beginner-to-intermediate
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - Composite
  - Generator
  - Strategy
---

# Iterator

## One-Line Definition

Iterator exposes sequential access to the elements of a collection without exposing its internal representation, letting callers traverse lists, trees, cursors, or remote pages with one uniform `next` contract.

## Problem

Callers reach into a collection's internals — array indexes, tree nodes, cursor fields — to walk it. The moment storage changes from array to tree, or results start arriving paginated from an API, every traversal site breaks.

## Context

Modern languages ship iterators everywhere (PHP `Iterator`/generators, Go ranges, TS `Iterable`), so the pattern matters most for *custom* collections, domain collections with invariants, and heterogeneous sources that must look identical to callers.

## When to Use

- A domain collection hides a non-trivial structure (tree, graph, priority queue).
- Traversal must unify several sources: memory, database cursor, HTTP pagination.
- Multiple independent traversals must run over one collection without interfering.
- You want lazy streaming so large sets never materialize at once.

## When Not to Use

- A plain array with `foreach` already does the job; wrapping it adds nothing.
- The "collection" is really a query result; a repository returning arrays/generators is simpler.
- You need random access and indexing semantics, not sequential traversal.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Streaming rows into tables or exports without buffering all. |
| Application | Unified iteration over merged sources. |
| Domain | Aggregate roots exposing controlled traversal of their children. |
| Infrastructure | Cursor/pagination wrappers around DB or API results. |
| Testing | Deterministic fake iterators for boundary tests. |

## Real-World Examples

- An invoice aggregate exposes its lines through an iterator that keeps them internally consistent.
- An export job iterates millions of orders as a generator fetching page by page.
- A permission walker yields effective roles across a nested group tree.

## Code Smell Before the Pattern

The smell is internal structure leaking into callers:

```php
foreach ($order->getLines() as $line) { // returns the raw private array
    if ($line['type'] === 'bundle') {
        foreach ($line['children'] ?? [] as $child) { // knows nesting shape
        }
    }
}
```

Change the line storage once and every consumer edits.

## Minimal Example

```php
final class Order implements \IteratorAggregate
{
    /** @param OrderLine[] $lines */
    public function __construct(private array $lines) {}

    public function getIterator(): \Generator
    {
        foreach ($this->lines as $line) {
            if ($line->isBundle()) {
                yield from $line->children(); // nesting stays inside
                continue;
            }
            yield $line;
        }
    }
}

foreach ($order as $line) {
    $total += $line->price();
}
```

The aggregate owns its shape; callers see a flat stream of `OrderLine`.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Storage changes stop rippling into consumers | One more abstraction per custom collection |
| Lazy traversal scales past memory limits | Generators cannot be rewound; re-iteration needs care |
| Uniform contract across wildly different sources | Debugging lazy chains is less direct than loops |

## Related Patterns

- Composite defines tree structures whose natural walk is an iterator.
- Strategy in miniature: swapping traversal order (depth-first vs breadth-first) behind one interface.
- Repository commonly returns iterators instead of arrays for large result sets.

## Common Mistakes

- Wrapping plain arrays in iterator classes with zero added invariant.
- Sharing one cursor across concurrent traversals.
- Yielding mutable internal objects and letting callers corrupt the collection.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
