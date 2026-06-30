import { ChargeRequest, StripeGateway, WalletGateway, createGateway } from "./payment";

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

const validRequest: ChargeRequest = {
  provider: "stripe",
  orderId: "ord-ts-1001",
  amountCents: 12500,
  currency: "USD"
};

const stripeResult = new StripeGateway().charge(validRequest);
assert(stripeResult.provider === "stripe", "expected stripe gateway result");

const walletResult = new WalletGateway().charge({ ...validRequest, provider: "wallet", orderId: "ord-ts-1002" });
assert(walletResult.provider === "wallet", "expected wallet gateway result");

assert(createGateway("stripe") instanceof StripeGateway, "expected stripe factory selection");
assert(createGateway("wallet") instanceof WalletGateway, "expected wallet factory selection");

assertThrows(() => createGateway("bank-transfer"), "unsupported provider");
assertThrows(
  () =>
    new StripeGateway().charge({
      provider: "stripe",
      orderId: "ord-ts-1003",
      amountCents: 0,
      currency: "USD"
    }),
  "amount must be positive"
);

console.log("payment-strategy tests passed");
