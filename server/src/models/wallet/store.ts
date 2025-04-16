import dayjs from "dayjs";
import { z } from "zod";
import { walletModel } from ".";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const storeSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export type StoreInput = z.infer<typeof storeSchema> & {
  userId: number;
};

export const store = async (input: StoreInput) => {
  if (!input) {
    throw new Error("Input is required");
  }
  try {
    const parsedInput = storeSchema.parse(input);
    const db = getDbInstance();
    // Check if the wallet address already exists
    const existingWallet = await walletModel.list({
      walletAddress: parsedInput.walletAddress,
    });

    if (existingWallet) {
      const userCannotUpdate = dayjs(existingWallet.updatedAt).isAfter(
        dayjs().subtract(3, "day")
      );

      if (userCannotUpdate) {
        const nextUpdateDate = dayjs(existingWallet.updatedAt).add(3, "day");
        throw new Error(
          `Wallet cannot be updated until ${nextUpdateDate.format(
            "YYYY-MM-DD"
          )}`
        );
      } else {
        // Insert the new wallet into the database
        const stmt = db.prepare(
          sql`UPDATE Wallets
SET 
  user_id = ?, 
  wallet_address = ?, 
  updated_at = CURRENT_TIMESTAMP
WHERE 
  wallet_address = ?`
        );

        const result = stmt.run(
          input.userId,
          parsedInput.walletAddress,
          parsedInput.walletAddress
        );

        if (result.changes === 0) {
          throw new Error("Failed to update wallet");
        }

        return true;
      }
    }

    // Insert the new wallet into the database
    const stmt = db.prepare(
      sql`INSERT INTO Wallets (user_id, wallet_address, created_at, updated_at)
VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    );
    const result = stmt.run(input.userId, parsedInput.walletAddress);

    if (result.changes === 0) {
      throw new Error("Failed to add wallet");
    }

    return true;
  } catch (error: any) {
    throw new Error(`Wallet operation failed: ${error.message}`);
  }
};
