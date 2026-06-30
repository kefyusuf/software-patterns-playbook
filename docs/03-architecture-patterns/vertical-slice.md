# Vertical Slice

## One-Line Definition

Vertical Slice organizes the code around features or use cases so each slice owns its request handling, orchestration, and supporting logic together.

## Problem

Changes to one feature require touching many technical layers and directories, making feature ownership diffuse and routine work expensive to coordinate.

## Context

This architecture works well when teams ship through distinct use cases and want each slice to hold the logic needed for one capability, rather than scattering it across global technical layers.

## When to Use

- Feature-level ownership matters more than horizontal layer purity.
- Most changes are use-case shaped rather than infrastructure shaped.
- The team wants faster tracing from request to behavior within one slice.

## When Not to Use

- The system is small enough that feature slicing would mostly rename folders.
- Shared domain or policy logic would end up duplicated without a clear rule for extraction.
- The team still benefits more from simple global layering conventions.

## Typical Shape

```txt
Features/
  Checkout/
    PlaceOrder/
  Notifications/
    SendNotification/
```

## Trade-Offs

| Benefit | Cost |
|---|---|
| Makes feature flows easier to trace and own | Shared concepts can fragment if extraction rules are weak |
| Reduces pass-through layering for use-case work | Can lead to duplication before the team finds the right shared seams |
| Fits command- and use-case-oriented systems well | Requires discipline to avoid every slice inventing its own conventions |

## Good Fit

- Products with clear use-case flows
- Teams that want tight feature ownership
- Systems where request-to-behavior traceability matters

## Bad Fit

- Small apps with little feature separation
- Teams that already struggle with duplication management
- Systems where most complexity sits in shared infrastructure rather than feature behavior

## Related Patterns

- [Command](../02-gof-patterns/behavioral/command.md) as a common request shape inside slices.
- [DTO](../04-enterprise-patterns/dto.md) for slice boundary inputs and outputs.
- [Domain Event](../04-enterprise-patterns/domain-event.md) when slices need decoupled follow-up reactions.

## Review Checklist

- [ ] Are slices aligned to real use cases instead of arbitrary folders?
- [ ] Is shared logic extracted only after recurring pressure becomes clear?
- [ ] Can the team trace one feature from entry to behavior without crossing the whole repo?
- [ ] Would a simpler layered structure be easier for the current team and product size?
