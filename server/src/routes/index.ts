import authRouter from "./auth";
import conversationRouter from "./conversation";
import messageRouter from "./message";

const router = {
  auth: authRouter,
  conversation: conversationRouter,
  message: messageRouter,
};

export default router;
