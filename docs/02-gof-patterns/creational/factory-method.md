---
title: Factory Method
category: creational
level: intermediate
project_layers:
  - application
  - domain
  - infrastructure
  - testing
related_patterns:
  - Factory
  - Abstract Factory
  - Template Method
---

# Factory Method

## One-Line Definition

Factory Method lets a base workflow define *when* a collaborator is created while subclasses (or concrete implementations) decide *which* concrete class is created, by overriding a single creation hook.

## Problem

A shared workflow knows the exact moment a collaborator must appear, but the concrete type of that collaborator depends on the variant of the workflow. If the base class constructs every possible variant itself, it accumulates branching, optional dependencies, and knowledge of concrete classes it should never have owned.

## Context

This appears in frameworks, plugin systems, and layered workflows where a generic process is extended by specific implementations. Export pipelines, job runners, and repository base classes are common hosts for this decision point.

## When to Use

- A stable workflow needs a collaborator whose concrete type varies per implementation.
- You want to add a new variant by adding a class, not by editing the shared workflow.
- A library or framework defines the process while application code supplies the pieces.

## When Not to Use

- Selection happens in one place before the workflow starts; a plain [Factory](./factory.md) entry point is enough.
- There is no meaningful variation; the hook would always return the same class.
- The creation decision depends on runtime input rather than on the subtype identity; pass the choice in as a parameter instead.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Rare; occasionally per-channel view factories. |
| Application | Base use-case classes letting each flow supply its own gateway or store. |
| Domain | Creating domain services or policy objects appropriate to an aggregate family. |
| Infrastructure | Framework adapters exposing creation hooks for provider-specific clients. |
| Testing | Substituting fakes by overriding the creation hook instead of patching globals. |

## Real-World Examples

- An export framework owns the render-and-deliver flow; each exporter subclass supplies its own renderer (PDF, CSV, XLSX).
- A background-job runner calls a `createStorage()` hook; S3-backed and disk-backed runners return different implementations.
- A reporting library lets each integration define how to build its HTTP client without exposing the rest of the pipeline.

## Code Smell Before the Pattern

The smell is a base class carrying every variant's dependencies and branching over them:

```php
final class ExportService
{
    public function __construct(
        private readonly ?PdfRenderer $pdf = null,
        private readonly ?CsvRenderer $csv = null,
        private readonly ?XlsxRenderer $xlsx = null,
    ) {
    }

    public function run(string $format): void
    {
        $renderer = match ($format) {
            'pdf' => $this->pdf,
            'csv' => $this->csv,
            'xlsx' => $this->xlsx,
        };
        // shared flow mixed with variant wiring
    }
}
```

Every new format edits the shared class and its constructor signature.

## Minimal Example

```php
interface Renderer
{
    public function render(Document $document): string;
}

abstract class DocumentExporter
{
    public function export(Document $document): void
    {
        $renderer = $this->createRenderer();
        $output   = $renderer->render($document);
        $this->deliver($output);
    }

    abstract protected function createRenderer(): Renderer;

    protected function deliver(string $output): void
    {
        // shared delivery logic
    }
}

final class PdfDocumentExporter extends DocumentExporter
{
    protected function createRenderer(): Renderer
    {
        return new PdfRenderer();
    }
}
```

The shared flow never mentions concrete renderers again.

## Trade-Offs

| Benefit | Cost |
|---|---|
| Shared workflow stops depending on concrete variants | Adds an inheritance relationship that must earn its keep |
| New variants arrive as new classes only | Hook placement matters; wrong seams force awkward overrides |
| Tests override one hook instead of mocking containers | Can hide creation rules deep in subclass behavior |

## Related Patterns

- [Factory](./factory.md) when you only need centralized selection up front, not a hook inside a workflow. This repository's Factory guide covers that simpler shape.
- Abstract Factory when a variant needs a whole consistent *family* of created collaborators, not a single one.
- Template Method because Factory Method is essentially Template Method applied to a creation step.

## Common Mistakes

- Using Factory Method when there is no inheritance hierarchy to justify the hook.
- Putting business decisions inside the hook so subclasses must duplicate them.
- Letting the base class call other overridable methods from the constructor, which breaks subclass initialization order.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
