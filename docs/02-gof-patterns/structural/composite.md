---
title: Composite
category: structural
level: intermediate
project_layers:
  - application
  - domain
  - presentation
related_patterns:
  - Iterator
  - Decorator
  - Visitor
---

# Composite

## One-Line Definition

Composite composes objects into tree structures and lets callers treat individual items and whole groups through one interface, so recursion lives inside the structure instead of at every call site.

## Problem

Code that must handle "an item or a basket of items" keeps branching on whether it received a single element or a collection. Grouping rules — bundles containing sub-bundles, categories with subcategories, teams with sub-teams — leak `instanceof` and loop logic into every consumer.

## Context

This appears in hierarchical domains: file systems, organization charts, product bundles, permission trees, UI component trees, pricing rules that nest.

## When to Use

- A part–whole hierarchy exists where groups can contain items *and other groups*, recursively.
- Callers should run the same operation over a leaf or a whole subtree.
- New group types should not require editing every consumer.

## When Not to Use

- The hierarchy is only two levels deep; plain arrays of items are clearer.
- Leaves and groups genuinely have different contracts; forcing one interface produces empty or exception-throwing methods on leaves.
- The tree is really a graph (nodes with multiple parents); Composite does not model sharing.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Component trees rendered recursively. |
| Application | Bundle pricing, order lines containing nested bundles. |
| Domain | Category trees, org structures, permission hierarchies. |
| Infrastructure | File/folder abstractions, menu configuration trees. |
| Testing | Building small in-memory trees to verify aggregate operations. |

## Real-World Examples

- A checkout prices a cart where a "gift set" bundle contains products and another discounted bundle.
- A CMS renders a navigation tree where every node — link, section, external group — answers `render()`.
- An IAM check walks a permission tree: roles contain permissions and nested roles.

## Code Smell Before the Pattern

The smell is type checks and duplicated recursion at call sites:

```php
function totalPrice(array $items): int
{
    $sum = 0;
    foreach ($items as $item) {
        if ($item instanceof Bundle) {
            foreach ($item->children() as $child) {
                $sum += isBundle($child) ? totalPrice([$child]) : $child->price();
            }
        } else {
            $sum += $item->price();
        }
    }
    return $sum;
}
```

Every operation — pricing, listing, validation — repeats this shape.

## Minimal Example

```php
interface CartComponent
{
    public function total(): int;
}

final class Product implements CartComponent
{
    public function __construct(private readonly int $price) {}
    public function total(): int { return $this->price; }
}

final class Bundle implements CartComponent
{
    /** @param CartComponent[] $children */
    public function __construct(private readonly array $children) {}

    public function total(): int
    {
        return array_reduce(
            $this->children,
            fn(int $sum, CartComponent $c): int => $sum + $c->total(),
            0,
        );
    }
}
```

Callers ask any node for `total()`; nesting depth stops mattering.

## Trade-Offs

| Benefit | Cost |
|---|---|
| One interface for leaf and group ends the type-check sprawl | Leaf/group contract compromises (e.g., `add()` on leaves) |
| New operations flow through existing structure | Traversal order and cycles need explicit rules |
| Recursion is written once, inside the tree | Deep trees can be harder to debug than flat loops |

## Related Patterns

- Iterator exposes traversal without exposing the tree; Composite defines the tree being walked.
- Decorator wraps one child to add behavior; Composite owns many children to represent aggregation.
- Visitor when many operations must be added across the same stable structure without editing node classes.

## Common Mistakes

- Giving leaves mutation methods (`addChild`) that can only throw or no-op.
- Allowing parent references to create cycles without a guard.
- Forcing one giant component interface when two small ones would keep leaves honest.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
