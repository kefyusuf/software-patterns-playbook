interface LifecycleState {
  name(): string;
  allocateInventory(order: Order): void;
  pack(order: Order): void;
  ship(order: Order): void;
}

export class Order {
  private readonly eventsValue: string[] = [];
  private stateValue: LifecycleState = new PendingState();

  private constructor(private readonly idValue: string) {}

  static create(id: string): Order {
    return new Order(id);
  }

  id(): string {
    return this.idValue;
  }

  state(): string {
    return this.stateValue.name();
  }

  events(): string[] {
    return [...this.eventsValue];
  }

  allocateInventory(): void {
    this.stateValue.allocateInventory(this);
  }

  pack(): void {
    this.stateValue.pack(this);
  }

  ship(): void {
    this.stateValue.ship(this);
  }

  transitionTo(next: LifecycleState): void {
    this.stateValue = next;
  }

  record(event: string): void {
    this.eventsValue.push(event);
  }
}

class PendingState implements LifecycleState {
  name(): string {
    return "pending";
  }

  allocateInventory(order: Order): void {
    order.transitionTo(new AllocatedState());
    order.record(`OrderAllocated:${order.id()}`);
  }

  pack(): void {
    throw new Error("cannot pack while order is pending");
  }

  ship(): void {
    throw new Error("cannot ship while order is pending");
  }
}

class AllocatedState implements LifecycleState {
  name(): string {
    return "allocated";
  }

  allocateInventory(): void {
    throw new Error("inventory already allocated");
  }

  pack(order: Order): void {
    order.transitionTo(new PackedState());
    order.record(`OrderPacked:${order.id()}`);
  }

  ship(): void {
    throw new Error("cannot ship before packing");
  }
}

class PackedState implements LifecycleState {
  name(): string {
    return "packed";
  }

  allocateInventory(): void {
    throw new Error("inventory already allocated");
  }

  pack(): void {
    throw new Error("order is already packed");
  }

  ship(order: Order): void {
    order.transitionTo(new ShippedState());
    order.record(`OrderShipped:${order.id()}`);
  }
}

class ShippedState implements LifecycleState {
  name(): string {
    return "shipped";
  }

  allocateInventory(): void {
    throw new Error("cannot allocate inventory after shipping");
  }

  pack(): void {
    throw new Error("cannot pack after shipping");
  }

  ship(): void {
    throw new Error("order is already shipped");
  }
}
