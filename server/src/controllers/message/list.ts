import { Request, Response } from "express";
import { messageModel } from "../../models/message";
import { listMessagesSchema } from "../../models/message/list";

export const listMessagesController = async (req: Request, res: Response) => {
  try {
    const parsedInput = listMessagesSchema.parse({
      conversationId: Number(req.params.conversationId),
    });
    const messages = await messageModel.list(parsedInput);

    if (!messages || messages.length === 0) {
      res.status(404).json({ error: "No messages found" });
      return;
    }

    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
