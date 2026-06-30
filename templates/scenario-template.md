---
title: Scenario Name
scenario_type: payment | notification | checkout | api-client | saas | file-upload | admin | other
recommended_patterns:
  - Pattern A
  - Pattern B
not_recommended_initially:
  - Pattern C
---

# Scenario Name

## Problem

Describe the real project problem.

## Forces and Constraints

- Business constraint
- Technical constraint
- Maintainability constraint
- Testing constraint

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| Pattern A | ... |
| Pattern B | ... |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Pattern C | ... |

## Suggested Project Structure

```txt
app/
  Module/
    Domain/
    Application/
    Infrastructure/
    Presentation/
```

## Step-by-Step Flow

1. Step one.
2. Step two.
3. Step three.

## Failure Modes

- Failure mode 1
- Failure mode 2

## Testing Strategy

- Unit tests
- Integration tests
- Contract tests
- E2E tests, if necessary

## Scaling Considerations

Explain what changes when the system grows.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?
