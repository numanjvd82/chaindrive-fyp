import { Request, Response } from "express";
import { userModel } from "../../models/user";

export const getOtherUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const numberId = Number(id);

    // @ts-ignore
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ error: "Unauthorized" });
      return;
    }

    // Validate the userId
    if (isNaN(numberId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // Fetch user data from the database using the userId
    const user = await userModel.findOneById(numberId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching other user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
