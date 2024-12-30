import { randomUUID } from "crypto";
import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sessionExpiry, sql } from "../../utils/utils";
import { idSchema } from "../user/findOneById";

type SessionInput = z.infer<typeof idSchema>;

export const createOne = async (userId: SessionInput) => {
  if (!userId) return;
  // Generate session ID and expiration
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + sessionExpiry);

  try {
    // Insert session into database
    sqliteInstance
      .prepare(
        sql`
  INSERT INTO sessions (user_id, session_id, data, expires_at)
  VALUES (?, ?, ?, ?)
`
      )
      .run(userId, sessionId, JSON.stringify({}), expiresAt.toISOString());

    return sessionId;
  } catch (e) {
    console.error("Failed to create session", e);
    throw new Error("Failed to create session");
  }
};
