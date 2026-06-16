import { createDb, unsplashKeywords, unsplashPhotos } from "@welovephotos/db";
import { like, inArray } from "@welovephotos/db";

type Env = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
};

export class PhotoRepository {
  private db: ReturnType<typeof createDb>;

  constructor(env?: Env) {
    this.db = env ? createDb(env) : createDb();
  }

  async findPhotoIdsByKeyword(
    keyword: string,
    limit: number,
    offset: number,
  ): Promise<string[]> {
    const rows = await this.db
      .select({ photoId: unsplashKeywords.photoId })
      .from(unsplashKeywords)
      .offset(offset)
      .limit(limit)
      .where(like(unsplashKeywords.keyword, `%${keyword}%`));
    return [...new Set(rows.map((r) => r.photoId))];
  }

  async findPhotosByIds(photoIds: string[], limit: number, offset: number) {
    if (photoIds.length === 0) return [];
    return this.db
      .select()
      .from(unsplashPhotos)
      .offset(offset)
      .limit(limit)
      .where(inArray(unsplashPhotos.photoId, photoIds));
  }
}
