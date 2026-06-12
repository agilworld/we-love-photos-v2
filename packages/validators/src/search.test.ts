import { test, expect, describe } from "bun:test";
import { searchQuerySchema } from "./search";

describe("searchQuerySchema", () => {
  describe("keyword", () => {
    test("valid keyword passes", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 20,
        offset: 0,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.keyword).toBe("nature");
      }
    });

    test("empty string fails", () => {
      const result = searchQuerySchema.safeParse({ keyword: "" });
      expect(result.success).toBe(false);
    });

    test("string exceeding 200 chars fails", () => {
      const result = searchQuerySchema.safeParse({ keyword: "a".repeat(201) });
      expect(result.success).toBe(false);
    });

    test("missing keyword field fails", () => {
      const result = searchQuerySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test("non-string keyword fails", () => {
      const result = searchQuerySchema.safeParse({ keyword: 123 });
      expect(result.success).toBe(false);
    });

    test("exactly 200 chars passes", () => {
      const result = searchQuerySchema.safeParse({ keyword: "a".repeat(200) });
      expect(result.success).toBe(true);
    });
  });

  describe("limit", () => {
    test("defaults to 20 when not provided", () => {
      const result = searchQuerySchema.safeParse({ keyword: "nature" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
      }
    });

    test("accepts valid limit as string (coerced)", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: "10",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
      }
    });

    test("accepts valid limit as number", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 50,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(50);
      }
    });

    test("rejects limit below 1", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 0,
      });
      expect(result.success).toBe(false);
    });

    test("rejects limit above 100", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 101,
      });
      expect(result.success).toBe(false);
    });

    test("accepts limit of 100 (upper boundary)", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 100,
      });
      expect(result.success).toBe(true);
    });

    test("accepts limit of 1 (lower boundary)", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 1,
      });
      expect(result.success).toBe(true);
    });

    test("rejects non-integer limit", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        limit: 5.5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("offset", () => {
    test("defaults to 0 when not provided", () => {
      const result = searchQuerySchema.safeParse({ keyword: "nature" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offset).toBe(0);
      }
    });

    test("accepts valid offset as string (coerced)", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        offset: "20",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offset).toBe(20);
      }
    });

    test("accepts valid offset as number", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        offset: 40,
      });
      expect(result.success).toBe(true);
    });

    test("rejects negative offset", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        offset: -1,
      });
      expect(result.success).toBe(false);
    });

    test("accepts offset of 0 (lower boundary)", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        offset: 0,
      });
      expect(result.success).toBe(true);
    });

    test("rejects non-integer offset", () => {
      const result = searchQuerySchema.safeParse({
        keyword: "nature",
        offset: 1.5,
      });
      expect(result.success).toBe(false);
    });
  });
});