---
title: State
category: behavioral
level: intermediate
project_layers:
  - application
  - domain
related_patterns:
  - Strategy
  - Command
  - Domain Event
---

# State

## One-Line Definition

State models behavior that changes because an object moves through meaningful lifecycle stages, so transitions and allowed actions stay explicit instead of being scattered across status checks.

## Problem

Code keeps branching on status or lifecycle fields such as pending, approved, packed, suspended, or archived. As the number of transitions and rules grows, behavior becomes tangled in conditionals spread across handlers and services.

## Context

This appears in order lifecycles, approval workflows, account status changes, subscription stages, and other flows where the allowed behavior depends on the object's current stage, not just on a caller-selected policy.

## When to Use

- Lifecycle transitions are real, recurring, and business-meaningful.
- Behavior depends on the current state of an object rather than on one chosen algorithm.
- The same status checks are spreading across several services or handlers.

## When Not to Use

- Status is present only for display or reporting and does not drive meaningful behavior.
- There are only one or two transitions and simple explicit conditionals are still clear.
- The real variation comes from caller-selected policy, which is usually Strategy instead.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; UI may reflect state, but state rules usually should not live here. |
| Application | Workflow handlers may delegate lifecycle rules to state objects. |
| Domain | Strong fit when states express business-valid transitions and actions. |
| Infrastructure | Rare; infrastructure may persist state but should not usually define lifecycle behavior. |
| Testing | Useful for focused transition tests and invalid-action coverage. |

## Real-World Examples

- An order can be allocated, packed, shipped, or canceled, and each state allows different actions.
- An admin review request can be pending, approved, rejected, or escalated.
- A subscription can be trialing, active, paused, or expired with different allowed transitions.

## Code Smell Before the Pattern

The smell is repeated status branching:

```php
if ($order->status === 'packed') {
    $this->ship($order);
} elseif ($order->status === 'canceled') {
    throw new DomainException('Canceled orders cannot be shipped');
}
```

When this logic repeats in several places, lifecycle rules stop being explicit and trustworthy.

## Minimal Example

```php
interface OrderState
{
    public function ship(Order $order): void;
}

final class PackedState implements OrderState
{
    public function ship(Order $order): void
    {
        $order->markShipped();
    }
}

final class CanceledState implements OrderState
{
    public function ship(Order $order): void
    {
        throw new DomainException('Canceled orders cannot be shipped');
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes lifecycle rules and invalid transitions explicit | Adds more types and transition wiring |
| Reduces repeated status branching | Can feel heavy when the lifecycle is still small |
| Improves transition-focused testing | Requires careful naming and transition ownership |

## Related Patterns

- Strategy when the caller chooses a policy, but the object's current stage does not drive behavior.
- Command when a request triggers a lifecycle action but the state object decides whether that action is valid.
- Domain Event when meaningful state transitions should trigger decoupled follow-up reactions.

## Common Mistakes

- Creating state objects for a status field that has little real behavior behind it.
- Mixing caller-selected strategies and lifecycle states until the distinction becomes blurry.
- Letting transition rules remain spread across services even after introducing state objects.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
