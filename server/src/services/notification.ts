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
let _insertNotification: any = null;
let _getUnreadNotifications: any = null;
let _markNotificationAsRead: any = null;
let _deleteNotification: any = null;

function initializeStatements() {
  if (_insertNotification) return; // Already initialized

  const db = getDb();

  _insertNotification = db.prepare(sql`
    INSERT INTO Notifications (user_id, type, content, link, rentalId, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  _getUnreadNotifications = db.prepare(sql`
    SELECT id, type, content, link, rentalId, created_at FROM Notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC
  `);

  _markNotificationAsRead = db.prepare(sql`
    UPDATE Notifications SET is_read = 1 WHERE id = ?
  `);

  _deleteNotification = db.prepare(sql`
    DELETE FROM Notifications WHERE id = ?
  `);
}

export const notificationDbFunctions = {
  get insertNotification() {
    initializeStatements();
    return _insertNotification;
  },
  get getUnreadNotifications() {
    initializeStatements();
    return _getUnreadNotifications;
  },
  get markNotificationAsRead() {
    initializeStatements();
    return _markNotificationAsRead;
  },
  get deleteNotification() {
    initializeStatements();
    return _deleteNotification;
  },
};
