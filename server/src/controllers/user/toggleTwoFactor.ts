import { Request, Response } from "express";
import { userModel } from "../../models/user";

export const toggleTwoFactorController = async (
  req: Request,
  res: Response
) => {
  try {
    const { enabled } = req.body;
    // @ts-ignore
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ error: "Unauthorized" });
      return;
    }

    if (typeof enabled !== "boolean") {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    await userModel.toggleTwoFactor({
      userId,
      enabled,
    });

    res.status(200).json({
      message: `Two-factor authentication ${enabled ? "enabled" : "disabled"}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
