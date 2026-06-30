# Order Specification Example

This example shows a minimal Go implementation of the ideas described in:

- [Specification](../../../docs/04-enterprise-patterns/specification.md)
- [Repository](../../../docs/04-enterprise-patterns/repository.md)
- [Order Processing scenario](../../../docs/05-real-world-scenarios/order-processing.md)

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
go run .
```

## Test

```bash
go test ./...
```

## Layout

```txt
order-specification/
  go.mod
  main.go
  order/
    order.go
    repository.go
    specification.go
    specification_test.go
```
