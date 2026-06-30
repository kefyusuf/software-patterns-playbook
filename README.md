# Real World Software Patterns

Real World Software Patterns is a Markdown-first learning repository for developers who want to choose software patterns based on real problems, project constraints, and trade-offs.

This repository is not a pattern encyclopedia and it is not a framework manual. The goal is to help you answer practical questions such as:

- When is a pattern justified?
- Which layer should own the abstraction?
- What simpler option may be enough for now?
- Which mistakes usually appear before or after introducing a pattern?

## Who This Is For

- Beginner developers who know basic OOP but need problem-first explanations.
- Intermediate developers who want realistic placement of patterns in application code.
- Senior developers and architects who want review checklists, trade-off framing, and shared terminology.
- Contributors who want to extend the repository without weakening consistency.

## How To Read This Repository

Start from the decision guides if you have a problem but do not know the pattern name yet.

Then move to the pattern guides to understand where a pattern helps, where it does not, and what it costs.

Finish with real-world scenarios to see how multiple patterns work together in an application workflow.

If you are new to the repository, begin with:

- [What Is a Pattern?](/E:/projects/software-patterns-playbook/docs/00-introduction/what-is-a-pattern.md)
- [Pattern vs Architecture](/E:/projects/software-patterns-playbook/docs/00-introduction/pattern-vs-architecture.md)
- [When Not to Use Patterns](/E:/projects/software-patterns-playbook/docs/00-introduction/when-not-to-use-patterns.md)
- [How To Read This Repository](/E:/projects/software-patterns-playbook/docs/00-introduction/how-to-read-this-repo.md)

## Repository Principles

- Problem first, not pattern first.
- Trade-offs are required.
- `When Not to Use` is required.
- Simpler alternatives must be acknowledged.
- No empty placeholder documents.
- Markdown-first MVP. No docs site or generated tooling in the initial version.

## Planned Repository Structure

The MVP grows into this structure over time. Files are created only when they have meaningful content.

```txt
docs/
  00-introduction/
  01-decision-guides/
  02-gof-patterns/
  03-architecture-patterns/
  04-enterprise-patterns/
  05-real-world-scenarios/
  06-anti-patterns/
  07-checklists/
examples/
diagrams/
templates/
.github/
```

## MVP Scope

The initial MVP focuses on:

- Core decision guides
- A focused set of pattern documents
- Real-world scenario documents
- Anti-pattern documents
- Contribution templates and quality rules

The MVP does not include:

- A documentation website
- A CLI
- Generated indexes or metadata tooling
- Full runnable framework applications

## Current Status

The repository currently starts from a PRD and is being built in small, verified phases:

1. Foundation contract
2. Content governance
3. Decision layer
4. Core pattern library
5. Scenario layer
6. Anti-overengineering layer and MVP review

## Contributing

This project is learning-first and contributor-ready. Use the files under `templates/` as the source of truth for new content structure and read [CONTRIBUTING.md](/E:/projects/software-patterns-playbook/CONTRIBUTING.md) before opening a pull request.

## License

This repository uses the MIT License. See [LICENSE](/E:/projects/software-patterns-playbook/LICENSE).
