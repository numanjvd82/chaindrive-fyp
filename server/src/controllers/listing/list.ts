import { Request, Response } from "express";
import { listingModel } from "../../models/listing";

export const getListings = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const listings = await listingModel.list(userId);

    res.status(200).json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
