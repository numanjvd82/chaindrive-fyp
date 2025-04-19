import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";

export const createRental = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const {
    listingId,
    renterAddress,
    ownerAddress,
    startDate,
    endDate,
    rentalFee,
    securityDeposit,
    platformFee,
    totalEth,
    isCompleted,
    renterId,
    status,
  } = req.body;

  try {
    const rental = await rentalModel.add({
      listingId,
      renterAddress,
      ownerAddress,
      startDate,
      endDate,
      rentalFee,
      securityDeposit,
      platformFee,
      totalEth,
      status,
      isCompleted,
      renterId,
    });

    res.status(201).json(rental);
  } catch (error: any) {
    console.error("Error creating rental:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred",
    });
  }
};
