# Order Domain Event Example

This example shows a minimal Go implementation of the ideas described in:

- [Domain Event](../../../docs/04-enterprise-patterns/domain-event.md)
- [Command](../../../docs/02-gof-patterns/behavioral/command.md)
- [Order Processing scenario](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- explicit `OrderPlaced` event as a business fact
- simple in-process event bus used by the application boundary
- decoupled follow-up reactions for notifications and audit logging

## What It Does Not Demonstrate

- queues or async delivery
- retries or delivery guarantees
- persistence
- distributed event choreography

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
order-domain-event/
  go.mod
  main.go
  order/
    event.go
    service.go
    service_test.go
```
