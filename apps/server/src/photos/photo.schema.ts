import { z } from 'zod';

export const searchQuerySchema = z.object({
  keyword: z.string().min(1).max(200),
});