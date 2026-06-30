# Order Repository DTO Example

This example shows a minimal Go implementation of the ideas described in:

- [Repository](../../../docs/04-enterprise-patterns/repository.md)
- [DTO](../../../docs/04-enterprise-patterns/dto.md)
- [Order Processing scenario](../../../docs/05-real-world-scenarios/order-processing.md)

## What It Demonstrates

- repository interface with domain-oriented retrieval
- in-memory repository implementation kept behind the interface
- DTO returned from the application service for a fulfillment boundary

## What It Does Not Demonstrate

- database access
- ORM integration
- external shipping API calls
- complex query specifications

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
order-repository-dto/
  go.mod
  main.go
  order/
    order.go
    repository.go
    service.go
    service_test.go
```
