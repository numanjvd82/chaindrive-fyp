import { Request, Response } from "express";
import { walletModel } from "../../models/wallet";

export const storeWallet = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { walletAddress } = req.body;
  if (!walletAddress) {
    res.status(400).json({ error: "Wallet address and balance are required" });
    return;
  }
  try {
    const wallet = await walletModel.store({
      userId,
      walletAddress,
    });

    if (!wallet) {
      res
        .status(404)
        .json({ error: "Wallet cannot be stored. Please try again!" });
      return;
    }

    res.status(200).json(wallet);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "An unexpected error occurred",
    });
  }
};
