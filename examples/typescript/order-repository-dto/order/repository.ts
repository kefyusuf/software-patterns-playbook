import { Order } from "./order";

export interface OrderRepository {
  findPendingById(orderId: string): Order;
  save(order: Order): void;
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  constructor(seed: Order[]) {
    for (const order of seed) {
      this.orders.set(order.id(), order);
    }
  }

  findPendingById(orderId: string): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`order ${orderId} was not found`);
    }

    if (order.status() !== "pending") {
      throw new Error(`order ${orderId} is not pending`);
    }

    return order;
  }

  save(order: Order): void {
    this.orders.set(order.id(), order);
  }

  mustGet(orderId: string): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`order ${orderId} was not found`);
    }

    return order;
  }
}
