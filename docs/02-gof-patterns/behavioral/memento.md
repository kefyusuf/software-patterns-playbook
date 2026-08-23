---
title: Memento
category: behavioral
level: intermediate
project_layers:
  - application
  - domain
related_patterns:
  - Command
  - Prototype
  - State
---

# Memento

## One-Line Definition

Memento captures an object's state as a snapshot at a moment in time so it can be restored later, without the originator exposing its internals to outsiders.

## Problem

Undo, drafts, and rollback need a way to freeze and restore state. Naive approaches either expose private fields through getters for anyone who wants to copy them, or scatter serialization logic across every caller.

## Context

This appears in multi-step forms and wizards, editors with undo stacks, draft content workflows, and long-running processes that must resume from a checkpoint after failure.

## When to Use

- Users or processes need explicit save/restore points (undo, drafts, checkpoints).
- State must be captured without breaking encapsulation of the owning object.
- Snapshots are taken infrequently enough that storing full copies is acceptable.

## When Not to Use

- Every change should be auditable history — event-style records (see Domain Event) beat silent snapshots.
- Undo can be recomputed by inverse operations; Command-based undo stores actions instead of state.
- State is large; deltas or event sourcing are cheaper than full copies.
- The "restore" is really persistence — a repository already does that job.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Wizard/form snapshots for back-navigation. |
| Application | Draft management, workflow checkpoints. |
| Domain | Originator-owned snapshot creation keeping invariants intact. |
| Infrastructure | Snapshot storage (session, cache) when mementos persist. |
| Testing | Asserting round-trip restore behavior deterministically. |

## Real-World Examples

- A listing wizard lets users jump back three steps with every field exactly as left.
- A document editor keeps an undo stack of content snapshots per operation.
- A game saves checkpoints by snapshotting world state before boss encounters.

## Code Smell Before the Pattern

The smell is encapsulation punctured for copying:

```php
final class ListingDraft
{
    public function getState(): array // exposes every internal field
    {
        return get_object_vars($this);
    }

    public function setState(array $state): void // no validation, no invariants
    {
        foreach ($state as $k => $v) {
            $this->$k = $v;
        }
    }
}
```

Any code can now inject invalid states; invariants exist only on paper.

## Minimal Example

```php
final class ListingDraft
{
    public function __construct(
        private string $title = '',
        private array $prices = [],
    ) {}

    public function edit(string $title, int $price): void
    {
        $this->title   = $title;
        $this->prices[] = $price;
    }

    public function snapshot(): Memento { return new Memento($this->title, $this->prices); }

    public function restore(Memento $m): void
    {
        $this->title  = $m->title;
        $this->prices = $m->prices;
    }
}

final class Memento // opaque token: read only by its originator
{
    public function __construct(
        public readonly string $title,
        public readonly array $prices,
    ) {}
}

// caretaker keeps history without knowing field details
$history = [];
$history[] = $draft->snapshot();
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Encapsulation survives: only the originator understands snapshots | Full copies cost memory for large states |
| Undo/restore is trivially correct | Frequent snapshots add allocation pressure |
| Caretaker stays dumb — no field knowledge | Snapshot format couples to originator's internals over time |

## Related Patterns

- Command stores *operations* for undo; Memento stores *state* — choose based on whether actions or data are cheap to keep.
- Prototype clones toward creating new objects; Memento freezes one object's past.
- State governs current behavior transitions; Memento ignores behavior, preserving data only.

## Common Mistakes

- Letting caretakers read or mutate memento fields, recreating the leak the pattern prevents.
- Snapshotting objects holding connections or clocks instead of pure data.
- Storing unbounded undo histories in long-lived sessions.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
