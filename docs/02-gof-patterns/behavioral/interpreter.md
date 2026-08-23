---
title: Interpreter
category: behavioral
level: advanced
project_layers:
  - application
  - domain
related_patterns:
  - Visitor
  - Composite
  - Specification
---

# Interpreter

## One-Line Definition

Interpreter defines a tiny language as a grammar of classes and evaluates sentences of that language by walking the resulting tree, so rules users write become data your code executes.

## Problem

Business users need to express conditions themselves — discount eligibility, filter queries, alert triggers — and hard-coding each expression as `if/else` means a developer ships every wording tweak. Embedding raw strings and hand-parsing them ad hoc is worse: no validation, no reuse.

## Context

This appears where expressions are small, structured, and change often relative to the engine around them: promo rule editors, saved-search filters, pricing predicates.

## When to Use

- A genuinely small grammar (a handful of constructs) with stable semantics.
- Expressions are authored or edited frequently by non-developers.
- Evaluation must be embeddable in-process without external services.

## When Not to Use

- The grammar keeps growing; use a real parser toolkit instead of hand-rolled classes.
- Full SQL/JSONPath-level power is needed; adopt an existing library rather than rebuilding one.
- Rules change per release only — plain classes or the [Specification](../../04-enterprise-patterns/specification.md) pattern are simpler.
- Performance matters at scale; interpreters are slow compared to compiled predicates.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rule builder UIs producing expression trees. |
| Application | Evaluating saved filters or campaign predicates. |
| Domain | Pure expression evaluation against domain facts. |
| Infrastructure | Serializing/deserializing expression trees to storage. |
| Testing | Golden tests over sample sentences per grammar construct. |

## Real-World Examples

- A campaign editor builds "cart_total > 500 AND segment = 'vip'" trees evaluated at checkout.
- A ticketing tool stores user-defined filter expressions for queue views.
- An alerting module interprets threshold rules written by operations staff.

## Code Smell Before the Pattern

The smell is rule text parsed by scattered string surgery:

```php
$expr = 'total>500 AND vip';
foreach (explode(' AND ', $expr) as $clause) {
    [$field, $value] = explode('>', trim($clause)); // breaks on >=, quotes, nesting…
}
```

Every operator addition rewrites fragile parsing in multiple places.

## Minimal Example

```php
interface Expr { public function eval(array $ctx): bool; }

final class Gt implements Expr {
    public function __construct(private string $field, private int $value) {}
    public function eval(array $ctx): bool { return $ctx[$this->field] > $this->value; }
}

final class And implements Expr {
    public function __construct(private Expr $l, private Expr $r) {}
    public function eval(array $ctx): bool { return $this->l->eval($ctx) && $this->r->eval($ctx); }
}

// sentence: total > 500 AND vip == true
$rule = new And(new Gt('total', 500), new VipCheck());
$rule->eval(['total' => 750, 'vip' => true]);
```

Each construct validates itself once; composition is type-checked by construction.

## Trade-Offs

| Benefit | Cost |
|---|---|
| New sentences need no code changes | Grammar classes must be built and maintained |
| Expressions validate structurally before running | Interpreting trees is slower than native code |
| Trees serialize, diff, and version nicely | Hand-written parsers grow hairy beyond toy grammars |

## Related Patterns

- Composite because expression trees *are* composites; interpreter adds evaluation semantics.
- Visitor when many operations (validate, explain, optimize) run over the same grammar.
- Specification for named, composable predicates that developers — not end users — author.

## Common Mistakes

- Letting the DSL creep toward a programming language (variables, loops) inside class-per-rule code.
- Skipping serialization/versioning, then breaking every stored rule on schema change.
- Ignoring injection surface: expressions evaluating arbitrary fields can leak data if fields come from user input.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
