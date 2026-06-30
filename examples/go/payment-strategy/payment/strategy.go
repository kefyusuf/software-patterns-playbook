package payment

import "fmt"

type ChargeRequest struct {
	Provider    string
	OrderID     string
	AmountCents int
	Currency    string
}

type ChargeResult struct {
	Provider      string
	Status        string
	TransactionID string
}

type Gateway interface {
	Charge(request ChargeRequest) (ChargeResult, error)
}

type StripeGateway struct{}

func (g StripeGateway) Charge(request ChargeRequest) (ChargeResult, error) {
	if request.AmountCents <= 0 {
		return ChargeResult{}, fmt.Errorf("amount must be positive")
	}

	return ChargeResult{
		Provider:      "stripe",
		Status:        "approved",
		TransactionID: "ch_stripe_" + request.OrderID,
	}, nil
}

type WalletGateway struct{}

func (g WalletGateway) Charge(request ChargeRequest) (ChargeResult, error) {
	if request.AmountCents <= 0 {
		return ChargeResult{}, fmt.Errorf("amount must be positive")
	}

	return ChargeResult{
		Provider:      "wallet",
		Status:        "approved",
		TransactionID: "ch_wallet_" + request.OrderID,
	}, nil
}
