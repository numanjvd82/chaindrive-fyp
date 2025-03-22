import authRouter from "./auth";
import conversationRouter from "./conversation";
import listingRouter from "./listing";
import messageRouter from "./message";
import notificationRouter from "./notification";

const router = {
  auth: authRouter,
  conversation: conversationRouter,
  message: messageRouter,
  notification: notificationRouter,
  listing: listingRouter,
};

export default router;
