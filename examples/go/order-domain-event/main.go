package main

import (
	"fmt"
	"orderdomainevent/order"
)

func main() {
	bus := order.NewEventBus()
	notifications := &order.NotificationHandler{}
	audit := &order.AuditHandler{}

	bus.Subscribe(notifications.HandleOrderPlaced)
	bus.Subscribe(audit.HandleOrderPlaced)

	service := order.NewPlacementService(bus)

	placedOrder, err := service.PlaceOrder("ord-5001", "cust-100", 15900)
	if err != nil {
		fmt.Printf("place order failed: %v\n", err)
		return
	}

	fmt.Printf(
		"placed order %s for customer=%s total=%d\n",
		placedOrder.ID,
		placedOrder.CustomerID,
		placedOrder.TotalCents,
	)

	fmt.Println("notifications:")
	for _, message := range notifications.Messages {
		fmt.Printf("- %s\n", message)
	}

	fmt.Println("audit entries:")
	for _, entry := range audit.Entries {
		fmt.Printf("- %s\n", entry)
	}
}
