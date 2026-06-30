import { AuditHandler, EventBus, NotificationHandler } from "./event";
import { PlacementService } from "./service";

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

assert(placedOrder.id === "ord-ts-5001", "expected placed order id");
assert(notifications.messages.length === 1, "expected one notification message");
assert(audit.entries.length === 1, "expected one audit entry");

assertThrows(
  () =>
    service.placeOrder({
      orderId: "ord-ts-5002",
      customerId: "cust-ts-200",
      totalCents: 0
    }),
  "total must be positive"
);

console.log("order-domain-event tests passed");
