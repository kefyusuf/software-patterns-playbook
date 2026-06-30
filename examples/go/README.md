# Go Examples

This directory contains small, framework-free Go examples that support the documentation by showing pattern boundaries in plain code.

The examples are intentionally minimal:

- one focused pattern or pattern combination per example
- small package structure
- explicit dependency passing
- no web framework or external SDK dependency unless the example truly requires it

Start with:

- `payment-strategy` for policy selection and a small factory seam
- `notification-adapter` for external boundary translation and a lightweight decorator
- `checkout-chain` for ordered workflow steps and an explicit command boundary
- `order-processing-state` for lifecycle transitions and simple domain event recording
- `order-repository-dto` for repository boundaries and stable fulfillment payload mapping
- `order-domain-event` for decoupled follow-up reactions around an explicit business event
- `order-specification` for named business rules and repository-style filtering
