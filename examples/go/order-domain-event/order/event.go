package order

import "fmt"

type OrderPlaced struct {
	OrderID    string
	CustomerID string
	TotalCents int
}

type EventHandler func(OrderPlaced)

type EventBus struct {
	handlers []EventHandler
}

func NewEventBus() *EventBus {
	return &EventBus{}
}

func (b *EventBus) Subscribe(handler EventHandler) {
	b.handlers = append(b.handlers, handler)
}

func (b *EventBus) Publish(event OrderPlaced) {
	for _, handler := range b.handlers {
		handler(event)
	}
}

type NotificationHandler struct {
	Messages []string
}

func (h *NotificationHandler) HandleOrderPlaced(event OrderPlaced) {
	h.Messages = append(
		h.Messages,
		fmt.Sprintf("send confirmation for %s to %s", event.OrderID, event.CustomerID),
	)
}

type AuditHandler struct {
	Entries []string
}

func (h *AuditHandler) HandleOrderPlaced(event OrderPlaced) {
	h.Entries = append(
		h.Entries,
		fmt.Sprintf("record OrderPlaced:%s total=%d", event.OrderID, event.TotalCents),
	)
}
