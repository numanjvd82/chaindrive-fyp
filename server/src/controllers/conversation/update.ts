import { Request, Response } from "express";
import { conversationModel } from "../../models/conversation";

export const updateConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lastMessage } = req.body;
    const result = await conversationModel.update({
      id: Number(id),
      lastMessage,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
