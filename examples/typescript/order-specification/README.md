# TypeScript Order Specification Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Specification](../../../docs/04-enterprise-patterns/specification.md)
- [Repository](../../../docs/04-enterprise-patterns/repository.md)
- [Order processing](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- named business rules instead of repeated inline filters
- simple `and` composition across multiple specifications
- repository-style filtering based on domain rule intent

## What It Does Not Demonstrate

- database query translation
- dynamic specification builders
- generic query DSL infrastructure
- distributed policy evaluation

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-specification/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-specification/order/specification.test.js
```

## Layout

```txt
order-specification/
  README.md
  main.ts
  order/
    order.ts
    repository.ts
    specification.ts
    specification.test.ts
```
