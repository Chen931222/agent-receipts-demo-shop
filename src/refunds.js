/**
 * Refunds for paid orders.
 *
 * An order looks like { id, total, currency, refunded } where amounts are integer cents.
 * Today only full refunds exist: refund(order) gives the customer back the whole total.
 */

export function refund(order) {
  if (order.refunded > 0) throw new Error(`Order ${order.id} was already refunded`);
  return { ...order, refunded: order.total };
}

export function remaining(order) {
  return order.total - order.refunded;
}
