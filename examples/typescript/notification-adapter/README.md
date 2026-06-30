# TypeScript Notification Adapter Example

This example shows a minimal TypeScript implementation of the ideas described in:

- [Adapter](../../../docs/02-gof-patterns/structural/adapter.md)
- [Decorator](../../../docs/02-gof-patterns/structural/decorator.md)
- [Notification system](../../../docs/05-real-world-scenarios/notification-system.md)

## What It Demonstrates

- one stable internal `Sender` contract
- one vendor-specific SMS client with a mismatched payload shape
- one adapter that translates internal notification data into vendor terms
- one lightweight decorator for logging around the stable sender contract

## What It Does Not Demonstrate

- async queues
- retries
- provider selection strategy
- real network calls

## Run

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/notification-adapter/main.js
```

## Test

```bash
tsc -p examples/typescript/tsconfig.json
node examples/typescript/dist/notification-adapter/notification/notification.test.js
```

## Layout

```txt
notification-adapter/
  README.md
  main.ts
  notification/
    notification.ts
    notification.test.ts
```
