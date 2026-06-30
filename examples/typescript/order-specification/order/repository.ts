import { Order } from "./order";
import { Specification } from "./specification";

export class InMemoryOrderRepository {
  constructor(private readonly orders: Order[]) {}

  findMatching(specification: Specification<Order>): Order[] {
    return this.orders.filter((candidate) => specification.isSatisfiedBy(candidate));
  }
}
