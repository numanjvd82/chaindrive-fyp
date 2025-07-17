import { getDbInstance } from "../lib/db/sqlite";
import { sql } from "../utils/utils";

function getDb() {
  try {
    return getDbInstance();
  } catch (error) {
    console.error("Error getting database instance:", error);
    throw error;
  }
}

// Lazy initialization of prepared statements
let _addOnlineUser: any = null;
let _removeInactiveUsers: any = null;
let _getOnlineUsers: any = null;

function initializeStatements() {
  if (_addOnlineUser) return; // Already initialized
  
  const db = getDb();
  
  _addOnlineUser = db.prepare(sql`
    INSERT INTO OnlineUsers (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP) ON CONFLICT(user_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`);

  _removeInactiveUsers = db.prepare(
    sql`DELETE FROM OnlineUsers WHERE last_seen < DATETIME('now', '-10 seconds')`
  );

  _getOnlineUsers = db.prepare(sql`SELECT user_id FROM OnlineUsers`);
}

export const onlineUsersDbFunctions = {
  get addOnlineUser() {
    initializeStatements();
    return _addOnlineUser;
  },
  get removeInactiveUsers() {
    initializeStatements();
    return _removeInactiveUsers;
  },
  get getOnlineUsers() {
    initializeStatements();
    return _getOnlineUsers;
  },
};
