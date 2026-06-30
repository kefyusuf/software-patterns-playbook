# Layered Architecture

## One-Line Definition

Layered Architecture organizes the system into responsibility bands such as presentation, application, domain, and infrastructure so dependencies flow in a predictable direction.

## Problem

UI concerns, workflow orchestration, business rules, and external integrations start mixing together, making it hard to reason about ownership and change impact.

## Context

This architecture works best when the system has a clear request-to-business-to-persistence flow and the team needs a stable mental model more than aggressive vertical decomposition.

## When to Use

- The team needs clear responsibility boundaries across common application concerns.
- The system is still easier to understand by horizontal layers than by many vertical slices.
- Shared policies, validation, and integration seams benefit from consistent placement rules.

## When Not to Use

- The application is small enough that strict layering would add more ceremony than value.
- Teams keep shipping whole features through many layers of pass-through code.
- The main problem is feature ownership and module independence rather than generic separation of concerns.

## Typical Shape

```txt
Presentation/
Application/
Domain/
Infrastructure/
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Gives the team a simple default ownership model | Can encourage pass-through layers with little real value |
| Makes dependency direction easier to explain | Features may scatter across many folders |
| Fits many CRUD-plus-workflow systems well | Cross-feature cohesion can be weaker than vertical alternatives |

## Good Fit

- Administrative systems
- Internal business applications
- Systems where stable conventions matter more than feature isolation

## Bad Fit

- Teams that need strong feature-module ownership
- Products where every change cuts vertically across the same layers and creates repeated pass-through code

## Related Patterns

- [Facade](../02-gof-patterns/structural/facade.md) for simplifying cross-layer orchestration entry points.
- [Repository](../04-enterprise-patterns/repository.md) when domain-focused persistence boundaries matter inside the layered model.
- [DTO](../04-enterprise-patterns/dto.md) for stable boundary shapes between layers.

## Review Checklist

- [ ] Do the layers express real responsibility boundaries?
- [ ] Are we avoiding pass-through services with no decision-making value?
- [ ] Is the design easier to change than a simpler module layout?
- [ ] Would a vertical alternative fit the change pattern better?
