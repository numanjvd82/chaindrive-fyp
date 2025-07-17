import { Request, Response } from "express";
import { deviceModel } from "../../models/device";
export const createDeviceController = async (req: Request, res: Response) => {
  const { deviceId, listingId } = req.body;

  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const id = await deviceModel.add({
      deviceId,
      listingId,
      userId,
    });

    res.status(201).json(deviceId);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
