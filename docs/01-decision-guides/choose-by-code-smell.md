# Choose by Code Smell

Use this guide when the code already feels wrong and you want a concrete refactoring direction.

## Smell to Candidate Mapping

| Code Smell | What It Usually Means | Candidate Pattern | Simpler Alternative First |
|---|---|---|---|
| Long `if` or `switch` for provider-specific behavior | Variation is growing in one place | Strategy | Extract small private methods if there are only two stable branches. |
| Repeated SDK translation code across services | Vendor details are leaking | Adapter | One shared translator function if the surface area is still tiny. |
| Constructor with many optional arguments | Setup complexity is hiding intent | Builder | Named constructors or value objects. |
| One service method doing validation, transformation, side effects, and logging | Workflow responsibilities are mixed | Chain of Responsibility or Command | Split into a few private methods before adding objects. |
| Repeated wrapper logic around a stable service | Cross-cutting behavior is duplicated | Decorator | Inline helper if there is only one caller. |
| Hidden process-wide mutable object | Global state is being normalized | Avoid Singleton by default | Dependency injection with explicit scope. |
| `new` spread across many modules for one family of objects | Creation choices are duplicated | Factory | A shared constructor helper. |

## Smells That Do Not Need a Pattern Yet

- Two similar methods
- A single integration point
- One-time setup code
- A constructor that is merely slightly long

These often need cleanup, not a named pattern.

## Refactoring Order

1. Shrink the smell with local refactors.
2. Check whether the same pressure appears in more than one place.
3. Introduce a pattern only if it clearly improves coupling, readability, or change safety.

## Review Questions

- Is the smell recurring or isolated?
- Will the pattern simplify the next change, not only the current diff?
- Can the team explain the cost of the abstraction?
