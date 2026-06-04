import { PhotoRepository } from './photo.repository';
import type { SearchResponse, PhotoRow } from './photo.model';

export class PhotoService {
  private repo: PhotoRepository;

  constructor() {
    this.repo = new PhotoRepository();
  }

  async searchByKeyword(keyword: string): Promise<SearchResponse> {
    const photoIds = await this.repo.findPhotoIdsByKeyword(keyword);
    const photos = await this.repo.findPhotosByIds(photoIds);

    const photoRows: PhotoRow[] = photos.map(photo => ({
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