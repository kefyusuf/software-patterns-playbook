---
title: Payment System
scenario_type: payment
recommended_patterns:
  - Strategy
  - Adapter
  - Factory
not_recommended_initially:
  - Command
  - Circuit Breaker
---

# Payment System

## Problem

An application must charge customers through different payment providers while keeping checkout logic readable, testable, and insulated from provider SDK details.

## Forces and Constraints

- Business constraint: the product may support multiple payment methods or providers over time.
- Technical constraint: providers expose different APIs, request payloads, and failure codes.
- Maintainability constraint: checkout code should not know vendor-specific construction and transport details.
- Testing constraint: payment approval and failure paths should be testable without hitting real gateways.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| Strategy | Supports variation by payment method or charging policy without large branching blocks. |
| Adapter | Hides each provider's SDK vocabulary behind a stable internal contract. |
| Factory | Centralizes provider or method selection so callers request a capability, not a concrete gateway. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Command | Helpful later for queuing or replay, but a synchronous MVP checkout flow can stay simpler. |
| Circuit Breaker | Useful at scale, but not necessary before real provider instability data exists. |

## Suggested Project Structure

```txt
app/
  Checkout/
    Application/
      ChargePayment.php
      PaymentGatewayFactory.php
      PaymentMethodStrategy.php
    Infrastructure/
      Payments/
        StripeGatewayAdapter.php
        IyzicoGatewayAdapter.php
```

## Step-by-Step Flow

1. Checkout receives an order and requested payment method.
2. The application layer chooses the appropriate payment strategy for that method.
3. The strategy asks a factory for the provider-facing gateway implementation it needs.
4. The selected adapter translates the application's request into the provider's API shape.
5. The provider response is normalized back into application terms such as approved, declined, or retryable failure.
6. Checkout continues only with the normalized outcome, not with raw SDK structures.

## Failure Modes

- Provider timeout or transport failure prevents a charge attempt.
- Provider declines the payment with vendor-specific error codes.
- Checkout logic becomes tightly coupled to one gateway because adapter boundaries are bypassed.
- A new payment method is added by copy-pasting conditionals into the checkout service instead of extending the strategy family cleanly.

## Testing Strategy

- Unit tests: charge policy selection, failure normalization, and factory routing rules.
- Integration tests: adapter translation against fake or contract-safe provider responses.
- Contract tests: verify each adapter preserves the internal `charge` contract and result shape.
- E2E tests, if necessary: one approved flow and one declined flow through checkout with test doubles or sandbox gateways.

## Scaling Considerations

As payment volume grows, provider instability and delayed workflows may justify additional patterns such as Command for asynchronous capture, Retry for transient failures, or Circuit Breaker around unstable providers. Those additions should follow observed failure pressure, not be built in by default.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?
