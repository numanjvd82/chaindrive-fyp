import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";

export const getRentalById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Rental ID is required" });
    return;
  }

  const rentalId = parseInt(id, 10);

  if (isNaN(rentalId) || rentalId <= 0) {
    res.status(400).json({ message: "Invalid rental ID" });
    return;
  }

  try {
    const rental = await rentalModel.getbyId(rentalId);

    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
      return;
    }

    res.status(200).json(rental);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
