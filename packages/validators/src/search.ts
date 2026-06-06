import { z } from 'zod';

export const searchQuerySchema = z.object({
  keyword: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});