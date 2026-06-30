import { CheckoutCommand } from "./checkout/command";
import {
  CheckoutProcessor,
  ReserveInventoryStep,
  ValidateCartStep,
  ValidatePaymentStep
} from "./checkout/pipeline";

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
console.log(`checkout completed for ${result.orderId} -> ${result.status}`);
