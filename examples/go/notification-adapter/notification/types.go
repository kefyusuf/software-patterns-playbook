package notification

type Message struct {
	Recipient string
	Body      string
}

type SendResult struct {
	Provider string
	VendorID string
	Status   string
}

type Sender interface {
	Send(message Message) (SendResult, error)
}
