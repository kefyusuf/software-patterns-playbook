---
title: Flyweight
category: structural
level: advanced
project_layers:
  - infrastructure
  - domain
related_patterns:
  - Prototype
  - Singleton
  - Proxy
---

# Flyweight

## One-Line Definition

Flyweight shares immutable, repeated state across many fine-grained objects so memory scales with *distinct data* instead of *object count*.

## Problem

A domain needs millions of similar objects — glyphs in a document, particles in a simulation, tiles on a map — and most of each object is identical. Storing the identical part once per instance exhausts memory long before business limits are reached.

## Context

This is a performance-driven pattern for high-count, small-grained objects. It trades object identity and simplicity for footprint, so it belongs where profiling — not speculation — proves the cost.

## When to Use

- Profiling shows memory pressure from huge counts of similar objects.
- The shared part (intrinsic state) is immutable; the unique part (extrinsic) can be passed in per use.
- Distinct values are far fewer than total instances.

## When Not to Use

- Object count is thousands, not millions; normal design wins.
- "Shared" state mutates; sharing then spreads bugs everywhere.
- You need per-instance identity, locking, or lifecycle.
- A database view, string interning, or a plain lookup table already solves it.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Glyph, sprite, or icon sharing in renderers. |
| Application | Rare; occasionally pooled template objects. |
| Domain | Only for genuinely massive aggregate sets (maps, meshes). |
| Infrastructure | Connection-agnostic config objects, parsed schema reuse, pools. |
| Testing | Verifying share counts rather than behavior specifics. |

## Real-World Examples

- A text editor keeps one glyph object per character *kind*; positions live in the layout, not the glyph.
- A map renderer shares one "pine tree" mesh/texture descriptor among ten thousand placements.
- A pricing engine interns currency and country descriptors referenced by millions of price rows.

## Code Smell Before the Pattern

The smell is heavyweight state duplicated per instance:

```php
final class MapTile
{
    public function __construct(
        public readonly string $texturePath = '/assets/tile/grass.png', // 40 bytes
        public readonly array $palette = [/* 200 entries */],           // ~2 KB
        public readonly array $collision = [/* 100 bools */],           // ~1 KB
        public readonly int $x,
        public readonly int $y,
    ) {}
}
// one million tiles ≈ 3 GB of identical arrays
```

## Minimal Example

```php
final class TileType // flyweight: shared, immutable
{
    /** @param list<string> $palette */
    private function __construct(
        public readonly string $texturePath,
        public readonly array $palette,
    ) {}

    private static array $cache = [];

    public static function of(string $kind): self
    {
        return self::$cache[$kind] ??= new self(
            "/assets/tile/{$kind}.png",
            PaletteLoader::for($kind),
        );
    }
}

final class TilePlacement // extrinsic state only
{
    public function __construct(
        public readonly TileType $type,
        public readonly int $x,
        public readonly int $y,
    ) {}
}

$tile = new TilePlacement(TileType::of('grass'), 12, 7);
```

One million placements now reference a handful of `TileType` instances.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Memory drops from O(instances) to O(distinct kinds) | Two-state split complicates every consumer |
| Cache invalidation disappears when state is immutable | Identity semantics change: two tiles may be `==` but not same object |
| Enables counts that were previously impossible | Factory/cache must be thread-safe under concurrency |

## Related Patterns

- Prototype copies configured templates; Flyweight *shares* one template instead of copying.
- Singleton is essentially one global flyweight; prefer scoped flyweight caches.
- Proxy can front a flyweight cache to add lazy loading or pooling.

## Common Mistakes

- Sharing mutable state and corrupting every logical instance at once.
- Applying the pattern without a profiler justifying it.
- Letting extrinsic context creep back into the shared object "just for convenience".

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
