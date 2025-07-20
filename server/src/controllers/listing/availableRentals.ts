import { Request, Response } from "express";
import { listingModel } from "../../models/listing";
import { availableRentalsFilterSchema } from "../../models/listing/availableRentals";

export const availableRentals = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Parse filter parameters from query string
    const filters = availableRentalsFilterSchema.parse(req.query);
    
    const listings = await listingModel.availableRentals(filters);

    res.status(200).json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
