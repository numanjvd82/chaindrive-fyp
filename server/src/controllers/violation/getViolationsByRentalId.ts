import { Request, Response } from "express";
import { violationModel } from "../../models/violation";

export const getViolationsByRentalId = async (req: Request, res: Response) => {
  try {
    const { rentalId } = req.params;

    if (!rentalId) {
      res.status(400).json({
        success: false,
        message: "Rental ID is required",
      });
      return;
    }

    const rentalIdNumber = parseInt(rentalId, 10);

    if (isNaN(rentalIdNumber)) {
      res.status(400).json({
        success: false,
        message: "Invalid rental ID format",
      });
      return;
    }

    const violations = violationModel.getByRentalId(rentalIdNumber);

    res.status(200).json(violations);
  } catch (error: any) {
    console.error("Error fetching violations by rental ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch violations",
      error: error.message,
    });
  }
};
