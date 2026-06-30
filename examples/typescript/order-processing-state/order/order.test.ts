import { Order } from "./order";

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

const order = Order.create("ord-ts-3001");
order.allocateInventory();
order.pack();
order.ship();

assert(order.state() === "shipped", `expected shipped state, got ${order.state()}`);
assert(order.events().length === 3, `expected 3 events, got ${order.events().length}`);

const pending = Order.create("ord-ts-3002");
assertThrows(() => pending.ship(), "cannot ship while order is pending");
assert(pending.state() === "pending", `expected pending state, got ${pending.state()}`);

console.log("order-processing-state tests passed");
