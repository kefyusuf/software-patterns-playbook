# Diagrams

This directory is reserved for diagrams that support explanation
without replacing the written guidance.

The repository stays Markdown-first, so diagrams should be lightweight
and directly useful:

- Mermaid decision flows
- Layer placement diagrams
- Scenario sequence sketches
- Pattern relationship maps

## Mermaid Sources

Mermaid source files live under [mermaid](./mermaid/).

- [Pattern selection flow](./mermaid/pattern-selection-flow.mmd) shows how a recurring problem becomes a pattern candidate.
- [Layer placement](./mermaid/layer-placement.mmd) shows where common responsibilities belong before a pattern is introduced.
- [Scenario flow](./mermaid/scenario-flow.mmd) shows how a scenario guide moves from constraints to testing strategy.
- [Pattern relationships](./mermaid/pattern-relationships.mmd) shows common combinations and competing choices.

## When To Add A Diagram

Add a diagram only when it makes a decision easier to review than prose alone.
Good candidates include branching choices, ownership boundaries, and scenario
flows with multiple responsibilities.

Do not add diagrams for decoration, one-step explanations, or content that would
be clearer as a short table in the guide.
