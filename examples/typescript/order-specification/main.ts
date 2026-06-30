import { InMemoryOrderRepository } from "./order/repository";
import {
  andSpecification,
  NotRefundedSpecification,
  PaidSpecification,
  RefundWindowOpenSpecification
} from "./order/specification";
import { Order } from "./order/order";

const now = new Date(Date.UTC(2026, 5, 30, 12, 0, 0));

const repository = new InMemoryOrderRepository([
  Order.create("ord-ts-6001", true, false, new Date(now.getTime() - 24 * 60 * 60 * 1000), new Date(now.getTime() + 48 * 60 * 60 * 1000)),
  Order.create("ord-ts-6002", true, true, new Date(now.getTime() - 24 * 60 * 60 * 1000), new Date(now.getTime() + 48 * 60 * 60 * 1000)),
  Order.create("ord-ts-6003", true, false, new Date(now.getTime() - 96 * 60 * 60 * 1000), new Date(now.getTime() - 2 * 60 * 60 * 1000)),
  Order.create("ord-ts-6004", false, false, new Date(now.getTime() - 24 * 60 * 60 * 1000), new Date(now.getTime() + 48 * 60 * 60 * 1000))
]);

const specification = andSpecification(
  new PaidSpecification(),
  new NotRefundedSpecification(),
  new RefundWindowOpenSpecification(now)
);

const eligibleOrders = repository.findMatching(specification);

console.log(`eligible refundable orders: ${eligibleOrders.length}`);
for (const candidate of eligibleOrders) {
  console.log(`- ${candidate.id()}`);
}
