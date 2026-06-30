package order

import "fmt"

type PlaceOrderCommand struct {
	OrderID    string
	CustomerID string
	TotalCents int
}

type Order struct {
	ID         string
	CustomerID string
	TotalCents int
}

type PlacementService struct {
	bus *EventBus
}

func NewPlacementService(bus *EventBus) PlacementService {
	return PlacementService{bus: bus}
}

func (s PlacementService) PlaceOrder(orderID string, customerID string, totalCents int) (Order, error) {
	command := PlaceOrderCommand{
		OrderID:    orderID,
		CustomerID: customerID,
		TotalCents: totalCents,
	}

	return s.Handle(command)
}

func (s PlacementService) Handle(command PlaceOrderCommand) (Order, error) {
	if command.OrderID == "" {
		return Order{}, fmt.Errorf("order id is required")
	}

	if command.CustomerID == "" {
		return Order{}, fmt.Errorf("customer id is required")
	}

	if command.TotalCents <= 0 {
		return Order{}, fmt.Errorf("total must be positive")
	}

	placedOrder := Order{
		ID:         command.OrderID,
		CustomerID: command.CustomerID,
		TotalCents: command.TotalCents,
	}

	s.bus.Publish(OrderPlaced{
		OrderID:    placedOrder.ID,
		CustomerID: placedOrder.CustomerID,
		TotalCents: placedOrder.TotalCents,
	})

	return placedOrder, nil
}
