import { Request, Response } from "express";
import { conversationModel } from "../../models/conversation";

export const fetchConversations = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    const conversations = await conversationModel.list(userId);
    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
