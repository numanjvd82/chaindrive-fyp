import express from "express";
import { insertMessageController } from "../../controllers/message/add";
import { listMessagesController } from "../../controllers/message/list";

const messageRouter = express.Router();

// List messages in a conversation
messageRouter.get("/:conversationId", listMessagesController);

// Insert a new message
messageRouter.post("/", insertMessageController);

export default messageRouter;
