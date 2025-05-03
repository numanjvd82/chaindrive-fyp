import { Request, Response } from "express";
import { dashboardModel } from "../../models/dashboard";
import { userModel } from "../../models/user";

export const getDashboardBasicInfo = async (req: Request, res: Response) => {
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
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const basicInfo = await dashboardModel.getBasicInfo(userId);
    res.status(200).json(basicInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
