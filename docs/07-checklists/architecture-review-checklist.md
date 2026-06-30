# Architecture Review Checklist

Use this checklist when evaluating whether a proposed design is proportionate to the problem it solves.

- [ ] Which parts of the design are driven by real current pressure?
- [ ] Which parts are speculative future-proofing?
- [ ] Are external systems isolated behind stable boundaries?
- [ ] Are business rules explicit and testable?
- [ ] Does the workflow stay understandable end to end?
- [ ] Are we introducing global state or generic wrappers without clear value?
- [ ] Is the design easier to change than the simpler alternative it replaced?
- [ ] Can the team explain why this structure is better now, not just later?

See also:
- [Choose by Code Smell](../01-decision-guides/choose-by-code-smell.md)
- [Pattern for Pattern's Sake](../06-anti-patterns/pattern-for-patterns-sake.md)
- [God Service](../06-anti-patterns/god-service.md)
