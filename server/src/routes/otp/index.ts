import { Router } from "express";
import { verifyOtpController } from "../../controllers/otp/verifyOtpController";

const otpRouter = Router();

otpRouter.post("/verify", verifyOtpController);

export default otpRouter;
