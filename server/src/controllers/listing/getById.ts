import { Request, Response } from "express";
import { listingModel } from "../../models/listing";

export const getListingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "Listing ID is required" });
    return;
  }

  const listingId = parseInt(id, 10);

  if (isNaN(listingId) || listingId <= 0) {
    res.status(400).json({ message: "Invalid listing ID" });
    return;
  }

  try {
    const listing = await listingModel.getById(listingId);

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
      return;
    }

    res.status(200).json(listing);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
