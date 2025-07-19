import { Request, Response } from "express";
import { violationModel } from "../../models/violation";

export const createViolation = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const {
    rentalId,
    violationType,
    expectedDamage,
    detailedQuery,
    status = "pending",
  } = req.body;

  const files = req.files as Express.Multer.File[];

  try {
    // Validate required fields
    if (!rentalId || !violationType || !detailedQuery) {
      res.status(400).json({
        error:
          "Missing required fields: rentalId, violationType, detailedQuery",
      });
      return;
    }

    // Convert rentalId to number
    const rentalIdNumber = Number(rentalId);
    if (isNaN(rentalIdNumber)) {
      res.status(400).json({ error: "Invalid rental ID" });
      return;
    }

    // Validate photos limit
    if (files && files.length > 4) {
      res.status(400).json({
        error: "Maximum 4 photos allowed",
      });
      return;
    }

    // Convert uploaded files to base64 strings (following the listing pattern)
    const photos = files
      ? files.map((file) => file.buffer.toString("base64"))
      : undefined;

    const violation = await violationModel.create({
      rentalId: rentalIdNumber,
      violationType,
      expectedDamage,
      detailedQuery,
      photos,
      status,
      reportedByUserId: userId,
    });

    res.status(201).json({
      message: "Violation created successfully",
      violation,
    });
  } catch (error) {
    console.error("Error creating violation:", error);

    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
};
