---
title: Background Job Processing
scenario_type: background-jobs
recommended_patterns:
  - Command
  - Template Method
  - Observer
  - Adapter
not_recommended_initially:
  - Event Sourcing
  - Service Locator
---

# Background Job Processing

## Problem

An application needs to run work outside the request path, such as sending messages, generating reports, syncing with external systems, or rebuilding derived data, without turning each job into an unstructured script with hidden dependencies and inconsistent failure handling.

## Forces and Constraints

- Business constraint: jobs often represent user-visible outcomes, so retries and failures must be understandable.
- Technical constraint: queue workers, schedulers, and external APIs introduce delivery and timing uncertainty.
- Maintainability constraint: job classes can become dumping grounds for validation, orchestration, provider calls, and logging.
- Testing constraint: job behavior should be testable without a real queue or external provider.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Command](../02-gof-patterns/behavioral/command.md) | Represents the requested background action as explicit input with stable shape. |
| [Template Method](../02-gof-patterns/behavioral/template-method.md) | Keeps shared job workflow steps such as load, validate, execute, and record outcome in a protected order. |
| [Observer](../02-gof-patterns/behavioral/observer.md) | Lets non-critical local reactions subscribe to job lifecycle notifications without crowding the core job. |
| [Adapter](../02-gof-patterns/structural/adapter.md) | Isolates queue systems, email providers, storage APIs, or third-party SDKs behind internal contracts. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Event Sourcing | Adds replay and persistence complexity that most background jobs do not need at first. |
| Service Locator | Hides job dependencies and makes retry behavior harder to reason about. |

## Suggested Project Structure

```txt
app/
  Jobs/
    Application/
      GenerateReportCommand.php
      GenerateReportJob.php
      BaseJobWorkflow.php
    Infrastructure/
      QueueJobDispatcher.php
      ReportStorageAdapter.php
      MailerAdapter.php
    Observers/
      JobAuditObserver.php
      JobMetricsObserver.php
```

## Step-by-Step Flow

1. A controller, scheduler, or domain workflow creates an explicit command for the background action.
2. A dispatcher translates the command into the queue system's delivery shape.
3. The job workflow loads required state, validates whether the job can still run, executes the main behavior, and records the outcome.
4. Provider-specific behavior runs through adapters so the job does not depend on SDK details.
5. Optional observers record metrics, audit entries, or local notifications after meaningful job lifecycle moments.

## Failure Modes

- Job payloads contain loose arrays with implicit meaning and no versioning plan.
- Queue-specific APIs leak into application services and make jobs hard to test.
- Retry behavior repeats side effects because idempotency is not part of the job design.
- Observers hide critical business behavior that should be part of the main job workflow.

## Testing Strategy

- Unit tests: command validation, job workflow decisions, and idempotency checks.
- Adapter tests: queue and provider translation against fake or contract-driven boundaries.
- Integration tests: one successful dispatch and one representative retry or failure path.
- Observability checks: audit and metrics reactions are tested without requiring the real queue.

## Scaling Considerations

Start with explicit commands and dependency-passed jobs. Add Template Method only when several jobs share a real workflow skeleton. Add observers for local secondary reactions, but use a durable event or message boundary when delivery guarantees matter.

## Review Checklist

- [ ] Is the job input explicit and stable?
- [ ] Are external systems isolated?
- [ ] Is retry behavior safe or intentionally limited?
- [ ] Are critical side effects visible in the main workflow?
- [ ] Can the job be tested without a real queue?

## Related Reading

- [Command](../02-gof-patterns/behavioral/command.md)
- [Template Method](../02-gof-patterns/behavioral/template-method.md)
- [Observer](../02-gof-patterns/behavioral/observer.md)
- [Adapter](../02-gof-patterns/structural/adapter.md)
- [Testing With Patterns](../01-decision-guides/testing-with-patterns.md)
