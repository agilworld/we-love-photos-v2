import { Hono } from "hono";
import { cors } from "hono/cors";
import { photoRoutes } from "./photos/photo.controller";

type Env = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  TURSO_ORG?: string;
  CORS_ORIGIN?: string;
  NODE_ENV?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (c) => c.env?.CORS_ORIGIN || "http://localhost:3012",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.route("/v1/api", photoRoutes);

app.get("/", (c) => {
  return c.json({ message: "We Love Photos API Server", status: "running" });
});

export default app;
