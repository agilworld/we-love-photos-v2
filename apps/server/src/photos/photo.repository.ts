import { db } from '@welovephotos/db';
import { unsplashKeywords, unsplashPhotos } from '@welovephotos/db';
import { like, inArray } from 'drizzle-orm';

export class PhotoRepository {
  async findPhotoIdsByKeyword(keyword: string): Promise<string[]> {
    const rows = await db
      .select({ photoId: unsplashKeywords.photoId })
      .from(unsplashKeywords)
      .where(like(unsplashKeywords.keyword, `%${keyword}%`));
    return [...new Set(rows.map(r => r.photoId))];
  }

  async findPhotosByIds(photoIds: string[]) {
    if (photoIds.length === 0) return [];
    return db
      .select()
      .from(unsplashPhotos)
      .where(inArray(unsplashPhotos.photoId, photoIds));
  }
}