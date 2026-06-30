import { LineItem, Order } from "./order";
import { InMemoryOrderRepository } from "./repository";
import { FulfillmentService } from "./service";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(run: () => void, expectedMessage: string): void {
  try {
    run();
    throw new Error("expected function to throw");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    assert(message.includes(expectedMessage), `expected error to include "${expectedMessage}", got "${message}"`);
  }
}

const seedItems: LineItem[] = [
  { sku: "kb-100", quantity: 1 },
  { sku: "ms-200", quantity: 2 }
];

const repository = new InMemoryOrderRepository([
  Order.create("ord-ts-4001", "pending", "Ada Lovelace", "Istanbul Warehouse Street 10", seedItems)
]);

const service = new FulfillmentService(repository);
const payload = service.prepareFulfillment("ord-ts-4001");

assert(payload.status === "ready-for-fulfillment", "expected ready-for-fulfillment status");
assert(payload.items.length === 2, "expected two DTO items");
assert(repository.mustGet("ord-ts-4001").status() === "ready-for-fulfillment", "expected saved order status");

assertThrows(() => service.prepareFulfillment("ord-missing"), "was not found");

console.log("order-repository-dto tests passed");
