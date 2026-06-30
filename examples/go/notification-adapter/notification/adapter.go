package notification

import "fmt"

type VendorSMSClient struct {
	provider string
}

func NewVendorSMSClient(provider string) VendorSMSClient {
	return VendorSMSClient{provider: provider}
}

func (c VendorSMSClient) Dispatch(phone string, text string, originator string) (string, error) {
	if phone == "" {
		return "", fmt.Errorf("recipient phone is required")
	}

	if text == "" {
		return "", fmt.Errorf("message body is required")
	}

	return c.provider + "_msg_001", nil
}

type VendorSMSAdapter struct {
	client     VendorSMSClient
	originator string
}

func NewVendorSMSAdapter(client VendorSMSClient, originator string) VendorSMSAdapter {
	return VendorSMSAdapter{
		client:     client,
		originator: originator,
	}
}

func (a VendorSMSAdapter) Send(message Message) (SendResult, error) {
	vendorID, err := a.client.Dispatch(message.Recipient, message.Body, a.originator)
	if err != nil {
		return SendResult{}, err
	}

	return SendResult{
		Provider: a.client.provider,
		VendorID: vendorID,
		Status:   "accepted",
	}, nil
}
