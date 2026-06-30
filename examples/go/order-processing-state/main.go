package main

import (
	"fmt"
	"orderprocessingstate/order"
)

func main() {
	pending := order.New("ord-3001")

	fmt.Printf("order %s starts in state=%s\n", pending.ID(), pending.State())

	if err := pending.AllocateInventory(); err != nil {
		fmt.Printf("allocate failed: %v\n", err)
		return
	}

	if err := pending.Pack(); err != nil {
		fmt.Printf("pack failed: %v\n", err)
		return
	}

	if err := pending.Ship(); err != nil {
		fmt.Printf("ship failed: %v\n", err)
		return
	}

	fmt.Printf("order %s finished in state=%s\n", pending.ID(), pending.State())
	fmt.Println("events:")
	for _, event := range pending.Events() {
		fmt.Printf("- %s\n", event)
	}

	fmt.Println()

	failed := order.New("ord-3002")
	if err := failed.Ship(); err != nil {
		fmt.Printf("invalid transition for %s: %v\n", failed.ID(), err)
	}
}
