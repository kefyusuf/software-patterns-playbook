package order

import "testing"

func TestPrepareFulfillmentReturnsDTOAndPersistsState(t *testing.T) {
	repository := NewInMemoryRepository([]Order{
		New(
			"ord-4001",
			"pending",
			"Ada Lovelace",
			"Istanbul Warehouse Street 10",
			[]LineItem{
				{SKU: "kb-100", Quantity: 1},
				{SKU: "ms-200", Quantity: 2},
			},
		),
	})

	service := NewFulfillmentService(repository)

	payload, err := service.PrepareFulfillment("ord-4001")
	if err != nil {
		t.Fatalf("prepare fulfillment: %v", err)
	}

	if payload.Status != "ready-for-fulfillment" {
		t.Fatalf("expected ready-for-fulfillment status, got %s", payload.Status)
	}

	if len(payload.Items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(payload.Items))
	}

	saved := repository.MustGet("ord-4001")
	if saved.Status() != "ready-for-fulfillment" {
		t.Fatalf("expected persisted order status to be ready-for-fulfillment, got %s", saved.Status())
	}
}

func TestPrepareFulfillmentRejectsMissingOrder(t *testing.T) {
	repository := NewInMemoryRepository(nil)
	service := NewFulfillmentService(repository)

	if _, err := service.PrepareFulfillment("ord-missing"); err == nil {
		t.Fatal("expected missing order to fail")
	}
}
