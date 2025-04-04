import authRouter from "./auth";
import conversationRouter from "./conversation";
import listingRouter from "./listing";
import messageRouter from "./message";
import notificationRouter from "./notification";
import userRouter from "./user";

const router = {
  auth: authRouter,
  user: userRouter,
  conversation: conversationRouter,
  message: messageRouter,
  notification: notificationRouter,
  listing: listingRouter,
};

export default router;
