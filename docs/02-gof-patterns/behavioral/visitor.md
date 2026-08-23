---
title: Visitor
category: behavioral
level: advanced
project_layers:
  - application
  - domain
  - infrastructure
related_patterns:
  - Composite
  - Iterator
  - Interpreter
---

# Visitor

## One-Line Definition

Visitor lets you add new operations to a stable object structure by defining the operation once per node type, without editing any of the node classes.

## Problem

A fixed structure — AST, document model, export tree — keeps gaining *operations* (validate, export, count, lint) while its node types rarely change. Adding each operation as methods on every node bloats classes with unrelated concerns and forces recompiles everywhere.

## Context

This is a structure-versus-operation trade-off tool: ideal when the type set is stable but operations keep growing, painful in the opposite situation.

## When to Use

- Node types are stable; new operations over them arrive regularly.
- Related operation logic should live together in one class instead of scattered across nodes.
- Traversal plus per-type behavior must stay coordinated (double dispatch).

## When Not to Use

- Node types change often; each addition edits every visitor.
- There are one or two simple operations; plain methods or a match statement suffice.
- The hierarchy is shallow and heterogeneous behavior is small — [Iterator](./iterator.md) plus conditionals is lighter.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rendering or serializing document trees. |
| Application | Export pipelines walking report models. |
| Domain | Validation passes across rule/AST structures. |
| Infrastructure | Code generators, linters, migration analyzers. |
| Testing | Each visitor tested against a fixture tree independently. |

## Real-World Examples

- A template engine's parser output visited by an HTML renderer, minifier, and i18n extractor.
- A pricing rules tree visited by a validator, an explainer, and an executor.
- Static analysis: one AST, many visitors (unused-variable finder, complexity counter).

## Code Smell Before the Pattern

The smell is operations smeared across nodes:

```php
final class PriceRuleNode
{
    public function validate(): bool { /* rule logic */ }
    public function toExplainText(): string { /* explanation */ }
    public function toSql(): string { /* sql */ }
    // every new operation edits every node class
}
```

Node classes become grab-bags of unrelated capabilities.

## Minimal Example

```php
interface RuleNode { public function accept(RuleVisitor $v): mixed; }
final class AndRule implements RuleNode {
    public function __construct(public readonly RuleNode $a, public readonly RuleNode $b) {}
    public function accept(RuleVisitor $v): mixed { return $v->visitAnd($this); }
}
final class PriceAbove implements RuleNode {
    public function __construct(public readonly int $amount) {}
    public function accept(RuleVisitor $v): mixed { return $v->visitPriceAbove($this); }
}

interface RuleVisitor
{
    public function visitAnd(AndRule $r): mixed;
    public function visitPriceAbove(PriceAbove $r): mixed;
}

final class ExplainVisitor implements RuleVisitor
{
    public function visitAnd(AndRule $r): mixed
    {
        return '(' . $r->a->accept($this) . ' AND ' . $r->b->accept($this) . ')';
    }
    public function visitPriceAbove(PriceAbove $r): mixed
    {
        return "price > {$r->amount}";
    }
}
```

`accept` performs double dispatch so the correct `visit*` runs despite PHP's single dispatch.

## Trade-Offs

| Benefit | Cost |
|---|---|
| New operations = new class; nodes untouched | New node types touch every visitor |
| Operation logic grouped and testable in one place | Double-dispatch indirection confuses newcomers |
| Traversal order controlled centrally | Visitor signatures couple to all node shapes |

## Related Patterns

- Composite supplies the tree structures visitors typically walk.
- Interpreter builds evaluation into the structure itself when grammar, not operations, is the point.
- Iterator walks generically; visitor binds behavior per concrete type during the walk.

## Common Mistakes

- Applying Visitor to volatile hierarchies where nodes appear monthly.
- Letting visitors mutate nodes mid-walk with no traversal contract.
- Writing one mega-visitor implementing five concerns instead of focused visitors.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
