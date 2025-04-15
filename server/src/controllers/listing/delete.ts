import { Request, Response } from "express";
import { listingModel } from "../../models/listing";

export const delteListing = async (req: Request, res: Response) => {
  const { id } = req.params;

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  try {
    await listingModel.delete(idNumber);
    res.status(200).json({ message: "Listing deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
    return;
  }
};
