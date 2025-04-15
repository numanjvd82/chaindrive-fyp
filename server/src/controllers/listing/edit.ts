import { Request, Response } from "express";
import { listingModel } from "../../models/listing";

export const editListing = async (req: Request, res: Response) => {
  const {
    id,
    title,
    model,
    year,
    pricePerDay,
    seats,
    location,
    licensePlate,
    transmissionType,
    fuelType,
  } = req.body;

  const files = req.files as Express.Multer.File[];

  // Convert necessary fields to numbers
  const yearNumber = Number(year);
  const pricePerDayNumber = Number(pricePerDay);
  const seatsNumber = Number(seats);
  const listingId = Number(id);

  if (
    isNaN(yearNumber) ||
    isNaN(pricePerDayNumber) ||
    isNaN(seatsNumber) ||
    isNaN(id)
  ) {
    res.status(400).json({ message: "Invalid numerical values provided" });
    return;
  }

  if (!files || files.length === 0) {
    res.status(400).json({ message: "Please upload at least one image" });
    return;
  }

  const images = files.map((file) => file.buffer);

  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await listingModel.edit({
      id: listingId,
      title,
      model,
      year: yearNumber,
      pricePerDay: pricePerDayNumber,
      seats: seatsNumber,
      location,
      licensePlate,
      transmissionType,
      fuelType,
      images,
    });

    res.status(201).json({
      message: "Listing edited successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
