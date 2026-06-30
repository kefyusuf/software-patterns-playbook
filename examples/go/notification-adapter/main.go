package main

import (
	"fmt"
	"notificationadapter/notification"
)

func main() {
	vendorClient := notification.NewVendorSMSClient("acme-sms")
	baseSender := notification.NewVendorSMSAdapter(vendorClient, "PLAYBOOK")
	sender := notification.NewLoggingSender(baseSender)

	input := notification.Message{
		Recipient: "+905551112233",
		Body:      "Your verification code is 492817.",
	}

	result, err := sender.Send(input)
	if err != nil {
		fmt.Printf("send failed: %v\n", err)
		return
	}

	fmt.Printf(
		"notification sent via=%s vendor-id=%s status=%s\n",
		result.Provider,
		result.VendorID,
		result.Status,
	)
}
