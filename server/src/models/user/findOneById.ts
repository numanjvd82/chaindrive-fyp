import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { User } from "../../lib/types";
import { sql } from "../../utils/utils";

export const idSchema = z.number().int().positive();

export const findOneById = async (id: z.infer<typeof idSchema>) => {
  if (!id) return;
  try {
    const user = sqliteInstance
      .prepare(sql`SELECT * FROM users WHERE id = ?`)
      .get(id) as User | undefined;

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};
