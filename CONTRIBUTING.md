# Contributing

This repository accepts small, focused documentation improvements
that make software pattern decisions clearer, more practical, and
easier to review.

## Contribution Rules

- Write in English only.
- Start with the problem, not the definition.
- Include realistic examples instead of abstract slogans.
- Include `When Not to Use` guidance where the template requires it.
- Include trade-offs and simpler alternatives.
- Do not add empty placeholder files or empty sections.
- Do not introduce website tooling, generated tooling,
  or framework-heavy examples unless explicitly requested.

## Content Types

The main contribution types are:

- Pattern guides
- Scenario guides
- Anti-pattern guides
- Runnable examples
- Corrections to existing content

## Workflow

1. Open an issue or use an existing one when the scope is non-trivial.
2. Follow the relevant template from `templates/`.
3. Keep changes cohesive and focused on one topic.
4. Use the pull request template checklist honestly.

## Quality Bar

Every document should be useful to a developer building an actual project. That means:

- Clear headings
- Concrete examples
- Context-dependent guidance
- Explicit misuse risks
- No universal best-practice claims without context

## Guide Snippets And Runnable Examples

Pattern guide snippets are compact teaching examples. They may omit framework setup, persistence details, imports, or full application wiring when that keeps the pattern boundary easier to see.

Runnable source of truth lives under `examples/`. If a code block is meant to be compiled or executed, put it in the relevant example directory and keep the guide linked to that example. Do not describe illustrative snippets as runnable examples.

Use language fences honestly. If a guide uses a short PHP-style snippet to show object-oriented structure, that is illustrative guide code; Go and TypeScript parity is tracked through the runnable example folders.

## File Naming

- Use lowercase kebab-case filenames.
- Keep names descriptive and stable.
- Prefer one topic per document.

## Scope Discipline

Keep the repository lightweight. If your proposed content expands the
repository into a docs site, package, CLI, or generated system, treat
that as a separate direction unless maintainers approve it explicitly.

## When To Add A New Example

Add a new runnable example only when at least one of these is true:

- the guide describes a boundary that is clearer in code than in prose
- the pattern is commonly misunderstood without a concrete interaction flow
- the example helps connect several existing docs such as a pattern
  guide plus a scenario
- the example teaches a reusable shape such as translation,
  orchestration, lifecycle, or DTO mapping

Do not add a new example when:

- the guide is already clear through prose and a tiny code fragment
- the code would only repeat an existing example with renamed nouns
- the example would need framework setup or vendor SDK noise to make sense
- the example would exist only to increase example count

## Cross-Language Alignment

Go and TypeScript examples do not need line-by-line parity, but they
should preserve the same teaching intent when they cover the same
topic.

When maintaining both languages:

- keep the same boundary and pattern intent
- keep the same main scenario or problem framing
- allow language-specific structure where it makes the example clearer
- avoid drifting into different business behavior under the same example name
- update coverage docs when parity changes

Good parity means a reader can learn the same design idea from either
language, not that both folders must be mechanically identical.
