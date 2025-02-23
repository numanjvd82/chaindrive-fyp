import authRouter from "./auth";
import conversationRouter from "./conversation";
import messageRouter from "./message";
import notificationRouter from "./notification";

const router = {
  auth: authRouter,
  conversation: conversationRouter,
  message: messageRouter,
  notification: notificationRouter,
};

export default router;
