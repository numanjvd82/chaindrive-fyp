import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";

export const completeFromOwner = async (req: Request, res: Response) => {
  const { rentalId } = req.body;

  if (!rentalId) {
    res.status(400).json({ message: "Rental ID is required" });
    return;
  }

  try {
    const result = await rentalModel.completeFromOwner(rentalId);

    if (!result) {
      res.status(400).json({ message: "Failed to complete rental from owner" });
      return;
    }

    res.status(200).json({ message: "Rental successfully completed by owner" });
  } catch (error: any) {
    console.error(
      "Error in completeRentalFromOwner controller:",
      error.message
    );
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
