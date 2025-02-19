import { Request, Response } from "express";
import { messageModel } from "../../models/message";
import { insertMessageSchema } from "../../models/message/add";

export const insertMessageController = (req: Request, res: Response) => {
  try {
    const parsedInput = insertMessageSchema.parse(req.body);
    const messageId = messageModel.add(parsedInput);

    res.status(201).json({ messageId });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
