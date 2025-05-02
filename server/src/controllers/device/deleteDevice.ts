import { Request, Response } from "express";
import { deviceModel } from "../../models/device";

export const deleteDeviceController = async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  try {
    await deviceModel.delete(deviceId);

    res.status(200).json({ message: "Device deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
