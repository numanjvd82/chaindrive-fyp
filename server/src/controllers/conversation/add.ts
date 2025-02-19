import { Request, Response } from "express";
import { conversationModel } from "../../models/conversation";

export const addConversation = async (req: Request, res: Response) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    res.status(400).send("Missing data");
    return;
  }

  try {
    const conversation = await conversationModel.add({ user1, user2 });
    res.status(201).json(conversation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
