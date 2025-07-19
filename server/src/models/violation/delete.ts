import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export async function deleteViolation(id: number): Promise<boolean> {
  try {
    const db = getDbInstance();

    const result = db
      .prepare(
        sql`
        DELETE FROM Violations WHERE id = ?
        `
      )
      .run(id);

    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting violation:", error);
    throw error;
  }
}
