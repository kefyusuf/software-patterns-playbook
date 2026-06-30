# Contributing

This repository accepts small, focused documentation improvements that make software pattern decisions clearer, more practical, and easier to review.

## Contribution Rules

- Write in English only.
- Start with the problem, not the definition.
- Include realistic examples instead of abstract slogans.
- Include `When Not to Use` guidance where the template requires it.
- Include trade-offs and simpler alternatives.
- Do not add empty placeholder files or empty sections.
- Do not introduce website tooling, generated tooling, or framework-heavy examples in the MVP unless explicitly requested.

## Content Types

The main contribution types are:

- Pattern guides
- Scenario guides
- Anti-pattern guides
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

## File Naming

- Use lowercase kebab-case filenames.
- Keep names descriptive and stable.
- Prefer one topic per document.

## Scope Discipline

The MVP is intentionally narrow. If your proposed content expands the repository into a docs site, package, CLI, or generated system, treat that as post-MVP work unless maintainers approve it explicitly.
