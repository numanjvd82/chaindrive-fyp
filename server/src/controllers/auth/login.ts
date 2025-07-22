import { Request, Response } from "express";
import { otpModel } from "../../models/otp";
import { sessionModel } from "../../models/session";
import { userModel } from "../../models/user";
import { signUpSchema } from "../../models/user/createOne";
import { verifyPassword } from "../../utils/cryptoUtils";
import { sessionExpiry } from "../../utils/utils";

export const loginSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await userModel.findOneByEmail(email);

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = verifyPassword(
      password,
      user.password_hash,
      user.salt
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check if the user not verified
    if (!user.isVerified) {
      await otpModel.send({ email });
      res.status(403).json({
        message: "User not verified. Please check your email for verification.",
      });
      return;
    }

    // Check if the user has two-factor authentication enabled
    if (user.twoFactorEnabled) {
      // Generate and send OTP
      await otpModel.send({ email });
      res.status(200).json({ message: "OTP sent to your email" });
      return;
    }

    // create a session if two-factor authentication is not enabled
    const sessionId = await sessionModel.createOne(user.id);

    // For development, you might want to set the cookie like this:
    // res.cookie("sessionId", sessionId, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: sessionExpiry,
    // });

    // Production settings for cookies
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true, // MUST be true in production HTTPS
      sameSite: "none", // REQUIRED for cross-origin cookies
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error: any) {
    console.log("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};
