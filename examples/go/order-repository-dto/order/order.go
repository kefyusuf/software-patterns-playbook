package order

import "fmt"

type LineItem struct {
	SKU      string
	Quantity int
}

type Order struct {
	id             string
	status         string
	customerName   string
	shippingStreet string
	items          []LineItem
}

func New(id string, status string, customerName string, shippingStreet string, items []LineItem) Order {
	return Order{
		id:             id,
		status:         status,
		customerName:   customerName,
		shippingStreet: shippingStreet,
		items:          append([]LineItem(nil), items...),
	}
}

func (o Order) ID() string {
	return o.id
}

func (o Order) Status() string {
	return o.status
}

func (o Order) CustomerName() string {
	return o.customerName
}

func (o Order) ShippingStreet() string {
	return o.shippingStreet
}

func (o Order) Items() []LineItem {
	return append([]LineItem(nil), o.items...)
}

func (o *Order) MarkReadyForFulfillment() error {
	if o.status != "pending" {
		return fmt.Errorf("order must be pending before fulfillment, got %s", o.status)
	}

	o.status = "ready-for-fulfillment"
	return nil
}
