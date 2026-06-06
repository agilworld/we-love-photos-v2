import { db } from "@welovephotos/db";
import { unsplashKeywords, unsplashPhotos } from "@welovephotos/db";
import { like, inArray } from "@welovephotos/db";

export class PhotoRepository {
  async findPhotoIdsByKeyword(keyword: string, offset: number, limit: number): Promise<string[]> {
    const rows = await db
      .select({ photoId: unsplashKeywords.photoId })
      .from(unsplashKeywords)
      .offset(offset)
      .limit(limit)
      .where(like(unsplashKeywords.keyword, `%${keyword}%`));
    return [...new Set(rows.map((r) => r.photoId))];
  }

  async findPhotosByIds(photoIds: string[], offset: number, limit: number) {
    if (photoIds.length === 0) return [];
    return db
      .select()
      .from(unsplashPhotos)
      .offset(offset)
      .limit(limit)
      .where(inArray(unsplashPhotos.photoId, photoIds));
  }
}
