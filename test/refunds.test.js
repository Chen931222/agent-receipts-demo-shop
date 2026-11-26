import { describe, expect, it } from "vitest";
import { refund, remaining } from "../src/refunds.js";

const order = () => ({ id: "ord_1", total: 5000, currency: "TWD", refunded: 0 });

describe("refund", () => {
  it("refunds the whole order", () => {
    expect(refund(order()).refunded).toBe(5000);
  });

  it("refuses a second full refund", () => {
    expect(() => refund(refund(order()))).toThrow(/already refunded/);
  });

  it("reports what is left to refund", () => {
    expect(remaining(order())).toBe(5000);
  });
});

describe("partial refunds", () => {
  it("refunds only the requested amount", () => {
    const after = refund(order(), 1200);
    expect(after.refunded).toBe(1200);
    expect(remaining(after)).toBe(3800);
  });

  it("adds up several partial refunds", () => {
    const after = refund(refund(order(), 1000), 1500);
    expect(after.refunded).toBe(2500);
    expect(remaining(after)).toBe(2500);
  });

  it("refunds whatever remains when amount is omitted", () => {
    const after = refund(refund(order(), 1000));
    expect(after.refunded).toBe(5000);
    expect(remaining(after)).toBe(0);
  });

  it("allows refunding exactly the remaining amount", () => {
    expect(refund(refund(order(), 2000), 3000).refunded).toBe(5000);
  });

  it("refuses any refund once nothing remains", () => {
    const done = refund(refund(order(), 2000), 3000);
    expect(() => refund(done)).toThrow(/already refunded/);
    expect(() => refund(done, 1)).toThrow(/already refunded/);
  });

  it("refuses more than what remains", () => {
    expect(() => refund(order(), 5001)).toThrow(/exceeds/);
    expect(() => refund(refund(order(), 4000), 1001)).toThrow(/exceeds/);
  });

  it.each([0, -100, 12.5, NaN, Infinity, "100", null])(
    "rejects invalid amount %s",
    (amount) => {
      expect(() => refund(order(), amount)).toThrow(/positive integer/);
    },
  );

  it("does not mutate the input order", () => {
    const original = order();
    const after = refund(original, 1000);
    expect(original.refunded).toBe(0);
    expect(after).not.toBe(original);
    expect(after).toEqual({ ...original, refunded: 1000 });
  });
});
