import { Order } from "./order";

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class PaidSpecification implements Specification<Order> {
  isSatisfiedBy(candidate: Order): boolean {
    return candidate.isPaid();
  }
}

export class NotRefundedSpecification implements Specification<Order> {
  isSatisfiedBy(candidate: Order): boolean {
    return !candidate.isRefunded();
  }
}

export class RefundWindowOpenSpecification implements Specification<Order> {
  constructor(private readonly now: Date) {}

  isSatisfiedBy(candidate: Order): boolean {
    return this.now < candidate.refundCutoff();
  }
}

class AndSpecification<T> implements Specification<T> {
  constructor(private readonly specifications: Specification<T>[]) {}

  isSatisfiedBy(candidate: T): boolean {
    for (const specification of this.specifications) {
      if (!specification.isSatisfiedBy(candidate)) {
        return false;
      }
    }

    return true;
  }
}

export function andSpecification<T>(...specifications: Specification<T>[]): Specification<T> {
  return new AndSpecification(specifications);
}
