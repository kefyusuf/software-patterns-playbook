---
title: Admin Panel / Back-Office Actions
scenario_type: admin
recommended_patterns:
  - Command
  - DTO
  - Facade
not_recommended_initially:
  - CQRS
  - Event Sourcing
---

# Admin Panel / Back-Office Actions

## Problem

An application exposes internal admin actions such as approving accounts, refunding payments, changing plan state, or triggering operational workflows. These actions need clear authorization, traceability, and safe orchestration without turning the admin surface into a direct tunnel into every subsystem.

## Forces and Constraints

- Business constraint: admins can perform sensitive actions that change money, access, or customer state.
- Technical constraint: one admin action may coordinate several lower-level services such as persistence, notifications, and audit logging.
- Maintainability constraint: admin controllers should not accumulate orchestration, authorization, validation, and side-effect details in one place.
- Testing constraint: admin operations need strong, explicit input shapes and auditable outcomes that can be verified without full UI flows.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Command](../02-gof-patterns/behavioral/command.md) | Gives each admin action a clear input model and execution boundary. |
| [DTO](../04-enterprise-patterns/dto.md) | Makes request and result data explicit when actions cross controller, application, or integration boundaries. |
| [Facade](../02-gof-patterns/structural/facade.md) | Simplifies repeated orchestration for admin-facing workflows that coordinate several collaborators. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| CQRS | Separate read/write models can help later, but many admin panels stay manageable with simpler boundaries first. |
| Event Sourcing | Adds heavy modeling, storage, and replay complexity before the operational workflow itself is stable. |

## Suggested Project Structure

```txt
app/
  Admin/
    Presentation/
      ApproveRefundController.php
    Application/
      ApproveRefundCommand.php
      ApproveRefundHandler.php
      AdminActionResultDto.php
      AccountReviewFacade.php
    Infrastructure/
      AdminAuditRepository.php
```

## Step-by-Step Flow

1. An admin action enters through a controller or internal UI endpoint with an explicit DTO-like request shape.
2. The application boundary creates a command that represents the requested operation and the acting admin context.
3. A handler validates authorization and business preconditions before triggering any side effects.
4. A facade can coordinate repeated subsystem calls when the action commonly spans several services.
5. Results are returned through a stable DTO shape so the admin UI does not depend on raw subsystem responses.
6. Audit or follow-up reactions can be attached later without pushing every concern into the controller.

## Failure Modes

- Controllers become the place where business rules, authorization checks, and side effects all accumulate.
- Admin actions pass loose arrays or ad hoc payloads across boundaries, making auditing and validation inconsistent.
- Sensitive workflows call subsystems directly with no clear action model or result contract.
- Teams jump to separate read/write architectures before clarifying the real operational pain points.

## Testing Strategy

- Unit tests: command validation, authorization rules, and result DTO shaping.
- Integration tests: facade orchestration, persistence updates, and audit recording boundaries.
- Contract tests: admin-facing result shapes and downstream integration payloads remain stable.
- E2E tests, if necessary: a few high-risk actions such as refund approval or account suspension through the full admin flow.

## Scaling Considerations

As admin workflows multiply, additional patterns such as [Repository](../04-enterprise-patterns/repository.md) and [Domain Event](../04-enterprise-patterns/domain-event.md) may become useful to protect retrieval rules and decouple follow-up reactions. Start by making actions explicit and safe before separating the whole architecture into more specialized models.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [Command](../02-gof-patterns/behavioral/command.md)
- [Facade](../02-gof-patterns/structural/facade.md)
- [DTO](../04-enterprise-patterns/dto.md)
- [Repository](../04-enterprise-patterns/repository.md)
- [Domain Event](../04-enterprise-patterns/domain-event.md)
