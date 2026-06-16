import { getRequestListener } from "@hono/node-server/listener";
import { app } from "../src/index";
export const config = { runtime: "nodejs", maxDuration: 30 };

export default getRequestListener(app.fetch);
