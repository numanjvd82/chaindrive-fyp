import { Request, Response } from "express";
import { otpModel } from "../../models/otp";
import { sessionModel } from "../../models/session";
import { userModel } from "../../models/user";
import { sessionExpiry } from "../../utils/utils";

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await otpModel.verify({ email, otp });

    if (!result) {
      res.status(400).json({ error: "Invalid OTP" });
      return;
    }

    // Create a session
    const user = await userModel.findOneByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const sessionId = await sessionModel.createOne(user.id);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionExpiry,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
