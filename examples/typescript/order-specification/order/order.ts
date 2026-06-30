export class Order {
  private constructor(
    private readonly idValue: string,
    private readonly paidValue: boolean,
    private readonly refundedValue: boolean,
    private readonly placedAtValue: Date,
    private readonly refundCutoffValue: Date
  ) {}

  static create(
    id: string,
    paid: boolean,
    refunded: boolean,
    placedAt: Date,
    refundCutoff: Date
  ): Order {
    return new Order(id, paid, refunded, placedAt, refundCutoff);
  }

  id(): string {
    return this.idValue;
  }

  isPaid(): boolean {
    return this.paidValue;
  }

  isRefunded(): boolean {
    return this.refundedValue;
  }

  placedAt(): Date {
    return this.placedAtValue;
  }

  refundCutoff(): Date {
    return this.refundCutoffValue;
  }
}
