import { Router } from "express";
import { getOtherUser } from "../../controllers/user/getOtherUser";
import { toggleTwoFactorController } from "../../controllers/user/toggleTwoFactor";

const userRouter = Router();

userRouter.get("/:id", getOtherUser);
userRouter.post("/toggle-2fa", toggleTwoFactorController);

export default userRouter;
