import { EventBus } from "./event";

export type PlaceOrderCommand = {
  orderId: string;
  customerId: string;
  totalCents: number;
};

export type Order = {
  id: string;
  customerId: string;
  totalCents: number;
};

export class PlacementService {
  constructor(private readonly bus: EventBus) {}

  placeOrder(command: PlaceOrderCommand): Order {
    if (command.orderId === "") {
      throw new Error("order id is required");
    }

    if (command.customerId === "") {
      throw new Error("customer id is required");
    }

    if (command.totalCents <= 0) {
      throw new Error("total must be positive");
    }

    const placedOrder: Order = {
      id: command.orderId,
      customerId: command.customerId,
      totalCents: command.totalCents
    };

    this.bus.publish({
      orderId: placedOrder.id,
      customerId: placedOrder.customerId,
      totalCents: placedOrder.totalCents
    });

    return placedOrder;
  }
}
