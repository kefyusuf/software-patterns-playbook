# TypeScript Checkout Chain Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Chain of Responsibility](../../../docs/02-gof-patterns/behavioral/chain-of-responsibility.md)
- [Command](../../../docs/02-gof-patterns/behavioral/command.md)
- [E-commerce checkout](../../../docs/05-real-world-scenarios/ecommerce-checkout.md)

## What It Demonstrates

- one explicit `CheckoutCommand`
- ordered checkout steps with early failure
- shared flow context without collapsing the whole workflow into one service

## What It Does Not Demonstrate

- async processing
- payment gateways
- persistence
- framework integration

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/checkout-chain/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/checkout-chain/checkout/pipeline.test.js
```

## Layout

```txt
checkout-chain/
  README.md
  main.ts
  checkout/
    command.ts
    pipeline.ts
    pipeline.test.ts
```
