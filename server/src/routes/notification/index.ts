import express, { Request, Response } from "express";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

const notificationRouter = express.Router();
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
    SELECT id, type, content, created_at FROM Notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC
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

// Mark notifications as read
notificationRouter.post("/mark-read", (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    db.prepare(
      sql`
      UPDATE Notifications SET is_read = true WHERE user_id = ?
    `
    ).run(userId);

    // delete all notifications
    db.prepare(
      sql`
      DELETE FROM Notifications WHERE user_id = ? AND is_read = true
    `
    ).run(userId);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default notificationRouter;
