import { Order } from "./order/order";

const pending = Order.create("ord-ts-3001");

console.log(`order ${pending.id()} starts in state=${pending.state()}`);

pending.allocateInventory();
pending.pack();
pending.ship();

console.log(`order ${pending.id()} finished in state=${pending.state()}`);
console.log("events:");
for (const event of pending.events()) {
  console.log(`- ${event}`);
}

console.log("");

const failed = Order.create("ord-ts-3002");
try {
  failed.ship();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`invalid transition for ${failed.id()}: ${message}`);
}
