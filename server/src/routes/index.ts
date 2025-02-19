import authRouter from "./auth";
import conversationRouter from "./conversation";

const router = {
  auth: authRouter,
  conversation: conversationRouter,
};

export default router;
