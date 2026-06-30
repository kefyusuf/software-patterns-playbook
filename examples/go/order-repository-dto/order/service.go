package order

type FulfillmentItemDTO struct {
	SKU      string
	Quantity int
}

type FulfillmentRequestDTO struct {
	OrderID        string
	CustomerName   string
	ShippingStreet string
	Items          []FulfillmentItemDTO
	Status         string
}

type FulfillmentService struct {
	repository Repository
}

func NewFulfillmentService(repository Repository) FulfillmentService {
	return FulfillmentService{repository: repository}
}

func (s FulfillmentService) PrepareFulfillment(orderID string) (FulfillmentRequestDTO, error) {
	order, err := s.repository.FindPendingByID(orderID)
	if err != nil {
		return FulfillmentRequestDTO{}, err
	}

	if err := order.MarkReadyForFulfillment(); err != nil {
		return FulfillmentRequestDTO{}, err
	}

	if err := s.repository.Save(order); err != nil {
		return FulfillmentRequestDTO{}, err
	}

	items := make([]FulfillmentItemDTO, 0, len(order.Items()))
	for _, item := range order.Items() {
		items = append(items, FulfillmentItemDTO{
			SKU:      item.SKU,
			Quantity: item.Quantity,
		})
	}

	return FulfillmentRequestDTO{
		OrderID:        order.ID(),
		CustomerName:   order.CustomerName(),
		ShippingStreet: order.ShippingStreet(),
		Items:          items,
		Status:         order.Status(),
	}, nil
}
