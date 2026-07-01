# Choose by Code Smell

Use this guide when the code already feels wrong and you want a
concrete refactoring direction.

## Smell to Candidate Mapping

| Code Smell | Meaning | Candidate Pattern | Simpler Alt First |
|---|---|---|---|
| Long `if` or `switch` for provider-specific behavior | Variation is growing in one place | [Strategy](../02-gof-patterns/behavioral/strategy.md) | Extract small private methods if there are only two stable branches. |
| Repeated SDK translation code across services | Vendor details are leaking | [Adapter](../02-gof-patterns/structural/adapter.md) | One shared translator function if the surface area is still tiny. |
| Constructor with many optional arguments | Setup complexity is hiding intent | [Builder](../02-gof-patterns/creational/builder.md) | Named constructors or value objects. |
| One service method doing validation, transformation, side effects, and logging | Workflow responsibilities are mixed | [Chain of Responsibility](../02-gof-patterns/behavioral/chain-of-responsibility.md) or [Command](../02-gof-patterns/behavioral/command.md) | Split into a few private methods before adding objects. |
| Repeated wrapper logic around a stable service | Cross-cutting behavior is duplicated | [Decorator](../02-gof-patterns/structural/decorator.md) | Inline helper if there is only one caller. |
| Hidden process-wide mutable object | Global state is being normalized | Avoid [Singleton](../02-gof-patterns/creational/singleton.md) by default | Dependency injection with explicit scope. |
| `new` spread across many modules for one family of objects | Creation choices are duplicated | [Factory](../02-gof-patterns/creational/factory.md) | A shared constructor helper. |
| Transport or handler boundaries pass loose arrays everywhere | Boundary data is implicit and fragile | [DTO](../04-enterprise-patterns/dto.md) | A small explicit structure or named parameters if the boundary is still tiny. |
| Query logic repeats across several use cases with domain-specific retrieval rules | Persistence access is leaking into orchestration code | [Repository](../04-enterprise-patterns/repository.md) | Direct persistence code if the use case is simple and local. |
| The same eligibility or filtering rule keeps reappearing in queries and handlers | Business criteria is drifting across the codebase | [Specification](../04-enterprise-patterns/specification.md) | Keep the rule inline if it is still local and obvious. |

## Smells That Do Not Need a Pattern Yet

- Two similar methods
- A single integration point
- One-time setup code
- A constructor that is merely slightly long

These often need cleanup, not a named pattern.

## Refactoring Order

1. Shrink the smell with local refactors.
2. Check whether the same pressure appears in more than one place.
3. Introduce a pattern only if it clearly improves coupling,
   readability, or change safety.

## Review Questions

- Is the smell recurring or isolated?
- Will the pattern simplify the next change,
  not only the current diff?
- Can the team explain the cost of the abstraction?

## See Also

- [Pattern for Pattern's Sake](../06-anti-patterns/pattern-for-patterns-sake.md)
- [Repository Everywhere](../06-anti-patterns/repository-everywhere.md)
- [God Service](../06-anti-patterns/god-service.md)
