export type CheckoutCommand = {
  orderId: string;
  itemCount: number;
  paymentMethod: string;
  inventoryLocked: boolean;
};

export type CheckoutResult = {
  orderId: string;
  status: string;
};
