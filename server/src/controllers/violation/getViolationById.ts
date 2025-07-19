import { Request, Response } from "express";
import { violationModel } from "../../models/violation";

export const getViolationById = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      res.status(400).json({
        error: "Invalid violation ID",
      });
      return;
    }

    const violation = await violationModel.getById(parseInt(id));

    if (!violation) {
      res.status(404).json({
        error: "Violation not found",
      });
      return;
    }

    res.status(200).json(violation);
  } catch (error) {
    console.error("Error getting violation:", error);

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
