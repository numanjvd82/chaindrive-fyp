import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";

export const listRentals = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const isOwner = req.query.isOwner === "true";
  const isRenter = req.query.isRenter === "true";
  try {
    const rentals = await rentalModel.list({
      userId,
      isOwner,
      isRenter,
    });

    if (!rentals || rentals.length === 0) {
      res.status(404).json({ message: "No rentals found" });
      return;
    }

    res.status(200).json(rentals);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
