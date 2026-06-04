export type PhotoRow = {
  photoId: string;
  photoUrl: string | null;
  photoImageUrl: string | null;
  photoSubmittedAt: string | null;
  photoFeatured: boolean | null;
  photoWidth: number | null;
  photoHeight: number | null;
  photoAspectRatio: number | null;
  photoDescription: string | null;
  photographerUsername: string | null;
  photographerFirstName: string | null;
  photographerLastName: string | null;
  exifCameraMake: string | null;
  exifCameraModel: string | null;
  exifIso: number | null;
  exifApertureValue: string | null;
  exifFocalLength: string | null;
  exifExposureTime: string | null;
  photoLocationName: string | null;
  photoLocationLatitude: number | null;
  photoLocationLongitude: number | null;
  photoLocationCountry: string | null;
  photoLocationCity: string | null;
  statsViews: number | null;
  statsDownloads: number | null;
  aiDescription: string | null;
  aiPrimaryLandmarkName: string | null;
  aiPrimaryLandmarkLatitude: number | null;
  aiPrimaryLandmarkLongitude: number | null;
  aiPrimaryLandmarkConfidence: string | null;
  blurHash: string | null;
};

export type SearchResponse = {
  keyword: string;
  total: number;
  photos: PhotoRow[];
};