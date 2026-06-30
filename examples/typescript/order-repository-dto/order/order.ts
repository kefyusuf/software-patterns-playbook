export type LineItem = {
  sku: string;
  quantity: number;
};

export class Order {
  private constructor(
    private readonly idValue: string,
    private statusValue: string,
    private readonly customerNameValue: string,
    private readonly shippingStreetValue: string,
    private readonly itemsValue: LineItem[]
  ) {}

  static create(
    id: string,
    status: string,
    customerName: string,
    shippingStreet: string,
    items: LineItem[]
  ): Order {
    return new Order(id, status, customerName, shippingStreet, [...items]);
  }

  id(): string {
    return this.idValue;
  }

  status(): string {
    return this.statusValue;
  }

  customerName(): string {
    return this.customerNameValue;
  }

  shippingStreet(): string {
    return this.shippingStreetValue;
  }

  items(): LineItem[] {
    return [...this.itemsValue];
  }

  markReadyForFulfillment(): void {
    if (this.statusValue !== "pending") {
      throw new Error(`order must be pending before fulfillment, got ${this.statusValue}`);
    }

    this.statusValue = "ready-for-fulfillment";
  }
}
