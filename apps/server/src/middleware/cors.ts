import { cors } from 'hono/cors';
import type { Context, Next } from 'hono';

export const corsMiddleware = (origin: string) => {
  return cors({
    origin,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });
};