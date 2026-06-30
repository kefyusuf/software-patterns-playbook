package notification

import "fmt"

type LoggingSender struct {
	inner Sender
}

func NewLoggingSender(inner Sender) LoggingSender {
	return LoggingSender{inner: inner}
}

func (d LoggingSender) Send(message Message) (SendResult, error) {
	fmt.Printf("sending notification to %s\n", message.Recipient)

	result, err := d.inner.Send(message)
	if err != nil {
		fmt.Printf("notification failed for %s: %v\n", message.Recipient, err)
		return SendResult{}, err
	}

	fmt.Printf("notification accepted by %s\n", result.Provider)
	return result, nil
}
