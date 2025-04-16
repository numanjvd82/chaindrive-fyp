import { Router } from "express";
import { getOtherUser } from "../../controllers/auth/getOtherUser";

const userRouter = Router();

userRouter.get("/:id", getOtherUser);

export default userRouter;
