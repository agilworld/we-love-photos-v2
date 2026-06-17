import { PhotoRepository } from "./photo.repository";
import type { SearchResponse, PhotoRow, SearchRequest } from "./photo.model";

type Env = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
};

export class PhotoService {
  private repo: PhotoRepository;

  constructor(env?: Env) {
    this.repo = new PhotoRepository(env);
  }

  async searchByKeyword(request: SearchRequest): Promise<SearchResponse> {
    const { keyword, limit = 20, offset = 0 } = request;
    const photoIds = await this.repo.findPhotoIdsByKeyword(
      keyword,
      limit,
      offset,
    );
    const photos = await this.repo.findPhotosByIds(photoIds, limit, offset);

    const photoRows: PhotoRow[] = photos.map((photo) => ({
      photoId: photo.photoId,
      photoUrl: photo.photoUrl,
      photoImageUrl: photo.photoImageUrl,
      photoSubmittedAt: photo.photoSubmittedAt,
      photoFeatured: photo.photoFeatured,
      photoWidth: photo.photoWidth,
      photoHeight: photo.photoHeight,
      photoAspectRatio: photo.photoAspectRatio,
      photoDescription: photo.photoDescription,
      photographerUsername: photo.photographerUsername,
      photographerFirstName: photo.photographerFirstName,
      photographerLastName: photo.photographerLastName,
      exifCameraMake: photo.exifCameraMake,
      exifCameraModel: photo.exifCameraModel,
      exifIso: photo.exifIso,
      exifApertureValue: photo.exifApertureValue,
      exifFocalLength: photo.exifFocalLength,
      exifExposureTime: photo.exifExposureTime,
      photoLocationName: photo.photoLocationName,
      photoLocationLatitude: photo.photoLocationLatitude,
      photoLocationLongitude: photo.photoLocationLongitude,
      photoLocationCountry: photo.photoLocationCountry,
      photoLocationCity: photo.photoLocationCity,
      statsViews: photo.statsViews,
      statsDownloads: photo.statsDownloads,
      aiDescription: photo.aiDescription,
      aiPrimaryLandmarkName: photo.aiPrimaryLandmarkName,
      aiPrimaryLandmarkLatitude: photo.aiPrimaryLandmarkLatitude,
      aiPrimaryLandmarkLongitude: photo.aiPrimaryLandmarkLongitude,
      aiPrimaryLandmarkConfidence: photo.aiPrimaryLandmarkConfidence,
      blurHash: photo.blurHash,
    }));

    return { keyword, total: photoRows.length, photos: photoRows };
  }
}
