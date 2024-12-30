import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const deleteOne = async (sessionId: string) => {
  if (!sessionId) return;
  try {
    // Delete session from database
    sqliteInstance
      .prepare(sql`DELETE FROM sessions WHERE session_id = ?`)
      .run(sessionId);
  } catch (error) {
    throw new Error(`Error deleting session: ${error}`);
  }
};
