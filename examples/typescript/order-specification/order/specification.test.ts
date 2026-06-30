import { Order } from "./order";
import { InMemoryOrderRepository } from "./repository";
import {
  andSpecification,
  NotRefundedSpecification,
  PaidSpecification,
  RefundWindowOpenSpecification
} from "./specification";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

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

const matches = repository.findMatching(specification);
assert(matches.length === 1, `expected 1 refundable order, got ${matches.length}`);
assert(matches[0]?.id() === "ord-ts-6001", `expected ord-ts-6001, got ${matches[0]?.id()}`);

const expiredOrder = Order.create(
  "ord-ts-6005",
  true,
  false,
  new Date(now.getTime() - 96 * 60 * 60 * 1000),
  new Date(now.getTime() - 2 * 60 * 60 * 1000)
);

const refundWindowOpen = new RefundWindowOpenSpecification(now);
assert(!refundWindowOpen.isSatisfiedBy(expiredOrder), "expected expired refund window to fail");

console.log("order-specification tests passed");
