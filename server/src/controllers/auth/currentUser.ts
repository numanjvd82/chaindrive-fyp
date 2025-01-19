import { Request, Response } from "express";
import { sessionModel } from "../../models/session";
import { userModel } from "../../models/user";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const session = await sessionModel.findOne(sessionId);
    if (!session) {
      res.status(401).json({ error: "Session expired or invalid" });
      return;
    }

    const user = await userModel.findOneById(session.user_id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
