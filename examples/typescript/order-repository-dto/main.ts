import { InMemoryOrderRepository } from "./order/repository";
import { LineItem, Order } from "./order/order";
import { FulfillmentService } from "./order/service";

const seedItems: LineItem[] = [
  { sku: "kb-100", quantity: 1 },
  { sku: "ms-200", quantity: 2 }
];

const repository = new InMemoryOrderRepository([
  Order.create("ord-ts-4001", "pending", "Ada Lovelace", "Istanbul Warehouse Street 10", seedItems)
]);

const service = new FulfillmentService(repository);
const payload = service.prepareFulfillment("ord-ts-4001");

console.log(
  `prepared fulfillment for ${payload.orderId} -> customer=${payload.customerName} items=${payload.items.length} status=${payload.status}`
);
