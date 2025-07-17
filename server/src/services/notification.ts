import { getDbInstance } from "../lib/db/sqlite";
import { sql } from "../utils/utils";

const db = getDbInstance();

const insertNotification = db.prepare(sql`
    INSERT INTO Notifications (user_id, type, content, link, rentalId, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

const getUnreadNotifications = db.prepare(sql`
    SELECT id, type, content, link, rentalId, created_at FROM Notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC
  `);

const markNotificationAsRead = db.prepare(sql`
    UPDATE Notifications SET is_read = 1 WHERE id = ?
  `);

const deleteNotification = db.prepare(sql`
    DELETE FROM Notifications WHERE id = ?
  `);

export const notificationDbFunctions = {
  insertNotification,
  getUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
};
