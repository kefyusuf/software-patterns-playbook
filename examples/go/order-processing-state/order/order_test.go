package order

import "testing"

func TestHappyPathTransitionsAndEvents(t *testing.T) {
	order := New("ord-3001")

	if err := order.AllocateInventory(); err != nil {
		t.Fatalf("allocate inventory: %v", err)
	}

	if err := order.Pack(); err != nil {
		t.Fatalf("pack: %v", err)
	}

	if err := order.Ship(); err != nil {
		t.Fatalf("ship: %v", err)
	}

	if got := order.State(); got != "shipped" {
		t.Fatalf("expected shipped state, got %s", got)
	}

	events := order.Events()
	if len(events) != 3 {
		t.Fatalf("expected 3 events, got %d", len(events))
	}
}

func TestInvalidTransitionFromPending(t *testing.T) {
	order := New("ord-3002")

	if err := order.Ship(); err == nil {
		t.Fatal("expected shipping from pending to fail")
	}

	if got := order.State(); got != "pending" {
		t.Fatalf("expected pending state, got %s", got)
	}
}
