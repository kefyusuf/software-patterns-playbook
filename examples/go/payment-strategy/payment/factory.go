package payment

import "fmt"

func NewGateway(provider string) (Gateway, error) {
	switch provider {
	case "stripe":
		return StripeGateway{}, nil
	case "wallet":
		return WalletGateway{}, nil
	default:
		return nil, fmt.Errorf("unsupported provider: %s", provider)
	}
}
