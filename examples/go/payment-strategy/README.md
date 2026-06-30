# Payment Strategy Example

This example shows a minimal Go implementation of the ideas described in:

- [Strategy](../../../docs/02-gof-patterns/behavioral/strategy.md)
- [Factory](../../../docs/02-gof-patterns/creational/factory.md)
- [Payment system scenario](../../../docs/05-real-world-scenarios/payment-system.md)

## What It Demonstrates

- one stable `Gateway` interface
- multiple charging strategies behind that interface
- a small factory function for provider selection
- application code that depends on capability instead of concrete gateway types

## What It Does Not Demonstrate

- retries
- real HTTP clients
- persistence
- framework integration

## Run

```bash
go run .
```

## Layout

```txt
payment-strategy/
  go.mod
  main.go
  payment/
    factory.go
    strategy.go
```
