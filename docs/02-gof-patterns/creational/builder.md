---
title: Builder
category: creational
level: beginner-to-intermediate
project_layers:
  - application
  - domain
  - testing
related_patterns:
  - Factory
  - Strategy
---

# Builder

## One-Line Definition

Builder constructs a complex object step by step when setup details would otherwise make creation noisy or fragile.

## Problem

Object creation becomes hard to read because many optional fields, nested objects, or ordering rules are packed into one constructor or one long setup block.

## Context

This often appears in request payload creation, test data setup, report generation inputs, or domain objects that require multiple coordinated values.

## When to Use

- Construction has many optional or conditional parts.
- The same object can be assembled in several readable ways.
- Test setup becomes repetitive and hard to scan.

## When Not to Use

- The constructor is still short and explicit.
- A named constructor or small value object would solve the problem more simply.
- The builder only mirrors every field without adding readability or safety.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Build complex response or view models when formatting is elaborate. |
| Application | Assemble requests for downstream workflows or integrations. |
| Domain | Create aggregates or value-rich objects when invariants need explicit setup steps. |
| Infrastructure | Less common; sometimes used for complex client payloads. |
| Testing | Very common for readable fixture setup. |

## Real-World Examples

- Building a payment request with optional fraud, billing, and installment fields.
- Creating test orders with only the fields relevant to one scenario.
- Preparing a notification payload with channel-specific options.

## Code Smell Before the Pattern

The common smell is a constructor or setup block that hides intent:

```php
$request = new PaymentRequest(
    $orderId,
    $amount,
    $currency,
    $customerEmail,
    $customerPhone,
    $billingAddress,
    $shippingAddress,
    $installmentCount,
    $fraudSessionId,
    $metadata
);
```

Reading the call site does not explain which fields matter for this specific flow.

## Minimal Example

```php
final class PaymentRequestBuilder
{
    private array $data = [];

    public function forOrder(string $orderId): self
    {
        $this->data['order_id'] = $orderId;
        return $this;
    }

    public function withAmount(int $amount, string $currency): self
    {
        $this->data['amount'] = $amount;
        $this->data['currency'] = $currency;
        return $this;
    }

    public function withFraudSession(string $sessionId): self
    {
        $this->data['fraud_session_id'] = $sessionId;
        return $this;
    }

    public function build(): PaymentRequest
    {
        return new PaymentRequest($this->data);
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes complex setup readable | Adds mutable setup code and another type to maintain |
| Helps tests focus on relevant fields | Can become boilerplate if construction is not truly complex |
| Allows safer defaults and presets | May hide required-field validation if designed loosely |

## Related Patterns

- Factory when the main problem is choosing which object to create.
- Strategy when the object is simple but behavior varies later.

## Common Mistakes

- Using Builder for objects with only a few clear fields.
- Allowing half-valid objects to be built without checks.
- Replacing every constructor with a builder by default.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
