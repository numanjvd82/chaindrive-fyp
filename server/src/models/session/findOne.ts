import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";
import { Session } from "./index";

export const findOne = async (sessionId: string) => {
  if (!sessionId) return null;
  try {
    const session = sqliteInstance
      .prepare(
        sql`SELECT * FROM sessions WHERE session_id = ? AND expires_at > datetime('now')`
      )
      .get(sessionId) as Session;

    return session;
  } catch (error) {
    return null;
  }
};
