---
title: Proxy
category: structural
level: intermediate
project_layers:
  - application
  - infrastructure
  - testing
related_patterns:
  - Decorator
  - Adapter
  - Facade
---

# Proxy

## One-Line Definition

Proxy stands in for another object with the same interface and controls *access to it* — deferring creation, caching results, guarding calls, or standing in for something remote — while callers stay unaware.

## Problem

A caller needs an expensive, protected, or distant collaborator. Loading it eagerly wastes resources; calling it unprotected bypasses policy; reaching it over the network leaks transport details into business code.

## Context

Proxies appear at system edges: lazy-loaded entities, cached lookups, permission-checked service calls, rate-limited third-party clients, RPC stubs.

## When to Use

- Target construction or fetch is expensive and often unnecessary (virtual proxy).
- Results are deterministic enough to cache behind the same call (caching proxy).
- Every access must pass one guard: auth, tenancy, quota (protection proxy).
- The real object lives elsewhere and a local stand-in hides that (remote proxy).

## When Not to Use

- You want to *add* behavior like logging or metrics around the call — that is [Decorator](./decorator.md); use whichever name matches intent, but do not stack both blindly.
- Interfaces differ; [Adapter](./adapter.md) is the honest choice.
- A plain repository method or HTTP client option already provides laziness/caching.
- Guard logic belongs in the domain; hiding it in a proxy makes authorization invisible.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Lazy image/asset handles. |
| Application | Cached reference-data lookups. |
| Domain | Rarely; domain should see real collaborators or interfaces. |
| Infrastructure | Lazy entity loading, SDK rate limiters, remote stubs. |
| Testing | Stand-ins that record calls or return canned data behind the same interface. |

## Real-World Examples

- An ORM returns entity references immediately; related rows load on first property access.
- An FX-rate client caches responses per currency pair inside a same-interface wrapper.
- A payment SDK client sits behind a proxy enforcing per-tenant request quotas.

## Code Smell Before the Pattern

The smell is cost or policy handled ad hoc by every caller:

```php
$report = $this->repo->find($id);
// every caller pays the heavy load even when only $report->status() is needed
if (!$this->auth->can('view', $report)) {
    throw new AccessDenied();
}
```

Miss one call site and either performance or the security rule silently breaks.

## Minimal Example

```php
interface ReportRepository
{
    public function find(ReportId $id): Report;
}

final class LazyReportProxy implements ReportRepository
{
    private ?ReportRepository $real = null;

    public function __construct(
        private readonly \Closure $factory, // creates the real repo on demand
        private readonly AccessChecker $auth,
        private readonly UserContext $user,
    ) {}

    public function find(ReportId $id): Report
    {
        if (!$this->auth->can($this->user, 'view', $id)) {
            throw new AccessDenied();
        }
        $real = $this->real ??= ($this->factory)();
        return $real->find($id);
    }
}
```

Callers keep programming against `ReportRepository`; cost and policy live in one place.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Laziness/caching/protection without touching callers | Same interface hides *that* a proxy exists at all |
| One enforcement point instead of many | Debugging crosses an extra layer |
| Remote/local difference stays invisible | Stacked proxies create opaque behavior chains |

## Related Patterns

- Decorator adds responsibilities around a call; Proxy's essence is controlling *access* to the target.
- Adapter changes the interface; Proxy preserves it exactly.
- Facade simplifies a subsystem's surface; Proxy mirrors a single object's surface.
- Flyweight shares instances for memory; a caching proxy shares *results* for latency.

## Common Mistakes

- Hiding domain-level authorization rules inside infrastructure proxies where tests cannot see them.
- Caching non-deterministic calls and serving stale money/data decisions.
- Wrapping everything "just in case" until no call path can be read directly.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
