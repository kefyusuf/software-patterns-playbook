package order

import (
	"testing"
	"time"
)

func TestCompositeSpecificationFiltersRefundableOrders(t *testing.T) {
	now := time.Date(2026, time.June, 30, 12, 0, 0, 0, time.UTC)
	repository := NewInMemoryRepository([]Order{
		New("ord-6001", true, false, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
		New("ord-6002", true, true, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
		New("ord-6003", true, false, now.Add(-96*time.Hour), now.Add(-2*time.Hour)),
		New("ord-6004", false, false, now.Add(-24*time.Hour), now.Add(48*time.Hour)),
	})

	specification := And(
		PaidSpecification{},
		NotRefundedSpecification{},
		RefundWindowOpenSpecification{Now: now},
	)

	matches := repository.FindMatching(specification)

	if len(matches) != 1 {
		t.Fatalf("expected 1 refundable order, got %d", len(matches))
	}

	if matches[0].ID() != "ord-6001" {
		t.Fatalf("expected ord-6001, got %s", matches[0].ID())
	}
}

func TestRefundWindowOpenSpecificationRejectsExpiredOrder(t *testing.T) {
	now := time.Date(2026, time.June, 30, 12, 0, 0, 0, time.UTC)
	specification := RefundWindowOpenSpecification{Now: now}
	candidate := New("ord-6003", true, false, now.Add(-96*time.Hour), now.Add(-2*time.Hour))

	if specification.IsSatisfiedBy(candidate) {
		t.Fatal("expected expired refund window to fail")
	}
}
