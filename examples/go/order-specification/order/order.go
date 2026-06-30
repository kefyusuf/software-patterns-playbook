package order

import "time"

type Order struct {
	id           string
	paid         bool
	refunded     bool
	placedAt     time.Time
	refundCutoff time.Time
}

func New(id string, paid bool, refunded bool, placedAt time.Time, refundCutoff time.Time) Order {
	return Order{
		id:           id,
		paid:         paid,
		refunded:     refunded,
		placedAt:     placedAt,
		refundCutoff: refundCutoff,
	}
}

func (o Order) ID() string {
	return o.id
}

func (o Order) IsPaid() bool {
	return o.paid
}

func (o Order) IsRefunded() bool {
	return o.refunded
}

func (o Order) PlacedAt() time.Time {
	return o.placedAt
}

func (o Order) RefundCutoff() time.Time {
	return o.refundCutoff
}
