import { Request, Response } from "express";
import { listingModel } from "../../models/listing";

export const addListing = async (req: Request, res: Response) => {
  const {
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

  if (isNaN(yearNumber) || isNaN(pricePerDayNumber) || isNaN(seatsNumber)) {
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
    await listingModel.add({
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
      userId,
    });

    res.status(201).json({
      message: "Listing added successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
