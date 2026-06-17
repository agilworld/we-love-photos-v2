import { Hono } from "hono";
import { PhotoService } from "./photo.service";
import { searchQuerySchema } from "@welovephotos/validators";
import type { SearchResponse } from "./photo.model";

type Env = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  TURSO_ORG?: string;
  CORS_ORIGIN?: string;
  NODE_ENV?: string;
};

export const photoRoutes = new Hono<{ Bindings: Env }>();

photoRoutes.get("/search", async (c) => {
  const keyword = c.req.query("keyword");
  const limit = c.req.query("limit");
  const offset = c.req.query("offset");

  if (!keyword) {
    return c.json(
      { success: false, error: "keyword query parameter is required" },
      400,
    );
  }

  const parsed = searchQuerySchema.safeParse({ keyword, limit, offset });
  if (!parsed.success) {
    return c.json({ success: false, error: parsed.error.flatten() }, 400);
  }

  try {
    const service = new PhotoService(c.env);
    const result: SearchResponse = await service.searchByKeyword(parsed.data);

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error searching photos:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});
