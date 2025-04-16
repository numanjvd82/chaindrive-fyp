import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { Wallet } from "../../lib/types";
import { sql } from "../../utils/utils";

export const listSchema = z.object({
  id: z.number().optional(),
  walletAddress: z.string().optional(),
});

export type ListInput = z.infer<typeof listSchema>;

export const generateWhereClause = (input: ListInput) => {
  const whereClause = [];
  const params = [];

  if (input.id) {
    whereClause.push("user_id = ?");
    params.push(input.id);
  }

  if (input.walletAddress) {
    whereClause.push("wallet_address = ?");
    params.push(input.walletAddress);
  }

  return {
    where: whereClause.length > 0 ? `WHERE ${whereClause.join(" AND ")}` : "",
    params,
  };
};

export const listByFilter = async (input: ListInput) => {
  try {
    const parsedInput = listSchema.parse(input);
    const db = getDbInstance();
    const { where, params } = generateWhereClause(parsedInput);

    const query = sql`SELECT * FROM Wallets ${where}`;
    const stmt = db.prepare(query);
    const wallets = stmt.all(...params).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      walletAddress: row.wallet_address,
      balance: row.balance,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    })) as Wallet[];

    if (wallets.length === 0) {
      return null;
    }

    return wallets[0];
  } catch (error) {
    throw new Error("Failed to list wallets");
  }
};
