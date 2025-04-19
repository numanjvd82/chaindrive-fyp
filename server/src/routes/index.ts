import authRouter from "./auth";
import conversationRouter from "./conversation";
import dashboardRouter from "./dashboard";
import listingRouter from "./listing";
import messageRouter from "./message";
import notificationRouter from "./notification";
import rentalRouter from "./rental";
import userRouter from "./user";
import walletRouter from "./wallet";

const router = {
  auth: authRouter,
  user: userRouter,
  dashboard: dashboardRouter,
  wallet: walletRouter,
  conversation: conversationRouter,
  message: messageRouter,
  notification: notificationRouter,
  listing: listingRouter,
  rental: rentalRouter,
};

export default router;
