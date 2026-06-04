import { serve } from "@hono/node-server";
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

const port = parseInt(process.env.PORT || "3010", 10);

console.log(`Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server should be running on port ${port}`);
