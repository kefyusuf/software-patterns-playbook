import { CheckoutCommand, CheckoutResult } from "./command";

export type CheckoutContext = {
  command: CheckoutCommand;
};

export interface Step {
  handle(context: CheckoutContext): void;
}

export class CheckoutProcessor {
  constructor(private readonly steps: Step[]) {}

  process(command: CheckoutCommand): CheckoutResult {
    const context: CheckoutContext = { command };

    for (const step of this.steps) {
      step.handle(context);
    }

    return {
      orderId: command.orderId,
      status: "ready-for-order-creation"
    };
  }
}

export class ValidateCartStep implements Step {
  handle(context: CheckoutContext): void {
    if (context.command.itemCount <= 0) {
      throw new Error("cart must contain at least one item");
    }
  }
}

export class ValidatePaymentStep implements Step {
  handle(context: CheckoutContext): void {
    switch (context.command.paymentMethod) {
      case "card":
      case "wallet":
      case "bank-transfer":
        return;
      default:
        throw new Error(`unsupported payment method: ${context.command.paymentMethod}`);
    }
  }
}

export class ReserveInventoryStep implements Step {
  handle(context: CheckoutContext): void {
    if (!context.command.inventoryLocked) {
      throw new Error("inventory is not locked");
    }
  }
}
