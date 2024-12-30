import { Router } from "express";
import { getCurrentUser } from "../../controllers/auth/currentUser";
import { login } from "../../controllers/auth/login";
import { logout } from "../../controllers/auth/logout";
import { signUp } from "../../controllers/auth/signUp";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);

export default authRouter;
