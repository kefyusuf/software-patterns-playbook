package order

import "testing"

func TestPlaceOrderPublishesEventToAllHandlers(t *testing.T) {
	bus := NewEventBus()
	notifications := &NotificationHandler{}
	audit := &AuditHandler{}

	bus.Subscribe(notifications.HandleOrderPlaced)
	bus.Subscribe(audit.HandleOrderPlaced)

	service := NewPlacementService(bus)

	placedOrder, err := service.PlaceOrder("ord-5001", "cust-100", 15900)
	if err != nil {
		t.Fatalf("place order: %v", err)
	}

	if placedOrder.ID != "ord-5001" {
		t.Fatalf("expected order id ord-5001, got %s", placedOrder.ID)
	}

	if len(notifications.Messages) != 1 {
		t.Fatalf("expected 1 notification message, got %d", len(notifications.Messages))
	}

	if len(audit.Entries) != 1 {
		t.Fatalf("expected 1 audit entry, got %d", len(audit.Entries))
	}
}

func TestPlaceOrderRejectsInvalidTotal(t *testing.T) {
	service := NewPlacementService(NewEventBus())

	if _, err := service.PlaceOrder("ord-5002", "cust-200", 0); err == nil {
		t.Fatal("expected invalid total to fail")
	}
}
