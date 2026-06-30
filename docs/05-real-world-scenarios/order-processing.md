---
title: Order Processing
scenario_type: other
recommended_patterns:
  - Command
  - Chain of Responsibility
  - Domain Event
not_recommended_initially:
  - Saga
  - Event Sourcing
---

# Order Processing

## Problem

An application must process orders after checkout through validation, inventory allocation, fulfillment preparation, status updates, and follow-up side effects without collapsing the whole lifecycle into one large orchestration service.

## Forces and Constraints

- Business constraint: orders move through several meaningful business stages such as accepted, allocated, packed, or failed.
- Technical constraint: processing touches payment confirmation, inventory, shipping, notifications, and persistence boundaries.
- Maintainability constraint: the main workflow should stay traceable while downstream reactions remain decoupled where appropriate.
- Testing constraint: stage transitions, failure paths, and side effects should be testable without needing a full production stack.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Command](../02-gof-patterns/behavioral/command.md) | Makes processing requests explicit so handlers, jobs, or retries operate on a stable action shape. |
| [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md) | Breaks order processing into ordered steps such as validation, allocation, and fulfillment preparation. |
| [Domain Event](../04-enterprise-patterns/domain-event.md) | Captures meaningful order milestones such as `OrderAllocated` or `OrderPacked` without tightly coupling all follow-up behavior to the main flow. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Saga | Useful later for distributed compensation across several services, but too heavy if one application boundary still owns the workflow. |
| Event Sourcing | Adds substantial storage and replay complexity before the order lifecycle and reporting needs are proven. |

## Suggested Project Structure

```txt
app/
  Orders/
    Application/
      ProcessOrderCommand.php
      ProcessOrderHandler.php
      Steps/
        ValidateOrderStep.php
        AllocateInventoryStep.php
        PrepareFulfillmentStep.php
    Domain/
      Order.php
      Events/
        OrderAllocated.php
        OrderPacked.php
    Infrastructure/
      OrderRepository.php
      FulfillmentPayloadDto.php
```

## Step-by-Step Flow

1. A command enters the application boundary to process an order in a specific state.
2. The handler loads the order through a repository using domain-relevant retrieval rules.
3. Ordered processing steps validate current status, allocate inventory, and prepare the next business transition.
4. DTOs carry integration or fulfillment payloads when data crosses into infrastructure or external boundaries.
5. When meaningful lifecycle changes occur, domain events are emitted so notifications, analytics, or projections can react without bloating the main flow.
6. The repository persists the updated order state through a boundary that keeps storage detail out of orchestration code.

## Failure Modes

- One service starts handling every stage transition, integration call, and side effect directly.
- Status transitions are updated ad hoc without a clear lifecycle model.
- Downstream concerns such as notifications or analytics get hard-coded into the main processing handler.
- Teams jump to distributed patterns before one-application flow and boundaries are even stable.

## Testing Strategy

- Unit tests: each processing step, lifecycle rule, and emitted domain event decision.
- Integration tests: repository retrieval rules, status persistence, and DTO mapping to fulfillment or shipping boundaries.
- Contract tests: confirm downstream handlers and integrations receive stable payload shapes and event semantics.
- E2E tests, if necessary: one happy-path processing flow plus representative failures such as allocation failure or invalid status transition.

## Scaling Considerations

As order processing spreads across more services or needs delayed compensation, patterns such as [Repository](../04-enterprise-patterns/repository.md), [DTO](../04-enterprise-patterns/dto.md), and eventually distributed coordination patterns may grow in value. The safer initial move is to keep the lifecycle explicit and testable inside one boundary first.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [E-commerce Checkout](./ecommerce-checkout.md)
- [Command](../02-gof-patterns/behavioral/command.md)
- [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md)
- [Domain Event](../04-enterprise-patterns/domain-event.md)
- [Repository](../04-enterprise-patterns/repository.md)
- [DTO](../04-enterprise-patterns/dto.md)
