---
title: Prototype
category: creational
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
  - testing
related_patterns:
  - Builder
  - Factory
  - Memento
---

# Prototype

## One-Line Definition

Prototype creates new objects by copying an existing, fully configured instance instead of building one from scratch, keeping expensive setup and sensible defaults in one place.

## Problem

Some objects are costly or fiddly to construct: many fields with business-approved defaults, deep nested configuration, or data loaded from remote sources. Constructing each variant by hand duplicates that setup, and the copies drift apart as defaults evolve.

## Context

This appears wherever templates make sense — fixture builders, prefilled documents, campaign configurations, simulation entities — and where construction cost (parsing, I/O, validation) dominates.

## When to Use

- Many valid variants differ from a common template by only a few fields.
- Construction is measurably expensive and results are largely reusable.
- Default values live in code owned by one team and must not be duplicated at call sites.

## When Not to Use

- Objects hold references to shared mutable services; naive copies alias them.
- A constructor with two or three parameters is already clear enough.
- The "copy" needs different types; you want polymorphism, not cloning.
- Persistence frameworks already give you detached copies or snapshots.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Prefilled form or wizard drafts derived from templates. |
| Application | Campaign or job definitions cloned from approved presets. |
| Domain | Aggregate templates with protected invariants copied safely. |
| Infrastructure | Reusing parsed schemas or connection settings across clients. |
| Testing | Fixture factories producing valid base objects for each test. |

## Real-World Examples

- An email campaign starts from a template object; each send tweaks subject and audience only.
- A game clones a configured enemy archetype hundreds of times per level.
- Test suites clone a `validOrder()` prototype and override one field per scenario.

## Code Smell Before the Pattern

The smell is duplicated default-setting before every use:

```php
$notification = new Notification();
$notification->setChannel('email');
$notification->setLocale('tr-TR');
$notification->setRetryPolicy($defaultRetry);
$notification->setTemplateId('order-shipped');
// ...nine more lines repeated at every call site
```

When the default locale changes, ten places need edits — and one is always missed.

## Minimal Example

```php
final class Notification
{
    public function __construct(
        public string $channel = 'email',
        public string $locale = 'tr-TR',
        public string $templateId = '',
    ) {}

    public function copyWith(string $templateId): static
    {
        $clone = clone $this;
        $clone->templateId = $templateId;
        return $clone;
    }
}

$template = new Notification(templateId: 'order-shipped');
$smsCopy  = $template->copyWith('order-shipped-sms')
    ->with(channel: 'sms'); // shallow copy keeps shared immutable parts
```

In PHP, `clone` performs a shallow copy; implement `__clone` when nested mutable objects must be deep-copied deliberately.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Defaults live in exactly one place | Shallow vs deep copying is a real correctness trap |
| Cheap creation of near-identical objects | Clones can silently share references to mutable state |
| Keeps template knowledge out of callers | Hidden coupling between prototype and its copies over time |

## Related Patterns

- Builder when construction differs *structurally*, not just by field overrides.
- [Factory](./factory.md) when selection among types matters more than duplicating configuration.
- Memento because both freeze state, but Memento targets restore/undo rather than new-object creation.

## Common Mistakes

- Cloning objects holding database connections, event managers, or clocks.
- Forgetting `__clone`, so two "independent" objects mutate one nested list.
- Growing the prototype into a god object carrying defaults for unrelated concerns.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
