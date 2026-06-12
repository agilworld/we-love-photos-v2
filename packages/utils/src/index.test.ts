import { test, expect, describe } from "bun:test";
import { cn, chunks2Arr, uniqueBy } from "./index";

describe("cn", () => {
  test("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  test("deduplicates tailwind classes", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("chunks2Arr", () => {
  test("splits array into chunks of given size", () => {
    expect(chunks2Arr([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  test("handles remainder chunk", () => {
    expect(chunks2Arr([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test("throws on negative size", () => {
    expect(() => chunks2Arr([1, 2], -1)).toThrow("size must be positive integer");
  });

  test("handles empty array", () => {
    expect(chunks2Arr([], 3)).toEqual([]);
  });
});

describe("uniqueBy", () => {
  test("deduplicates objects by key", () => {
    const items = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 1, name: "c" },
    ];
    const result = uniqueBy(items, (item: any) => item.id);
    expect(result).toHaveLength(2);
    expect(result.some((r: any) => r.id === 1)).toBe(true);
    expect(result.some((r: any) => r.id === 2)).toBe(true);
  });
});