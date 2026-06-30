# Notification Adapter Example

This example shows a minimal Go implementation of the ideas described in:

- [Adapter](../../../docs/02-gof-patterns/structural/adapter.md)
- [Decorator](../../../docs/02-gof-patterns/structural/decorator.md)
- [Notification system scenario](../../../docs/05-real-world-scenarios/notification-system.md)

## What It Demonstrates

- one stable internal `Sender` contract
- one vendor-specific SMS client with a mismatched API
- one adapter that translates internal notification data to vendor format
- one lightweight decorator for logging around the stable sender contract

## What It Does Not Demonstrate

- async queues
- retries
- provider selection strategy
- real network calls

## Run

```bash
go run .
```

## Layout

```txt
notification-adapter/
  go.mod
  main.go
  notification/
    adapter.go
    decorator.go
    types.go
```
