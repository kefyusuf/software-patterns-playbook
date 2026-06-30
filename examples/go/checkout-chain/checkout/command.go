package checkout

type Command struct {
	OrderID         string
	ItemCount       int
	PaymentMethod   string
	InventoryLocked bool
}

type Result struct {
	OrderID string
	Status  string
}
