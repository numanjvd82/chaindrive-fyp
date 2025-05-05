import { Request, Response } from "express";
import { getDbInstance } from "../../lib/db/sqlite";
import { otpModel } from "../../models/otp";
import { sessionModel } from "../../models/session";
import { userModel } from "../../models/user";
import { sessionExpiry, sql } from "../../utils/utils";

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

    const db = getDbInstance();

    // Check if the user not verified
    if (!user.isVerified) {
      const result = db
        .prepare(
          sql`
UPDATE Users 
SET is_verified = 1
WHERE email = ?
        `
        )
        .run(email);

      if (result.changes === 0) {
        throw new Error("Failed to verify user");
      }
    }

    const sessionId = await sessionModel.createOne(user.id);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionExpiry,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error: any) {
    console.error("Error during OTP verification:", error);
    res.status(400).json({ error: error.message });
  }
};
