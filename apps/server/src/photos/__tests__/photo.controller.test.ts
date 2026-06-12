import { test, expect, describe, mock, beforeEach } from "bun:test";

let mockSearchByKeyword: any;

mock.module("../photo.service", () => {
  mockSearchByKeyword = mock(async (request: any) => {
    if (request.keyword === "error") {
      throw new Error("DB connection failed");
    }
    return {
      keyword: request.keyword,
      total: 1,
      photos: [
        {
          photoId: "photo-1",
          photoUrl: "https://example.com/photo-1",
          photoImageUrl: "https://example.com/img/photo-1",
          photoSubmittedAt: "2024-01-01T00:00:00Z",
          photoFeatured: false,
          photoWidth: 1920,
          photoHeight: 1080,
          photoAspectRatio: 1.78,
          photoDescription: "A test photo",
          photographerUsername: "testuser",
          photographerFirstName: "Test",
          photographerLastName: "User",
          exifCameraMake: "Canon",
          exifCameraModel: "EOS R5",
          exifIso: 100,
          exifApertureValue: "f/2.8",
          exifFocalLength: "50mm",
          exifExposureTime: "1/200",
          photoLocationName: "Test Location",
          photoLocationLatitude: 40.7128,
          photoLocationLongitude: -74.006,
          photoLocationCountry: "US",
          photoLocationCity: "New York",
          statsViews: 1000,
          statsDownloads: 50,
          aiDescription: "AI description",
          aiPrimaryLandmarkName: null,
          aiPrimaryLandmarkLatitude: null,
          aiPrimaryLandmarkLongitude: null,
          aiPrimaryLandmarkConfidence: null,
          blurHash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
        },
      ],
    };
  });

  return {
    PhotoService: mock(function () {
      return {
        searchByKeyword: mockSearchByKeyword,
      };
    }),
  };
});

import { photoRoutes } from "../photo.controller";

describe("GET /search", () => {
  beforeEach(() => {
    mockSearchByKeyword.mockClear();
  });

  test("returns 200 with default limit/offset", async () => {
    const res = await photoRoutes.request("/search?keyword=nature");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.keyword).toBe("nature");
    expect(mockSearchByKeyword).toHaveBeenCalledWith(
      expect.objectContaining({ keyword: "nature", limit: 20, offset: 0 }),
    );
  });

  test("returns 200 with custom limit and offset", async () => {
    const res = await photoRoutes.request(
      "/search?keyword=nature&limit=10&offset=20",
    );
    expect(res.status).toBe(200);
    expect(mockSearchByKeyword).toHaveBeenCalledWith(
      expect.objectContaining({ keyword: "nature", limit: 10, offset: 20 }),
    );
  });

  test("returns 400 when keyword is missing", async () => {
    const res = await photoRoutes.request("/search");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("returns 400 when keyword is empty", async () => {
    const res = await photoRoutes.request("/search?keyword=");
    expect(res.status).toBe(400);
  });

  test("returns 400 when limit is 0", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&limit=0");
    expect(res.status).toBe(400);
  });

  test("returns 400 when limit exceeds 100", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&limit=101");
    expect(res.status).toBe(400);
  });

  test("returns 400 when offset is negative", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&offset=-1");
    expect(res.status).toBe(400);
  });

  test("returns 400 when limit is not a number", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&limit=abc");
    expect(res.status).toBe(400);
  });

  test("returns 400 when offset is not a number", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&offset=xyz");
    expect(res.status).toBe(400);
  });

  test("returns 500 on service error", async () => {
    const res = await photoRoutes.request("/search?keyword=error");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Internal server error");
  });

  test("accepts limit at boundary 100", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&limit=100");
    expect(res.status).toBe(200);
    expect(mockSearchByKeyword).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 100 }),
    );
  });

  test("accepts limit at boundary 1", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&limit=1");
    expect(res.status).toBe(200);
    expect(mockSearchByKeyword).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 1 }),
    );
  });

  test("accepts offset at boundary 0", async () => {
    const res = await photoRoutes.request("/search?keyword=nature&offset=0");
    expect(res.status).toBe(200);
    expect(mockSearchByKeyword).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 0 }),
    );
  });
});