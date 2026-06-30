package main

import (
	"fmt"
	"paymentstrategy/payment"
)

func main() {
	requests := []payment.ChargeRequest{
		{Provider: "stripe", OrderID: "ord-1001", AmountCents: 12500, Currency: "USD"},
		{Provider: "wallet", OrderID: "ord-1002", AmountCents: 3200, Currency: "USD"},
	}

	for _, request := range requests {
		gateway, err := payment.NewGateway(request.Provider)
		if err != nil {
			fmt.Printf("select gateway for %s: %v\n", request.OrderID, err)
			continue
		}

		result, err := gateway.Charge(request)
		if err != nil {
			fmt.Printf("charge %s failed: %v\n", request.OrderID, err)
			continue
		}

		fmt.Printf(
			"charged %s with %s -> status=%s transaction=%s\n",
			request.OrderID,
			result.Provider,
			result.Status,
			result.TransactionID,
		)
	}
}
