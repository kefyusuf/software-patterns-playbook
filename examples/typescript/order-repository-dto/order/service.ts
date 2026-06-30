import { OrderRepository } from "./repository";

export type FulfillmentItemDTO = {
  sku: string;
  quantity: number;
};

export type FulfillmentRequestDTO = {
  orderId: string;
  customerName: string;
  shippingStreet: string;
  items: FulfillmentItemDTO[];
  status: string;
};

export class FulfillmentService {
  constructor(private readonly repository: OrderRepository) {}

  prepareFulfillment(orderId: string): FulfillmentRequestDTO {
    const order = this.repository.findPendingById(orderId);
    order.markReadyForFulfillment();
    this.repository.save(order);

    return {
      orderId: order.id(),
      customerName: order.customerName(),
      shippingStreet: order.shippingStreet(),
      items: order.items().map((item) => ({
        sku: item.sku,
        quantity: item.quantity
      })),
      status: order.status()
    };
  }
}
