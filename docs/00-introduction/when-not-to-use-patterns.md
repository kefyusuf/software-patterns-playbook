# When Not to Use Patterns

Patterns are useful only when they reduce real complexity. They are a
poor trade when they add indirection faster than the code adds
pressure.

## Common Cases Where You Should Wait

- The variation is still speculative.
- One conditional is still clearer than a hierarchy of types.
- The code is duplicated only once and may not repeat.
- The team cannot explain the trade-offs in concrete project terms.

## Better First Moves

- Extract a function
- Rename concepts more clearly
- Move code to the correct layer
- Add a focused test and revisit later

## Review Rule

If the abstraction feels impressive but not obviously cheaper to
maintain, it is probably too early.
