import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export function createDb(env?: { TURSO_CONNECTION_URL: string; TURSO_AUTH_TOKEN: string }) {
  const url = env?.TURSO_CONNECTION_URL ||
    (typeof process !== 'undefined' ? process.env.TURSO_CONNECTION_URL : undefined);
  const authToken = env?.TURSO_AUTH_TOKEN ||
    (typeof process !== 'undefined' ? process.env.TURSO_AUTH_TOKEN : undefined);

  if (!url || !authToken) {
    throw new Error("TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN are required");
  }

  const client = createClient({ url, authToken });
  return drizzle(client, { schema, logger: true });
}

export * from "drizzle-orm";

export * from "./schema";
