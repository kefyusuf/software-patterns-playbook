import { AuditHandler, EventBus, NotificationHandler } from "./order/event";
import { PlacementService } from "./order/service";

const bus = new EventBus();
const notifications = new NotificationHandler();
const audit = new AuditHandler();

bus.subscribe((event) => notifications.handleOrderPlaced(event));
bus.subscribe((event) => audit.handleOrderPlaced(event));

const service = new PlacementService(bus);
const placedOrder = service.placeOrder({
  orderId: "ord-ts-5001",
  customerId: "cust-ts-100",
  totalCents: 15900
});

console.log(`placed order ${placedOrder.id} for customer=${placedOrder.customerId} total=${placedOrder.totalCents}`);
console.log("notifications:");
for (const message of notifications.messages) {
  console.log(`- ${message}`);
}

console.log("audit entries:");
for (const entry of audit.entries) {
  console.log(`- ${entry}`);
}
