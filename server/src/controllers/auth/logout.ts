import { Request, Response } from "express";
import { sessionModel } from "../../models/session";

export const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies && req.cookies.sessionId;

  if (!sessionId) {
    res.status(400).json({ error: "No session to logout" });
    return;
  }

  await sessionModel.deleteOne(sessionId);

  // Clear the session cookie
  res.clearCookie("sessionId");

  res.status(200).json({ message: "Logged out successfully" });
};
