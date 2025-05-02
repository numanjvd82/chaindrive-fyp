import { Request, Response } from "express";
import { deviceModel } from "../../models/device";

export const listDeviceByIdController = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const device = await deviceModel.listById(userId);

    if (!device) {
      res.status(404).json({ error: "Device not found" });
      return;
    }

    res.status(200).json(device);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
