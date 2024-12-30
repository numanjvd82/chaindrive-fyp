import { Request, Response } from "express";
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
  const { email, password } = req.body;

  try {
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

    // create a session
    const sessionId = await sessionModel.createOne(user.id);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionExpiry,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
