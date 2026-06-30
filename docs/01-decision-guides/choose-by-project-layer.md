# Choose by Project Layer

Use this guide when the problem is clear and you want to know where an abstraction should live.

## Layer Rules

Patterns are not layer-neutral. The same abstraction can help in one layer and create noise in another.

| Layer | Typical Pressure | Good Candidates | Usually Too Much Too Early |
|---|---|---|---|
| Presentation | Formatting, UI actions, request mapping | Command, Decorator | Deep Strategy hierarchies for simple view logic |
| Application | Workflow orchestration, policy selection, use-case coordination | Strategy, Command, Factory, Chain of Responsibility | Domain-wide base classes introduced before workflows stabilize |
| Domain | Stable business rules and explicit language | Strategy, sometimes Factory | Adapter for vendor concerns, infrastructure-driven abstractions |
| Infrastructure | External APIs, persistence, delivery channels | Adapter, Decorator, Factory | Domain-heavy abstractions that only mirror vendor APIs |
| Testing | Scenario setup, readable fixtures | Builder, Factory | Shared mutable global helpers that hide test intent |

## Fast Heuristics

- If the abstraction speaks vendor language, it usually belongs in infrastructure.
- If it coordinates a user or system workflow, it usually belongs in application.
- If it protects business meaning, it usually belongs in domain.
- If it only makes tests readable, keep it in testing.

## Layer Mistakes

### Adapter in the Domain

If your domain model starts speaking HTTP client or provider SDK terminology, the boundary is already leaking.

### Strategy Everywhere

Not every variation belongs in a Strategy family. When a choice is local and stable, keep it close to the caller.

### Factory as a Service Locator

A factory should clarify creation. It should not become a hidden global resolver for unrelated dependencies.

## Simpler Alternatives

Before introducing a pattern by layer, ask:

- Would a plain function in the current module be enough?
- Is the variation real now, or only expected later?
- Is the abstraction removing coupling, or just moving it?
