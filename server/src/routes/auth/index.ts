import { Router } from "express";
import { signUpController } from "../../controllers/auth/signUpController";

const authRouter = Router();

authRouter.post("/signup", signUpController);

export default authRouter;
