package order

type InMemoryRepository struct {
	orders []Order
}

func NewInMemoryRepository(orders []Order) InMemoryRepository {
	return InMemoryRepository{
		orders: append([]Order(nil), orders...),
	}
}

func (r InMemoryRepository) FindMatching(specification Specification) []Order {
	matches := make([]Order, 0)

	for _, candidate := range r.orders {
		if specification.IsSatisfiedBy(candidate) {
			matches = append(matches, candidate)
		}
	}

	return matches
}
