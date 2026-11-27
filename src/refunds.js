/**
 * Refunds for paid orders.
 *
 * An order looks like { id, total, currency, refunded } where amounts are integer cents.
 * refund(order, amount) gives the customer back `amount` cents, or everything that
 * remains when `amount` is omitted. Partial refunds add up in `order.refunded` until
 * nothing remains; after that any further refund throws. The input order is never
 * mutated: a new order object is returned. Orders whose `status` is "cancelled" cannot
 * be refunded at all; orders without a `status` field are refunded as usual.
 */

export function refund(order, amount) {
  if (order.status === "cancelled") {
    throw new Error(`Order ${order.id} is cancelled and cannot be refunded`);
  }
  const left = remaining(order);
  if (left <= 0) throw new Error(`Order ${order.id} was already refunded`);

  const value = amount === undefined ? left : amount;
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `Refund amount for order ${order.id} must be a positive integer number of cents, got ${String(amount)}`,
    );
  }
  if (value > left) {
    throw new Error(
      `Refund amount ${value} exceeds the ${left} cents remaining on order ${order.id}`,
    );
  }

  return { ...order, refunded: order.refunded + value };
}

export function remaining(order) {
  return order.total - order.refunded;
}
