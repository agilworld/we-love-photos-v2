import { Hono } from 'hono';
import { PhotoService } from './photo.service';
import { searchQuerySchema } from './photo.schema';
import type { SearchResponse } from './photo.model';

export const photoRoutes = new Hono();

photoRoutes.get('/search', async c => {
  const keyword = c.req.query('keyword');

  if (!keyword) {
    return c.json(
      { success: false, error: 'keyword query parameter is required' },
      400
    );
  }

  const parsed = searchQuerySchema.safeParse({ keyword });
  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.flatten() }, 400);
  }

  try {
    const service = new PhotoService();
    const result: SearchResponse = await service.searchByKeyword(
      parsed.data.keyword
    );

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Error searching photos:', error);
    return c.json(
      { success: false, error: 'Internal server error' },
      500
    );
  }
});