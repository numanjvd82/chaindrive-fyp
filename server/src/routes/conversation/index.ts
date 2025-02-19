import { Router } from "express";
import { addConversation } from "../../controllers/conversation/add";
import { fetchConversations } from "../../controllers/conversation/list";
import { updateConversation } from "../../controllers/conversation/update";

const conversationRouter = Router();

conversationRouter.get("/", fetchConversations);
conversationRouter.post("/", addConversation);
conversationRouter.patch("/:id", updateConversation);

export default conversationRouter;
