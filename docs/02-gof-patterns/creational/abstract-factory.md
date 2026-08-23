---
title: Abstract Factory
category: creational
level: intermediate-to-advanced
project_layers:
  - application
  - infrastructure
  - testing
related_patterns:
  - Factory Method
  - Factory
  - Adapter
---

# Abstract Factory

## One-Line Definition

Abstract Factory creates whole *families* of related objects through one interface, so a variant is chosen once and every collaborator it produces stays mutually consistent.

## Problem

Several collaborators must match each other: a storage client, a queue client, and a lock client that all speak to the same cloud provider. If callers assemble them independently, mismatched combinations slip through — an S3 storage with an Azure queue, or a light-theme dialog with a dark-theme checkbox.

## Context

This shows up in multi-provider integrations, theming, per-tenant suites, and test environments where the entire stack of side-effecting collaborators must switch together.

## When to Use

- Objects come in families whose members must stay compatible.
- The family choice is made once (config, tenant, environment) and used everywhere.
- You want to add a new provider by adding one consistent set of implementations.

## When Not to Use

- There is only one product per family; use [Factory](./factory.md) or [Factory Method](./factory-method.md).
- Families mostly share members; composing independent factories is clearer.
- The "family" keeps growing new product types; every addition rewrites the interface and all concrete sets.

## Where It Lives in a Project

| Layer | Typical Usage |
|---|---|
| Presentation | Theme kits producing matched buttons, inputs, dialogs. |
| Application | Choosing the collaborator suite for a deployment target. |
| Domain | Rare; domain logic should not know about provider families. |
| Infrastructure | Cloud provider SDK bundles behind internal contracts. |
| Testing | An in-memory factory family mirroring the production family's shape. |

## Real-World Examples

- A multi-cloud module picks AWS, Azure, or GCP at boot and receives matched storage, queue, and secret clients.
- A PDF vs HTML report kit produces its own table builder, chart builder, and writer so parts never mix.
- A game spawns a "forest" or "desert" asset kit where terrain, props, and sounds are designed as a set.

## Code Smell Before the Pattern

The smell is parallel branching assembling matched sets in many places:

```php
if ($cloud === 'aws') {
    $storage = new S3Storage($cfg);
    $queue   = new SqsQueue($cfg);
} elseif ($cloud === 'azure') {
    $storage = new BlobStorage($cfg);
    $queue   = new AzureQueue($cfg);
}
// repeated in three services, drifting apart over time
```

Nothing prevents mixing `S3Storage` with `AzureQueue` after the next copy-paste.

## Minimal Example

```php
interface CloudToolkit
{
    public function storage(): Storage;
    public function queue(): Queue;
}

final class AwsToolkit implements CloudToolkit
{
    public function storage(): Storage { return new S3Storage(); }
    public function queue(): Queue     { return new SqsQueue(); }
}

final class AzureToolkit implements CloudToolkit
{
    public function storage(): Storage { return new BlobStorage(); }
    public function queue(): Queue     { return new AzureQueue(); }
}

final class SyncService
{
    public function __construct(private readonly CloudToolkit $toolkit) {}

    public function run(): void
    {
        $storage = $this->toolkit->storage();
        $queue   = $this->toolkit->queue();
        // members are guaranteed to belong to the same family
    }
}
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Family consistency is enforced by construction | Interface grows with every product type in the family |
| Switching providers is one decision | Adding a family means implementing every product type |
| Callers depend on product interfaces only | Can become a hidden service locator if scope drifts |

## Related Patterns

- [Factory Method](./factory-method.md) when a workflow needs exactly one created collaborator, not a family.
- Adapter when individual family members wrap external SDKs with mismatched interfaces.
- Facade when what you actually need is a simplified front door, not guaranteed member compatibility.

## Common Mistakes

- Defining families so broad that the interface becomes a grab-bag of unrelated products.
- Creating half a family manually because one product was "just this once" different.
- Reaching for Abstract Factory when a single constructor with injected dependencies already guarantees consistency.

## Review Checklist

- [ ] Is the problem real and recurring?
- [ ] Is the abstraction justified?
- [ ] Does this pattern reduce coupling or complexity?
- [ ] Are the trade-offs acceptable?
- [ ] Would a simpler solution work?
