package order

import "fmt"

type lifecycleState interface {
	name() string
	allocateInventory(*Order) error
	pack(*Order) error
	ship(*Order) error
}

type Order struct {
	id     string
	state  lifecycleState
	events []string
}

func New(id string) *Order {
	return &Order{
		id:    id,
		state: pendingState{},
	}
}

func (o *Order) ID() string {
	return o.id
}

func (o *Order) State() string {
	return o.state.name()
}

func (o *Order) Events() []string {
	return append([]string(nil), o.events...)
}

func (o *Order) AllocateInventory() error {
	return o.state.allocateInventory(o)
}

func (o *Order) Pack() error {
	return o.state.pack(o)
}

func (o *Order) Ship() error {
	return o.state.ship(o)
}

func (o *Order) transitionTo(next lifecycleState) {
	o.state = next
}

func (o *Order) record(event string) {
	o.events = append(o.events, event)
}

type pendingState struct{}

func (pendingState) name() string {
	return "pending"
}

func (pendingState) allocateInventory(o *Order) error {
	o.transitionTo(allocatedState{})
	o.record(fmt.Sprintf("OrderAllocated:%s", o.id))
	return nil
}

func (pendingState) pack(*Order) error {
	return fmt.Errorf("cannot pack while order is pending")
}

func (pendingState) ship(*Order) error {
	return fmt.Errorf("cannot ship while order is pending")
}

type allocatedState struct{}

func (allocatedState) name() string {
	return "allocated"
}

func (allocatedState) allocateInventory(*Order) error {
	return fmt.Errorf("inventory already allocated")
}

func (allocatedState) pack(o *Order) error {
	o.transitionTo(packedState{})
	o.record(fmt.Sprintf("OrderPacked:%s", o.id))
	return nil
}

func (allocatedState) ship(*Order) error {
	return fmt.Errorf("cannot ship before packing")
}

type packedState struct{}

func (packedState) name() string {
	return "packed"
}

func (packedState) allocateInventory(*Order) error {
	return fmt.Errorf("inventory already allocated")
}

func (packedState) pack(*Order) error {
	return fmt.Errorf("order is already packed")
}

func (packedState) ship(o *Order) error {
	o.transitionTo(shippedState{})
	o.record(fmt.Sprintf("OrderShipped:%s", o.id))
	return nil
}

type shippedState struct{}

func (shippedState) name() string {
	return "shipped"
}

func (shippedState) allocateInventory(*Order) error {
	return fmt.Errorf("cannot allocate inventory after shipping")
}

func (shippedState) pack(*Order) error {
	return fmt.Errorf("cannot pack after shipping")
}

func (shippedState) ship(*Order) error {
	return fmt.Errorf("order is already shipped")
}
