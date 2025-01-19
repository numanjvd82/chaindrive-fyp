import { Router } from "express";
import { getCurrentUser } from "../../controllers/auth/currentUser";
import { login } from "../../controllers/auth/login";
import { logout } from "../../controllers/auth/logout";
import { signUp } from "../../controllers/auth/signUp";
import upload from "../../middlewares/multer";

const authRouter = Router();

authRouter.post(
  "/signup",
  upload.fields([
    { name: "idCardFront", maxCount: 1 },
    { name: "idCardBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  signUp
);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);

export default authRouter;
