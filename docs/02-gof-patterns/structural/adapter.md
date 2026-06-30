---
title: Adapter
category: structural
level: beginner-to-intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Factory
  - Strategy
  - Decorator
---

# Adapter

## One-Line Definition

Adapter translates one interface into another so the rest of the application can speak its own language instead of a vendor's.

## Problem

External systems expose APIs, SDKs, payloads, or naming conventions that do not fit the language or needs of your application. Without a boundary, vendor details leak across the codebase.

## Context

This appears in payment providers, SMS gateways, email vendors, shipping APIs, cloud storage SDKs, or any third-party client with a mismatched interface.

## When to Use

- A vendor interface does not match your application's terms.
- You want to swap or compare providers later.
- You need one stable internal contract despite external inconsistencies.

## When Not to Use

- There is only one tiny translation at one call site.
- The application already speaks the correct internal language and only needs a mapping helper.
- The adapter would just proxy every method name without protecting any boundary.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; sometimes to normalize external UI widget contracts. |
| Application | Consume a stable application-facing interface. |
| Domain | Usually should not live here because vendor language does not belong in the domain. |
| Infrastructure | Primary home for third-party translations. |
| Testing | Replace vendor SDKs with stable test doubles against the adapted contract. |

## Real-World Examples

- Converting a payment SDK's `authorize` call into your application's `charge` contract.
- Wrapping a mail vendor that expects raw arrays behind a `NotificationSender` interface.
- Translating provider-specific webhook payloads into internal event objects.

## Code Smell Before the Pattern

The smell is scattered vendor knowledge:

```php
$client->sendSms([
    'gsm' => $phone,
    'msg' => $message,
    'originator' => $sender,
]);
```

If this shape appears in multiple services, every caller is now coupled to the vendor's vocabulary.

## Minimal Example

```php
interface SmsSender
{
    public function send(string $phone, string $message): void;
}

final class TwilioSmsAdapter implements SmsSender
{
    public function __construct(private TwilioClient $client) {}

    public function send(string $phone, string $message): void
    {
        $this->client->messages->create($phone, ['body' => $message]);
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Protects the rest of the codebase from vendor details | Adds a boundary layer to maintain |
| Makes swapping or testing providers easier | Can feel unnecessary for a tiny one-off integration |
| Encourages internal language consistency | May become pass-through noise if it adds no translation value |

## Related Patterns

- Factory when you choose between several adapters.
- Strategy when runtime policy determines which adapted behavior to use.
- Decorator when you want logging, metrics, or retries around an existing adapted service.

## Common Mistakes

- Letting vendor objects cross the adapter boundary into application code.
- Creating an adapter that simply renames methods without adding real protection.
- Mixing selection logic and translation logic in the same class.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
