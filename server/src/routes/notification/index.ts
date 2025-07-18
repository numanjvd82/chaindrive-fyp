import { Request, Response, Router } from "express";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

const notificationRouter = Router();
const db = getDbInstance();

// Fetch unread notifications
notificationRouter.get("/", (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const notifications = db
      .prepare(
        sql`
    SELECT id, type, content, created_at, rentalId, link FROM Notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC
  `
      )
      .all(userId);

    if (!notifications.length) {
      res.json([]);
      return;
    }

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
notificationRouter.post("/mark-all-as-read", (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    db.prepare(
      sql`
      UPDATE Notifications SET is_read = 1 WHERE user_id = ?
    `
    ).run(userId);

    // delete all notifications
    db.prepare(
      sql`
      DELETE FROM Notifications WHERE user_id = ? AND is_read = 1
    `
    ).run(userId);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark individual notification as read
notificationRouter.post("/mark-read/:id", (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const notificationId = parseInt(req.params.id);

  console.log(notificationId);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!notificationId || isNaN(notificationId)) {
    res.status(400).json({ error: "Invalid notification ID" });
    return;
  }

  try {
    // First verify the notification belongs to the user
    const notification = db
      .prepare(sql`SELECT id FROM Notifications WHERE id = ? AND user_id = ?`)
      .get(notificationId, userId);

    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    // Mark as read and delete
    db.prepare(
      sql`UPDATE Notifications SET is_read = 1 WHERE id = ? AND user_id = ?`
    ).run(notificationId, userId);

    db.prepare(
      sql`DELETE FROM Notifications WHERE id = ? AND user_id = ? AND is_read = 1`
    ).run(notificationId, userId);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default notificationRouter;
