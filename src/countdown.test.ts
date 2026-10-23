import { describe, expect, it } from "vitest";
import {
  formatHms,
  pad,
  parseQuickMinutes,
  remainingFromMinutes,
  remainingFromTarget,
  splitHms,
  toDatetimeLocalValue,
} from "./countdown";

describe("pad / format", () => {
  it("pads single digits", () => {
    expect(pad(0)).toBe("00");
    expect(pad(9)).toBe("09");
    expect(pad(12)).toBe("12");
  });

  it("splits and formats hours minutes seconds", () => {
    expect(splitHms(3661)).toEqual({ h: 1, m: 1, s: 1 });
    expect(formatHms(3600)).toBe("01:00:00");
    expect(formatHms(-5)).toBe("00:00:00");
  });
});

describe("setup remaining", () => {
  it("computes remaining seconds from a future datetime-local value", () => {
    const now = Date.parse("2026-10-22T18:00:00");
    expect(remainingFromTarget("2026-10-22T19:00", now)).toBe(3600);
    expect(remainingFromTarget("2026-10-22T17:00", now)).toBe(0);
    expect(remainingFromTarget("", now)).toBe(0);
  });

  it("converts quick minutes", () => {
    expect(remainingFromMinutes("25")).toBe(1500);
    expect(remainingFromMinutes("0")).toBe(0);
    expect(remainingFromMinutes("abc")).toBe(0);
    expect(parseQuickMinutes("5")).toBe(5);
    expect(parseQuickMinutes("-1")).toBeNull();
  });

  it("serializes datetime-local values", () => {
    const date = new Date(2026, 9, 22, 18, 5);
    expect(toDatetimeLocalValue(date)).toBe("2026-10-22T18:05");
  });
});
