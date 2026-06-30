# TypeScript Order Repository DTO Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Repository](../../../docs/04-enterprise-patterns/repository.md)
- [DTO](../../../docs/04-enterprise-patterns/dto.md)
- [Order processing](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- repository interface with domain-oriented retrieval
- in-memory repository implementation behind the interface
- DTO returned from the application service for a fulfillment boundary

## What It Does Not Demonstrate

- database access
- ORM integration
- external shipping API calls
- complex query specifications

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-repository-dto/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-repository-dto/order/service.test.js
```

## Layout

```txt
order-repository-dto/
  README.md
  main.ts
  order/
    order.ts
    repository.ts
    service.ts
    service.test.ts
```
