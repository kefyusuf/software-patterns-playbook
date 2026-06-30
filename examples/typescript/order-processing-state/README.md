# TypeScript Order Processing State Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [State](../../../docs/02-gof-patterns/behavioral/state.md)
- [Domain Event](../../../docs/04-enterprise-patterns/domain-event.md)
- [Order processing](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- explicit lifecycle states instead of scattered status checks
- transition rules owned by state objects
- simple event recording when meaningful order transitions happen

## What It Does Not Demonstrate

- persistence
- async event delivery
- retries or compensation
- external integrations

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-processing-state/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-processing-state/order/order.test.js
```

## Layout

```txt
order-processing-state/
  README.md
  main.ts
  order/
    order.ts
    order.test.ts
```
