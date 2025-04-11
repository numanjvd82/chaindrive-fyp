import authRouter from "./auth";
import conversationRouter from "./conversation";
import listingRouter from "./listing";
import messageRouter from "./message";
import notificationRouter from "./notification";
import userRouter from "./user";
import walletRouter from "./wallet";

const router = {
  auth: authRouter,
  user: userRouter,
  wallet: walletRouter,
  conversation: conversationRouter,
  message: messageRouter,
  notification: notificationRouter,
  listing: listingRouter,
};

export default router;
