import { Request, Response } from "express";
import { rentalModel } from "../../models/rental";
import { userModel } from "../../models/user";

export const confirmRentalFromOwner = async (req: Request, res: Response) => {
  const { rentalId } = req.body;

  if (!rentalId) {
    res.status(400).json({ message: "Rental ID is required" });
    return;
  }

  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await userModel.findOneById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.role !== "owner") {
    res.status(403).json({ message: "Only owners can confirm rentals" });
    return;
  }

  try {
    await rentalModel.confirm(rentalId);

    res.status(200).json({ message: "Rental successfully confirmed by owner" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
