import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";

export const completeFromRenter = async (req: Request, res: Response) => {
  const { rentalId } = req.body;

  if (!rentalId) {
    res.status(400).json({ message: "Rental ID is required" });
    return;
  }

  try {
    const result = await rentalModel.completeFromRenter(rentalId);

    if (!result) {
      res
        .status(400)
        .json({ message: "Failed to complete rental from renter" });
      return;
    }

    res
      .status(200)
      .json({ message: "Rental successfully completed by renter" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
