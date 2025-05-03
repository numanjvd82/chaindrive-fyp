import { Request, Response } from "express";
import { walletModel } from "../../models/wallet";

export const listWallet = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { walletAddress, id } = req.query;

  if (!walletAddress && !id) {
    res.status(400).json({ error: "Wallet address or ID is required" });
    return;
  }

  const idNumber = parseInt(id as string, 10);

  if (isNaN(idNumber)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const wallet = await walletModel.list({
      id: idNumber,
      walletAddress: walletAddress as string,
    });

    if (!wallet) {
      res.status(200).json(null);
      return;
    }

    res.status(200).json(wallet);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
