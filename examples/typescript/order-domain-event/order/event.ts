export type OrderPlaced = {
  orderId: string;
  customerId: string;
  totalCents: number;
};

export type EventHandler = (event: OrderPlaced) => void;

export class EventBus {
  private readonly handlers: EventHandler[] = [];

  subscribe(handler: EventHandler): void {
    this.handlers.push(handler);
  }

  publish(event: OrderPlaced): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}

export class NotificationHandler {
  readonly messages: string[] = [];

  handleOrderPlaced(event: OrderPlaced): void {
    this.messages.push(`send confirmation for ${event.orderId} to ${event.customerId}`);
  }
}

export class AuditHandler {
  readonly entries: string[] = [];

  handleOrderPlaced(event: OrderPlaced): void {
    this.entries.push(`record OrderPlaced:${event.orderId} total=${event.totalCents}`);
  }
}
