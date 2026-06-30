import { ChargeRequest, createGateway } from "./payment";

const requests: ChargeRequest[] = [
  { provider: "stripe", orderId: "ord-ts-1001", amountCents: 12500, currency: "USD" },
  { provider: "wallet", orderId: "ord-ts-1002", amountCents: 3200, currency: "USD" }
];

for (const request of requests) {
  try {
    const gateway = createGateway(request.provider);
    const result = gateway.charge(request);

    console.log(
      `charged ${request.orderId} with ${result.provider} -> status=${result.status} transaction=${result.transactionId}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`charge ${request.orderId} failed: ${message}`);
  }
}
