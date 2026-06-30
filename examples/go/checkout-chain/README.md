# Checkout Chain Example

This example shows a minimal Go implementation of the ideas described in:

- [Chain of Responsibility](../../../docs/02-gof-patterns/behavioral/chain-of-responsibility.md)
- [Command](../../../docs/02-gof-patterns/behavioral/command.md)
- [E-commerce checkout scenario](../../../docs/05-real-world-scenarios/ecommerce-checkout.md)

## What It Demonstrates

- one explicit `CheckoutCommand`
- ordered checkout steps with early failure
- shared flow context without collapsing the whole workflow into one service

## What It Does Not Demonstrate

- async processing
- payment gateways
- persistence
- framework integration

## Run

```bash
go run .
```

## Layout

```txt
checkout-chain/
  go.mod
  main.go
  checkout/
    command.go
    pipeline.go
```
