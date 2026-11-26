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
