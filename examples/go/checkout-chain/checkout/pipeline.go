package checkout

import "fmt"

type Context struct {
	Command Command
}

type Step interface {
	Handle(ctx *Context) error
}

type Processor struct {
	steps []Step
}

func NewProcessor(steps ...Step) Processor {
	return Processor{steps: steps}
}

func (p Processor) Process(command Command) (Result, error) {
	ctx := &Context{Command: command}

	for _, step := range p.steps {
		if err := step.Handle(ctx); err != nil {
			return Result{}, err
		}
	}

	return Result{
		OrderID: command.OrderID,
		Status:  "ready-for-order-creation",
	}, nil
}

type ValidateCartStep struct{}

func (ValidateCartStep) Handle(ctx *Context) error {
	if ctx.Command.ItemCount <= 0 {
		return fmt.Errorf("cart must contain at least one item")
	}

	return nil
}

type ValidatePaymentStep struct{}

func (ValidatePaymentStep) Handle(ctx *Context) error {
	switch ctx.Command.PaymentMethod {
	case "card", "wallet", "bank-transfer":
		return nil
	default:
		return fmt.Errorf("unsupported payment method: %s", ctx.Command.PaymentMethod)
	}
}

type ReserveInventoryStep struct{}

func (ReserveInventoryStep) Handle(ctx *Context) error {
	if !ctx.Command.InventoryLocked {
		return fmt.Errorf("inventory is not locked")
	}

	return nil
}
