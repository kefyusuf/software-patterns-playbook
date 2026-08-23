---
title: Retry with Backoff
category: enterprise
level: beginner-to-intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Circuit Breaker
  - Outbox
---

# Retry with Backoff

## One-Line Definition

Retry with Backoff re-attempts a failed operation after growing delays, with jitter and a bounded attempt count, to ride out transient failures without amplifying them.

## Problem

Networks blip. A single dropped connection or 503 should not fail a checkout — but naive immediate retries hammer a struggling dependency, turning its brief hiccup into a self-inflicted outage (the retry storm).

## Context

Applies at every remote boundary: HTTP calls, queue publishes, DNS lookups, database deadlocks. Correctness question first: is the operation safe to repeat?

## When to Use

- Failures are transient: timeouts, connection resets, 5xx responses.
- The operation is idempotent, or retries can be made idempotent via idempotency keys.
- Bounded delay between attempts fits the user or job's latency budget.

## When Not to Use

- Non-idempotent operations without deduplication — double-charging is worse than one failure.
- Validation failures and 4xx errors; retrying identical bad input cannot succeed.
- The caller sits inside a request path with a hard deadline shorter than total retry time.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rarely; optimistic UI spinners instead. |
| Application | Wrapping outbound calls in policy objects. |
| Domain | None — transport concern. |
| Infrastructure | HTTP clients, queue producers, DB deadlock loops. |
| Testing | Fake clocks asserting attempt counts and delays. |

## Real-World Examples

- An SMS gateway call retries three times over ~2 seconds before surfacing an error.
- A background sync job retries failed API pulls with exponential backoff across minutes.
- A payment status poller backs off while a provider settles transactions.

## Code Smell Before the Pattern

The smell is all-or-nothing fragility, or blind tight loops:

```php
try {
    return $this->sms->send($message);
} catch (\Throwable $e) {
    return $this->sms->send($message); // immediate, unbounded, no jitter
}
```

One flaky minute now multiplies load exactly when the dependency can least afford it.

## Minimal Example

```php
final class RetryPolicy
{
    public function __construct(
        private readonly int $maxAttempts = 3,
        private readonly int $baseDelayMs = 100,
    ) {}

    public function run(callable $action): mixed
    {
        for ($attempt = 1; ; $attempt++) {
            try {
                return $action();
            } catch (TransientError $e) {
                if ($attempt >= $this->maxAttempts) {
                    throw $e;
                }
                $backoff = $this->baseDelayMs * 2 ** ($attempt - 1);
                usleep(($backoff + random_int(0, $backoff / 2)) * 1000); // jitter
            }
        }
    }
}

$result = (new RetryPolicy())->run(fn() => $client->send($message));
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Transient blips stop becoming user-facing failures | Multiplies load precisely during incidents if untuned |
| Simple to implement and reason about | Wrong classification of "transient" corrupts data |
| Jitter spreads retries away from synchronized waves | Adds latency variance callers must tolerate |

## Related Patterns

- [Circuit Breaker](./circuit-breaker.md) stops retries when failure persists.
- [Outbox](./outbox.md) achieves guaranteed delivery by retrying from durable storage rather than in-memory.
- Idempotency keys are the standard companion making retries safe on writes.

## Common Mistakes

- Retrying non-idempotent POSTs without idempotency keys.
- Fixed tiny delays from thousands of clients — synchronized retry tsunamis.
- Retrying 4xx validation errors as if they were transient.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
