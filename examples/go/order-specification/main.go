package main

import (
	"fmt"
	"orderspecification/order"
	"time"
)

func main() {
	now := time.Date(2026, time.June, 30, 12, 0, 0, 0, time.UTC)
	repository := order.NewInMemoryRepository([]order.Order{
		order.New("ord-6001", true, false, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
		order.New("ord-6002", true, true, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
		order.New("ord-6003", true, false, now.Add(-96*time.Hour), now.Add(-2*time.Hour)),
		order.New("ord-6004", false, false, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
	})

	specification := order.And(
		order.PaidSpecification{},
		order.NotRefundedSpecification{},
		order.RefundWindowOpenSpecification{Now: now},
	)

	eligibleOrders := repository.FindMatching(specification)

	fmt.Printf("eligible refundable orders: %d\n", len(eligibleOrders))
	for _, candidate := range eligibleOrders {
		fmt.Printf("- %s\n", candidate.ID())
	}
}
