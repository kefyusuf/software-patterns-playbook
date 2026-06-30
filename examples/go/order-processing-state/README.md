# Order Processing State Example

This example shows a minimal Go implementation of the ideas described in:

- [State](../../../docs/02-gof-patterns/behavioral/state.md)
- [Domain Event](../../../docs/04-enterprise-patterns/domain-event.md)
- [Order Processing scenario](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- explicit lifecycle states instead of scattered status checks
- transition rules owned by state types
- simple event recording when meaningful order transitions happen

## What It Does Not Demonstrate

- persistence
- async event delivery
- retries or compensation
- external integrations

## Run

```bash
go run .
```

## Test

```bash
go test ./...
```

## Layout

```txt
order-processing-state/
  go.mod
  main.go
  order/
    order.go
    order_test.go
```
