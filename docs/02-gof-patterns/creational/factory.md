---
title: Factory
category: creational
level: beginner-to-intermediate
project_layers:
  - application
  - infrastructure
  - testing
related_patterns:
  - Builder
  - Strategy
  - Adapter
---

# Factory

## One-Line Definition

Factory centralizes object creation when the caller should not own the selection or construction details directly.

## Problem

Code starts scattering `new` calls, provider-specific construction, or environment-based branching across multiple modules. Creation becomes duplicated and the caller must know too much about concrete classes.

## Context

This usually appears when an application chooses between multiple implementations such as payment providers, notification senders, or test fixtures with different defaults.

## When to Use

- You choose between multiple implementations behind one stable interface.
- Construction depends on configuration, environment, or provider selection.
- You want callers to ask for a capability rather than a concrete class.

## When Not to Use

- There is only one obvious concrete class and no near-term variation.
- The factory would only wrap a single `new` statement without removing real coupling.
- The factory is turning into a hidden container or service locator.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; usually only to choose a presenter or formatter family. |
| Application | Choose workflow collaborators based on use-case context. |
| Domain | Limited; sometimes to create domain objects with meaningful invariants. |
| Infrastructure | Common for provider adapters, clients, and channel implementations. |
| Testing | Build fixtures or test doubles with a stable entry point. |

## Real-World Examples

- A checkout service asks a payment gateway factory for the provider requested by the order.
- A notification module chooses email, SMS, or push sender implementations from one entry point.
- Test code uses a factory to create valid order or user objects with default data.

## Code Smell Before the Pattern

The usual smell is repeated branching near object creation:

```php
if ($provider === 'stripe') {
    $gateway = new StripeGateway($httpClient, $config['stripe']);
} elseif ($provider === 'iyzico') {
    $gateway = new IyzicoGateway($httpClient, $config['iyzico']);
} else {
    throw new InvalidArgumentException('Unsupported provider');
}
```

Every caller now owns provider selection and constructor details.

## Minimal Example

```php
interface PaymentGateway
{
    public function charge(Money $amount): void;
}

final class PaymentGatewayFactory
{
    public function make(string $provider): PaymentGateway
    {
        return match ($provider) {
            'stripe' => new StripeGateway(),
            'iyzico' => new IyzicoGateway(),
            default => throw new InvalidArgumentException('Unsupported provider'),
        };
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Removes creation duplication | Adds another abstraction to maintain |
| Keeps callers focused on capability | Can hide too much if it becomes a generic resolver |
| Makes provider variation explicit | Needs disciplined scope to avoid service-locator drift |

## Related Patterns

- Builder when construction complexity matters more than implementation choice.
- Strategy when behavior selection matters after creation.
- Adapter when the real problem is external interface mismatch.

## Common Mistakes

- Creating a factory for one class with no real variation.
- Letting the factory resolve unrelated dependencies.
- Mixing object selection, caching, and business rules in the same factory.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
