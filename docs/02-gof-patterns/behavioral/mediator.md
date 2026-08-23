---
title: Mediator
category: behavioral
level: intermediate-to-advanced
project_layers:
  - application
  - domain
related_patterns:
  - Observer
  - Facade
  - Chain of Responsibility
---

# Mediator

## One-Line Definition

Mediator centralizes how a set of colleagues interact: components stop referencing each other directly and coordinate through one object that owns the interaction rules.

## Problem

When many components call each other — form fields validating neighbors, services triggering each other, UI panels syncing state — the dependency graph becomes a mesh. Adding or changing one component means understanding its web of peers, and flows become impossible to trace.

## Context

This appears in interactive screens, module integration layers, and workflow hubs where several parties react to the same events but their pairwise wiring has grown out of control.

## When to Use

- A bounded group of components communicates in patterns that are hard to describe pairwise.
- Interaction rules change more often than the components themselves.
- You can name the coordination (checkout coordinator, screen mediator) as a real concept.

## When Not to Use

- Components only broadcast events with no choreography — [Observer](./observer.md) is lighter.
- There are just two collaborators; a direct call is clearer.
- The group is unbounded (whole application); a mediator becomes a god object and hides coupling rather than removing it.
- What you need is a simplified entry point to a subsystem, not coordination — that is [Facade](../structural/facade.md).

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Screen/form mediators coordinating widgets. |
| Application | Use-case coordinators sequencing module interactions. |
| Domain | Rare; aggregate roots already mediate their internals. |
| Infrastructure | Message brokers acting as mediated channels between services. |
| Testing | Colleague fakes asserting the choreography alone. |

## Real-World Examples

- A checkout form: address, shipping, and payment panels enable/disable each other; the mediator owns those rules.
- A trading dashboard where order book, risk panel, and alerts update from one coordinator.
- An in-app notification hub deciding which subsystem reacts to which event.

## Code Smell Before the Pattern

The smell is a peer mesh:

```php
final class ShippingPanel
{
    public function __construct(
        private AddressPanel $address,
        private PaymentPanel $payment,
        private SummaryPanel $summary,
    ) {}

    public function onMethodChange(): void
    {
        $this->address->refresh();
        if ($this->payment->isInstant()) {
            $this->summary->highlight();
        }
    }
}
```

Every panel knows every other panel; the real rule ("instant payment skips address re-check") lives nowhere findable.

## Minimal Example

```php
interface Panel
{
    public function onEvent(string $event): void;
}

final class CheckoutMediator
{
    /** @param array<string, Panel> $panels */
    public function __construct(private readonly array $panels) {}

    public function notify(string $event): void
    {
        match ($event) {
            'method.changed' => $this->route(['address.refresh', 'summary.refresh']),
            default          => null,
        };
    }

    private function route(array $actions): void
    {
        foreach ($actions as $action) {
            [$panel, $event] = explode('.', $action, 2);
            $this->panels[$panel]->onEvent($event);
        }
    }
}
```

Panels now know only the mediator; the choreography has one home.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Peer-to-peer dependencies collapse into star topology | The mediator can swell into an untestable god object |
| Interaction rules get a single, named location | One more layer to understand per flow |
| Components become reusable in other screens | Routing strings/indirection can hide real flow |

## Related Patterns

- Observer broadcasts to anonymous subscribers; a mediator *decides* who should react and in what order.
- Facade simplifies calls going *into* a subsystem; mediator coordinates traffic *among* peers.
- Chain of Responsibility passes a request along a line; mediator actively routes by rule.

## Common Mistakes

- Letting the mediator grow business logic that belongs in components.
- Applying it application-wide instead of to a bounded colleague group.
- Keeping stale peer references "temporarily", so both mesh and mediator exist.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
