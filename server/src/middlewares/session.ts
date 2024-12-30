import { NextFunction, Request, Response } from "express";
import { sessionModel } from "../models/session";

export const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies && req.cookies.sessionId;

  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Query session from the database
  const session = await sessionModel.findOne(sessionId);

  if (!session) {
    res.status(401).json({ error: "Session expired or invalid" });
    return;
  }

  // Check for session expiration
  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (expiresAt <= now) {
    res.status(401).json({ error: "Session expired" });
    return;
  }

  // Attach userId to request
  (req as any).userId = session.user_id;

  next();
};
