import { CheckoutCommand } from "./command";
import {
  CheckoutProcessor,
  ReserveInventoryStep,
  ValidateCartStep,
  ValidatePaymentStep
} from "./pipeline";

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

const processor = new CheckoutProcessor([
  new ValidateCartStep(),
  new ValidatePaymentStep(),
  new ReserveInventoryStep()
]);

const command: CheckoutCommand = {
  orderId: "ord-ts-2001",
  itemCount: 2,
  paymentMethod: "card",
  inventoryLocked: true
};

const result = processor.process(command);
assert(result.status === "ready-for-order-creation", `expected ready status, got ${result.status}`);

assertThrows(
  () =>
    processor.process({
      orderId: "ord-ts-2002",
      itemCount: 0,
      paymentMethod: "card",
      inventoryLocked: true
    }),
  "cart must contain at least one item"
);

assertThrows(
  () =>
    processor.process({
      orderId: "ord-ts-2003",
      itemCount: 1,
      paymentMethod: "crypto",
      inventoryLocked: true
    }),
  "unsupported payment method"
);

console.log("checkout-chain tests passed");
