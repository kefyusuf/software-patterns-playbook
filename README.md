# Real World Software Patterns

[![docs-check](https://github.com/kefyusuf/software-patterns-playbook/actions/workflows/docs-check.yml/badge.svg)](https://github.com/kefyusuf/software-patterns-playbook/actions/workflows/docs-check.yml)

Real World Software Patterns is a Markdown-first learning repository for developers who want to choose software patterns based on real problems, project constraints, and trade-offs.

This repository is not a pattern encyclopedia and it is not a framework manual. The goal is to help you answer practical questions such as:

- When is a pattern justified?
- Which layer should own the abstraction?
- What simpler option may be enough for now?
- Which mistakes usually appear before or after introducing a pattern?

## Quality Signals

- License: [MIT](./LICENSE)
- CI: [docs-check](./.github/workflows/docs-check.yml) runs Markdown linting, `go test ./...` across the Go examples, a TypeScript build with `tsc -p examples/typescript/tsconfig.json`, and the TypeScript example test command.
- Example policy: runnable code lives under [examples](./examples); compact snippets inside guides are illustrative unless a guide links to a runnable example.

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

- [What Is a Pattern?](./docs/00-introduction/what-is-a-pattern.md)
- [Pattern vs Architecture](./docs/00-introduction/pattern-vs-architecture.md)
- [When Not to Use Patterns](./docs/00-introduction/when-not-to-use-patterns.md)
- [How To Read This Repository](./docs/00-introduction/how-to-read-this-repo.md)

## Key Paths

- [Pattern Index](./docs/pattern-index.md)
- [Decision Guides](./docs/01-decision-guides)
- [Core Pattern Guides](./docs/02-gof-patterns)
- [Architecture Guides](./docs/03-architecture-patterns)
- [Real-World Scenarios](./docs/05-real-world-scenarios)
- [Anti-Patterns](./docs/06-anti-patterns)
- [Review Checklists](./docs/07-checklists)
- [Runnable Examples](./examples)
- [Documentation Tools](./tools/README.md)

## Repository Principles

- Problem first, not pattern first.
- Trade-offs are required.
- `When Not to Use` is required.
- Simpler alternatives must be acknowledged.
- No empty placeholder documents.
- Keep the repository lightweight and readable.

## Repository Structure

Files and directories exist only when they have meaningful content.

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

## Runnable Coverage

The repository is still documentation-first, but it now includes focused runnable example tracks where a small framework-free sample adds learning value.

Current runnable examples:

- [Go examples index](./examples/go/README.md)
- [TypeScript examples index](./examples/typescript/README.md)
- Strategy plus Factory: `payment-strategy`
- Adapter plus Decorator: `notification-adapter`
- Chain of Responsibility plus Command: `checkout-chain`
- State: `order-processing-state`
- Repository plus DTO: `order-repository-dto`
- Domain Event: `order-domain-event`
- Specification: `order-specification`

The TypeScript track currently includes:

- `payment-strategy`
- `notification-adapter`
- `checkout-chain`
- `order-processing-state`
- `order-repository-dto`
- `order-specification`
- `order-domain-event`

## Language Coverage Matrix

`Yes` means the repository currently includes a runnable example in that language. `Docs only` means guidance exists, but the concept intentionally remains documentation-first for now.

| Topic | Go | TypeScript | Status |
|---|---|---|---|
| Payment system / Strategy / Factory | Yes | Yes | cross-language runnable |
| Notification system / Adapter / Decorator | Yes | Yes | cross-language runnable |
| E-commerce checkout / Chain of Responsibility / Command | Yes | Yes | cross-language runnable |
| Order processing / State | Yes | Yes | cross-language runnable |
| Order processing / Repository / DTO | Yes | Yes | cross-language runnable |
| Order processing / Domain Event | Yes | Yes | cross-language runnable |
| Order processing / Specification | Yes | Yes | cross-language runnable |
| Application events / Observer | Docs only | Docs only | docs only |
| Workflow skeletons / Template Method | Docs only | Docs only | docs only |
| Background job processing | Docs only | Docs only | scenario guide |
| Testing patterns and mocks | Docs only | Docs only | decision guide |
| Architecture guides | Docs only | Docs only | docs only |
| Anti-pattern guides | Docs only | Docs only | docs only |
| Introduction and checklists | Docs only | Docs only | docs only |

Not every guide has a runnable counterpart yet. Architecture guides, anti-patterns, and some conceptual docs remain intentionally documentation-only.

## Contribution Rules

When adding new material:

- prefer improving an existing guide before creating a parallel document
- add a runnable example only when code clarifies a boundary better than prose alone
- keep examples small, framework-free, and tied to named guides or scenarios
- do not add a second-language example automatically; add it when parity improves learning value
- when a concept exists in both Go and TypeScript, keep the behavioral intent aligned even if the implementation style differs by language

Detailed contribution and example rules live in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

This project is learning-first and contributor-ready. Use the files under `templates/` as the source of truth for new content structure and read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

This repository uses the MIT License. See [LICENSE](./LICENSE).
