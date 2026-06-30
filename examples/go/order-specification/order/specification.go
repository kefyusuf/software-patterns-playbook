package order

import "time"

type Specification interface {
	IsSatisfiedBy(candidate Order) bool
}

type PaidSpecification struct{}

func (PaidSpecification) IsSatisfiedBy(candidate Order) bool {
	return candidate.IsPaid()
}

type NotRefundedSpecification struct{}

func (NotRefundedSpecification) IsSatisfiedBy(candidate Order) bool {
	return !candidate.IsRefunded()
}

type RefundWindowOpenSpecification struct {
	Now time.Time
}

func (s RefundWindowOpenSpecification) IsSatisfiedBy(candidate Order) bool {
	return s.Now.Before(candidate.RefundCutoff())
}

type andSpecification struct {
	specifications []Specification
}

func And(specifications ...Specification) Specification {
	return andSpecification{specifications: append([]Specification(nil), specifications...)}
}

func (s andSpecification) IsSatisfiedBy(candidate Order) bool {
	for _, specification := range s.specifications {
		if !specification.IsSatisfiedBy(candidate) {
			return false
		}
	}

	return true
}
