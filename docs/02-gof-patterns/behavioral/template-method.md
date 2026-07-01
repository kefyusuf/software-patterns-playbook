---
title: Template Method
category: behavioral
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
  - testing
related_patterns:
  - Strategy
  - State
  - Chain of Responsibility
---

# Template Method

## One-Line Definition

Template Method defines the fixed skeleton of an algorithm in one place while allowing selected steps to vary in subclasses.

## Problem

Several workflows have the same order of operations but differ in a few steps. Copying the full workflow spreads sequencing rules across classes, while fully separate implementations make shared invariants easy to break.

## Context

This appears in import jobs, report generation, approval workflows, test fixture setup, framework hooks, and background tasks where the overall sequence is stable but specific validation, transformation, or persistence steps vary.

## When to Use

- The workflow order is stable and important.
- Most steps are shared, but a few steps vary by subtype.
- Subclasses should not be allowed to reorder the core algorithm.

## When Not to Use

- The variation is better represented by injected strategies or callbacks.
- Subclasses share little behavior beyond similar names.
- The base class would need many optional hooks, flags, or empty methods to support every case.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; sometimes in reusable controller or view rendering hooks. |
| Application | Import, export, approval, or job workflows with stable sequencing. |
| Domain | Limited; only when the algorithm skeleton expresses domain rules. |
| Infrastructure | Framework integrations, adapters, or processing pipelines with required steps. |
| Testing | Shared test setup or contract tests where each implementation supplies the variable step. |

## Real-World Examples

- A file import job always reads, validates, maps, and persists rows, but each file type supplies parsing and mapping rules.
- A report generator always loads data, formats rows, and writes output, but the output format varies.
- A contract test suite defines required behavior once while each adapter supplies its concrete client.

## Code Smell Before the Pattern

The smell is duplicated workflow shape with small differences:

```php
$rows = $csvReader->read($path);
foreach ($rows as $row) {
    $validator->validate($row);
    $orders->save($mapper->map($row));
}
```

Another importer repeats the same sequence but changes the reader and mapper. The workflow order can now drift.

## Minimal Example

```php
abstract class ImportJob
{
    final public function run(string $path): void
    {
        foreach ($this->readRows($path) as $row) {
            $this->validate($row);
            $this->persist($this->map($row));
        }
    }

    abstract protected function readRows(string $path): array;

    protected function validate(array $row): void
    {
        // shared validation hook
    }

    abstract protected function map(array $row): object;

    abstract protected function persist(object $record): void;
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Keeps workflow order explicit and protected | Couples variations through inheritance |
| Reduces duplicated sequencing logic | Can become rigid when variation grows in many directions |
| Makes shared invariants easier to test once | Hooks may become unclear if the base class tries to support too much |

## Related Patterns

- Strategy when variation should be composed at runtime instead of inherited.
- State when behavior changes because an object moves through lifecycle stages.
- Chain of Responsibility when the workflow should be assembled from reorderable handlers.

## Common Mistakes

- Using inheritance when a small injected strategy would be clearer.
- Adding many optional hooks until the template no longer communicates the real workflow.
- Letting subclasses override the algorithm skeleton that was supposed to stay stable.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
