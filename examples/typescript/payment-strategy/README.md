# TypeScript Payment Strategy Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Strategy](../../../docs/02-gof-patterns/behavioral/strategy.md)
- [Factory](../../../docs/02-gof-patterns/creational/factory.md)
- [Payment system](../../../docs/05-real-world-scenarios/payment-system.md)

## What It Demonstrates

- interface-based strategy selection
- small factory boundary for provider lookup
- explicit charge request and result shapes

## What It Does Not Demonstrate

- real gateway SDKs
- retries
- persistence
- HTTP transport

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/payment-strategy/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/payment-strategy/payment.test.js
```

## Layout

```txt
payment-strategy/
  README.md
  main.ts
  payment.ts
  payment.test.ts
```
