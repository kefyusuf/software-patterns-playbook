# TypeScript Order Domain Event Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Domain Event](../../../docs/04-enterprise-patterns/domain-event.md)
- [Command](../../../docs/02-gof-patterns/behavioral/command.md)
- [Order processing](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- explicit `OrderPlaced` event as a business fact
- in-process event bus with typed handlers
- decoupled notification and audit reactions

## What It Does Not Demonstrate

- queues or async delivery
- delivery guarantees
- persistence
- framework event emitters

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-domain-event/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/order-domain-event/order/service.test.js
```

## Layout

```txt
order-domain-event/
  README.md
  main.ts
  order/
    event.ts
    service.ts
    service.test.ts
```
