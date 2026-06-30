---
title: Singleton
category: creational
level: intermediate
project_layers:
  - infrastructure
  - testing
related_patterns:
  - Factory
  - Decorator
---

# Singleton

## One-Line Definition

Singleton restricts a type to one shared instance, but in most modern application code it should be treated as an exception rather than a default pattern.

## Problem

Some resources are expensive, process-wide, or intentionally unique within one runtime. Teams reach for Singleton when they want one access point, but they often use it to avoid explicit dependency management.

## Context

This pattern appears around configuration registries, process-local caches, shared loggers, or runtime coordinators. In application code, most uses that look like Singleton are better served by dependency injection and explicit lifetimes.

## When to Use

- A resource is genuinely process-wide and a second instance would be incorrect or wasteful.
- Lifecycle control is explicit and well understood.
- The team can prove that hidden global state will not damage tests, request isolation, or runtime safety.

## When Not to Use

- You only want convenient access from anywhere.
- The application already has dependency injection or scoped services available.
- The state changes per request, per tenant, or per test and should not be shared globally.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare and usually a smell. |
| Application | Rare; avoid for business services and workflow coordination. |
| Domain | Usually incorrect because domain behavior should stay explicit and testable. |
| Infrastructure | Sometimes acceptable for process-local runtime utilities with explicit constraints. |
| Testing | Mostly harmful because shared mutable state leaks between tests. |

## Real-World Examples

- A process-local metrics registry initialized once at boot time.
- A shared immutable configuration reader in a small script environment.
- A legacy codebase using a global logger before moving to injected dependencies.

## Code Smell Before the Pattern

The smell is usually hidden dependency access:

```php
$config = AppConfig::instance();
$logger = Logger::instance();
$gateway = PaymentGateway::instance();
```

Every caller now depends on global state, and tests cannot easily substitute collaborators.

## Minimal Example

```php
final class MetricsRegistry
{
    private static ?self $instance = null;

    private function __construct() {}

    public static function instance(): self
    {
        return self::$instance ??= new self();
    }
}
```

This is technically a Singleton, but it should be justified by runtime constraints, not convenience.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Enforces one runtime instance | Hides dependencies and encourages global state |
| May reduce repeated setup for rare shared resources | Makes tests and request isolation harder |
| Can be acceptable in narrow infrastructure cases | Often blocks later refactoring more than it helps now |

## Related Patterns

- Factory when you only need controlled creation, not global access.
- Decorator when the real need is wrapping shared behavior around a service.

## Common Mistakes

- Using Singleton to avoid passing dependencies explicitly.
- Storing mutable business state in a global instance.
- Treating Singleton as a performance optimization before measuring a real problem.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
