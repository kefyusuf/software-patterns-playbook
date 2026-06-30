---
title: Multi-tenant SaaS
scenario_type: saas
recommended_patterns:
  - Strategy
  - Factory
  - Decorator
not_recommended_initially:
  - Saga
  - Event Sourcing
---

# Multi-tenant SaaS

## Problem

An application serves multiple tenants that share product behavior but differ in configuration, enabled features, integrations, branding, or data boundaries. The system must remain understandable without scattering tenant-specific conditionals through every module.

## Forces and Constraints

- Business constraint: different tenants may have different plans, feature flags, integrations, and branding rules.
- Technical constraint: tenant context must be resolved consistently and applied across requests, background jobs, and integrations.
- Maintainability constraint: tenant-specific behavior should not become large `if tenant == X` branches throughout the codebase.
- Testing constraint: tenant isolation and tenant-specific policy behavior must be testable without duplicating the whole application per tenant.

## Recommended Patterns

| Pattern | Why It Helps |
|---|---|
| [Strategy](../02-gof-patterns/behavioral/strategy.md) | Supports tenant-specific policy variation such as pricing, notification, or access rules without central branching sprawl. |
| [Factory](../02-gof-patterns/creational/factory.md) | Creates tenant-aware service families or integration clients based on tenant context. |
| [Decorator](../02-gof-patterns/structural/decorator.md) | Applies tenant-specific wrapping behavior such as branding, limits, or audit enrichment around stable services. |

## Not Recommended Initially

| Pattern | Why It May Be Too Much |
|---|---|
| Saga | Useful only when tenant workflows span several distributed services with compensating actions. |
| Event Sourcing | Adds substantial modeling and storage complexity before the tenant model itself is stable. |

## Suggested Project Structure

```txt
app/
  Tenancy/
    Application/
      ResolveTenantContext.php
      TenantAwareServiceFactory.php
      Policies/
        PricingStrategy.php
        NotificationStrategy.php
    Domain/
      TenantContext.php
    Infrastructure/
      TenantConfigRepository.php
      TenantBrandingDecorator.php
```

## Step-by-Step Flow

1. The application resolves tenant context from domain, subdomain, token, or account mapping.
2. Tenant context is passed into the application boundary instead of being discovered ad hoc throughout the codebase.
3. A tenant-aware factory builds the correct service family or integration configuration for that tenant.
4. Strategy objects apply tenant-specific behavior where variation is real, such as pricing or notification policy.
5. Decorators add tenant-specific wrapping behavior such as branding or audit metadata while keeping the base service contract stable.
6. Persistence and configuration access stay tenant-aware through clear boundaries rather than scattered conditionals.

## Failure Modes

- Tenant identity is resolved differently in different parts of the application.
- Tenant-specific logic grows into copy-pasted branches across unrelated services.
- Shared services accidentally leak data or configuration between tenants.
- Factories and strategies become hard-coded exceptions for one or two special tenants instead of reusable policy boundaries.

## Testing Strategy

- Unit tests: tenant resolution rules, strategy behavior, and tenant-aware factory selection.
- Integration tests: tenant-scoped configuration loading and tenant-specific service composition.
- Contract tests: verify shared service contracts still hold across tenant-specific wrappers and policy variations.
- E2E tests, if necessary: one representative flow per tenant tier or feature-flag combination that proves context isolation holds.

## Scaling Considerations

As tenant complexity grows, additional patterns such as [Repository](../04-enterprise-patterns/repository.md), [DTO](../04-enterprise-patterns/dto.md), or [Domain Event](../04-enterprise-patterns/domain-event.md) may become useful to keep tenant configuration, cross-module reactions, and boundary data explicit. Those additions should follow demonstrated variation and isolation pressure, not arrive by default.

## Review Checklist

- [ ] Are external systems isolated?
- [ ] Are business rules testable?
- [ ] Is the chosen abstraction justified?
- [ ] Are duplicate requests or retries handled where needed?
- [ ] Is the initial design simpler than the future design?

## Related Reading

- [Choose by Problem](../01-decision-guides/choose-by-problem.md)
- [Choose by Project Layer](../01-decision-guides/choose-by-project-layer.md)
- [Strategy](../02-gof-patterns/behavioral/strategy.md)
- [Factory](../02-gof-patterns/creational/factory.md)
- [Decorator](../02-gof-patterns/structural/decorator.md)
- [Repository](../04-enterprise-patterns/repository.md)
- [DTO](../04-enterprise-patterns/dto.md)
- [Domain Event](../04-enterprise-patterns/domain-event.md)
