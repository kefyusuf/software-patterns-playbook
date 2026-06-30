package order

import "fmt"

type Repository interface {
	FindPendingByID(orderID string) (Order, error)
	Save(order Order) error
}

type InMemoryRepository struct {
	orders map[string]Order
}

func NewInMemoryRepository(seed []Order) *InMemoryRepository {
	orders := make(map[string]Order, len(seed))
	for _, order := range seed {
		orders[order.ID()] = order
	}

	return &InMemoryRepository{orders: orders}
}

func (r *InMemoryRepository) FindPendingByID(orderID string) (Order, error) {
	order, ok := r.orders[orderID]
	if !ok {
		return Order{}, fmt.Errorf("order %s was not found", orderID)
	}

	if order.Status() != "pending" {
		return Order{}, fmt.Errorf("order %s is not pending", orderID)
	}

	return order, nil
}

func (r *InMemoryRepository) Save(order Order) error {
	r.orders[order.ID()] = order
	return nil
}

func (r *InMemoryRepository) MustGet(orderID string) Order {
	return r.orders[orderID]
}
