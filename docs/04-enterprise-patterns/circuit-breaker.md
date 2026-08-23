---
title: Circuit Breaker
category: enterprise
level: intermediate
project_layers:
  - application
  - infrastructure
related_patterns:
  - Retry with Backoff
  - Proxy
  - Saga
---

# Circuit Breaker

## One-Line Definition

Circuit Breaker stops calling a failing dependency after a threshold of failures and fails fast instead, probing periodically until the dependency recovers.

## Problem

A slow or down third-party API turns every call into a multi-second timeout. Thread pools, request workers, and user sessions pile up behind doomed calls until the whole application collapses — a failure in one provider becomes an outage everywhere.

## Context

This is resilience plumbing at external boundaries: payment gateways, SMS providers, recommendation services. It matters most under load, where waiting for timeouts compounds into resource exhaustion.

## When to Use

- A remote dependency has known failure modes and real downtime history.
- Cascading failure risk exists: callers stack up behind slow calls.
- There is a meaningful fallback path (cached data, queue-for-later, degrade gracefully).

## When Not to Use

- The dependency is local and reliable; breaker state only adds noise.
- Every call must succeed for correctness — failing fast changes nothing.
- You cannot define what "open" means for users; a silent breaker hides problems that should page someone.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Showing degraded-mode banners when breakers open. |
| Application | Deciding fallback flows per use case. |
| Domain | None — availability policy is not business logic. |
| Infrastructure | Wrapping HTTP clients and SDK calls. |
| Testing | Simulated failure sequences asserting state transitions. |

## Real-World Examples

- A checkout's fraud-check breaker opens during provider incidents; orders proceed to manual review.
- A recommendation widget serves cached suggestions while its breaker is open.
- A job runner skips an analytics exporter whose breaker tripped, retrying next cycle.

## Code Smell Before the Pattern

The smell is unbounded patience at the edge:

```php
public function recommend(User $user): array
{
    return $this->http->get('/recommendations', [
        'timeout' => 30, // every caller waits out the full timeout
    ]);
}
```

Under an outage, each request still burns 30 seconds of worker time.

## Minimal Example

```php
final class CircuitBreaker
{
    private int $failures = 0;
    private ?int $openedAt = null;

    public function __construct(
        private readonly int $threshold = 5,
        private readonly int $cooldownSeconds = 30,
    ) {}

    public function call(callable $action): mixed
    {
        if ($this->isOpen()) {
            throw new DependencyUnavailable();
        }
        try {
            $result = $action();
            $this->failures = 0;
            return $result;
        } catch (\Throwable $e) {
            if (++$this->failures >= $this->threshold) {
                $this->openedAt = time();
            }
            throw $e;
        }
    }

    private function isOpen(): bool
    {
        return $this->openedAt !== null
            && (time() - $this->openedAt) < $this->cooldownSeconds;
    }
}

// usage: fail fast + fall back to cache
$recs = $breaker->call(fn() => $client->recommend($userId));
```

Production versions add half-open probes and metrics; the shape stays the same.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Contains failures before they cascade | Threshold tuning is genuinely hard |
| Fails fast, freeing resources for healthy paths | Users see errors sooner during partial degradation |
| Makes dependency health observable | State must be shared across instances to be honest |

## Related Patterns

- [Retry with Backoff](./retry-with-backoff.md) handles transient blips *inside* the closed state; breaker guards against persistent failure.
- Proxy shares the same-interface wrapper shape; intent here is availability control.
- [Saga](./saga.md) coordinates long workflows whose steps may hit open breakers.

## Common Mistakes

- Retrying aggressively inside an open breaker, defeating its purpose.
- Per-instance breaker state in a cluster — one instance never sees enough failures to trip.
- Treating every exception as dependency failure; validation errors should not count.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
