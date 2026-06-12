import type { PhotoRow, SearchResponse, SearchRequest } from "../../photos/photo.model";

export function createMockPhotoRow(overrides: Partial<PhotoRow> = {}): PhotoRow {
  return {
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
    ...overrides,
  };
}

export function createMockSearchResponse(
  keyword: string,
  count: number = 1,
): SearchResponse {
  const photos = Array.from({ length: count }, (_, i) =>
    createMockPhotoRow({ photoId: `photo-${i + 1}` }),
  );
  return { keyword, total: count, photos };
}

export function createMockSearchRequest(
  overrides: Partial<SearchRequest> = {},
): SearchRequest {
  return {
    keyword: "nature",
    limit: 20,
    offset: 0,
    ...overrides,
  };
}