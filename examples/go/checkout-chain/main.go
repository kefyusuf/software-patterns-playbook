package main

import (
	"checkoutchain/checkout"
	"fmt"
)

func main() {
	processor := checkout.NewProcessor(
		checkout.ValidateCartStep{},
		checkout.ValidatePaymentStep{},
		checkout.ReserveInventoryStep{},
	)

	command := checkout.Command{
		OrderID:         "ord-2001",
		ItemCount:       2,
		PaymentMethod:   "card",
		InventoryLocked: true,
	}

	result, err := processor.Process(command)
	if err != nil {
		fmt.Printf("checkout failed: %v\n", err)
		return
	}

	fmt.Printf("checkout completed for %s -> %s\n", result.OrderID, result.Status)
}
