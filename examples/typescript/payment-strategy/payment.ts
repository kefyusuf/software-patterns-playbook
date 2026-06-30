export type ChargeRequest = {
  provider: string;
  orderId: string;
  amountCents: number;
  currency: string;
};

export type ChargeResult = {
  provider: string;
  status: string;
  transactionId: string;
};

export interface Gateway {
  charge(request: ChargeRequest): ChargeResult;
}

export class StripeGateway implements Gateway {
  charge(request: ChargeRequest): ChargeResult {
    if (request.amountCents <= 0) {
      throw new Error("amount must be positive");
    }

    return {
      provider: "stripe",
      status: "approved",
      transactionId: `ch_stripe_${request.orderId}`
    };
  }
}

export class WalletGateway implements Gateway {
  charge(request: ChargeRequest): ChargeResult {
    if (request.amountCents <= 0) {
      throw new Error("amount must be positive");
    }

    return {
      provider: "wallet",
      status: "approved",
      transactionId: `ch_wallet_${request.orderId}`
    };
  }
}

export function createGateway(provider: string): Gateway {
  switch (provider) {
    case "stripe":
      return new StripeGateway();
    case "wallet":
      return new WalletGateway();
    default:
      throw new Error(`unsupported provider: ${provider}`);
  }
}
