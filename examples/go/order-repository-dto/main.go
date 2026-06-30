package main

import (
	"fmt"
	"orderrepositorydto/order"
)

func main() {
	repository := order.NewInMemoryRepository([]order.Order{
		order.New(
			"ord-4001",
			"pending",
			"Ada Lovelace",
			"Istanbul Warehouse Street 10",
			[]order.LineItem{
				{SKU: "kb-100", Quantity: 1},
				{SKU: "ms-200", Quantity: 2},
			},
		),
	})

	service := order.NewFulfillmentService(repository)

	payload, err := service.PrepareFulfillment("ord-4001")
	if err != nil {
		fmt.Printf("prepare fulfillment failed: %v\n", err)
		return
	}

	fmt.Printf(
		"prepared fulfillment for %s -> customer=%s items=%d status=%s\n",
		payload.OrderID,
		payload.CustomerName,
		len(payload.Items),
		payload.Status,
	)
}
