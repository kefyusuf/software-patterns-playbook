# Pattern vs Architecture

Patterns and architecture solve different questions.

## Pattern

A pattern helps with a recurring local or cross-cutting design problem such as construction, integration, or workflow variation.

## Architecture

Architecture defines larger structural boundaries such as layers, modules, ownership, runtime shape, and the main flow of control across the system.

## Working Relationship

- Architecture decides the broad shape of the system.
- Patterns help solve repeated design pressures inside that shape.

You should not use a small pattern to avoid thinking about architecture, and you should not use heavy architecture when a local pattern or simpler refactor is enough.
