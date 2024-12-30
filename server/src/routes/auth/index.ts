import { Router } from "express";
import { login } from "../../controllers/auth/login";
import { logout } from "../../controllers/auth/logout";
import { signUp } from "../../controllers/auth/signUp";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
