import { Request, Response } from "express";
import { violationModel } from "../../models/violation";

export const listViolations = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  const parsedUserId = Number(userId);

  if (!userId || isNaN(userId) || !parsedUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const violations = await violationModel.list(userId);

    res.status(200).json(violations);
  } catch (error) {
    console.error("Error listing violations:", error);

    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};
