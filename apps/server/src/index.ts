import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";
import { photoRoutes } from "./photos/photo.controller";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.route("/v1/api", photoRoutes);

app.get("/", (c) => {
  return c.json({ message: "We Love Photos API Server", status: "running" });
});

export default app;
