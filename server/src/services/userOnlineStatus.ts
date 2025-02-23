import { getDbInstance } from "../lib/db/sqlite";
import { sql } from "../utils/utils";

const db = getDbInstance();

const addOnlineUser = db.prepare(sql`
  INSERT INTO OnlineUsers (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP) ON CONFLICT(user_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`);

const removeInactiveUsers = db.prepare(
  sql`DELETE FROM OnlineUsers WHERE last_seen < DATETIME('now', '-10 seconds')`
);

const getOnlineUsers = db.prepare(sql`SELECT user_id FROM OnlineUsers`);

export const onlineUsersDbFunctions = {
  addOnlineUser,
  removeInactiveUsers,
  getOnlineUsers,
};
