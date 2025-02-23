import express, { Request, Response } from "express";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

const router = express.Router();
const db = getDbInstance();

// Fetch unread notifications
router.get("/", (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const notifications = db
    .prepare(
      sql`
    SELECT * FROM notifications WHERE user_id = ? AND is_read = false
  `
    )
    .all(userId);

  res.json(notifications);
});

// Mark notifications as read
router.post("/mark-read", (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  db.prepare(
    sql`
    UPDATE notifications SET is_read = true WHERE user_id = ?
  `
  ).run(userId);

  res.json({ success: true });
});

// Delete a notification
router.delete("/:id", (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const notificationId = req.params.id;

  db.prepare(
    sql`
    DELETE FROM notifications WHERE id = ? AND user_id = ?
  `
  ).run(notificationId, userId);

  res.json({ success: true });
});

export default router;
