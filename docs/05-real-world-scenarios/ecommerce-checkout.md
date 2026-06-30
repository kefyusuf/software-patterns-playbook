---
title: E-commerce Checkout
scenario_type: checkout
recommended_patterns:
  - Chain of Responsibility
  - Command
  - Strategy
not_recommended_initially:
  - Saga
  - Event Sourcing
---

# E-commerce Checkout

## Problem

An application must coordinate a checkout flow that validates cart data, applies rules, selects a payment path, and creates an order without collapsing all workflow logic into one large service method.

## Forces and Constraints

- Business constraint: checkout rules change frequently because of promotions, inventory rules, and payment options.
- Technical constraint: the flow touches multiple subsystems such as cart, payment, inventory, and order creation.
- Maintainability constraint: each workflow step should stay readable and independently testable.
- Testing constraint: both success and failure paths should be testable at step and flow levels.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md) | Breaks checkout into ordered validation and processing steps. |
| [Command](../02-gof-patterns/behavioral/command.md) | Gives the checkout request a clear action shape that can later support dispatching or async handling. |
| [Strategy](../02-gof-patterns/behavioral/strategy.md) | Supports payment-method or policy variation inside the workflow without one giant branch block. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Saga | Useful for cross-service long-running coordination, but excessive for an MVP in one application boundary. |
| Event Sourcing | Adds heavy modeling and storage complexity long before the core checkout flow is proven. |

## Suggested Project Structure

```txt
app/
  Checkout/
    Application/
      CheckoutCommand.php
      CheckoutHandler.php
      Steps/
        ValidateCartStep.php
        ValidatePaymentStep.php
        ReserveInventoryStep.php
        CreateOrderStep.php
      Payment/
        PaymentMethodStrategy.php
```

## Step-by-Step Flow

1. The application receives a checkout command containing the order, user, and payment context.
2. A checkout handler runs the request through ordered workflow steps.
3. Validation steps reject invalid carts, stock issues, or unsupported payment methods early.
4. The payment step uses a strategy to apply the correct charging behavior.
5. Later steps reserve inventory and create the order only after earlier conditions pass.
6. The workflow returns a normalized success or failure result without exposing step internals to callers.

## Failure Modes

- One giant checkout service becomes the only place every rule change must touch.
- Validation and side effects mix together, making rollback reasoning difficult.
- Payment variation logic grows into nested branches inside the flow.
- The team adds distributed-system patterns before the workflow pressure actually justifies them.

## Testing Strategy

- Unit tests: each checkout step and payment strategy in isolation.
- Integration tests: step ordering, shared context mutation, and handler orchestration.
- Contract tests: payment gateway behavior should still satisfy the internal checkout expectations.
- E2E tests, if necessary: one successful checkout and representative failure paths such as invalid stock or declined payment.

## Scaling Considerations

As checkout becomes distributed across services or needs asynchronous compensation, patterns such as Saga, Outbox, or more advanced retry handling may become relevant. In the MVP, the safer move is to keep one application boundary explicit and testable first.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [Choose by Problem](../01-decision-guides/choose-by-problem.md)
- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
- [Command](../02-gof-patterns/behavioral/command.md)
- [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md)
- [Strategy](../02-gof-patterns/behavioral/strategy.md)
