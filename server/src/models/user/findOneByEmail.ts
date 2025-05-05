import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { PartialUser } from "../../lib/types";
import { sql } from "../../utils/utils";
import { signUpSchema } from "./createOne";

export type findOneByEmailType = z.infer<typeof signUpSchema>["email"];

export const findOneByEmail = async (email: findOneByEmailType) => {
  if (!email) return;
  try {
    const user = sqliteInstance
      .prepare(sql`SELECT * FROM users WHERE email = ?`)
      .all(email)
      .map((row: any) => ({
        ...row,
        twoFactorEnabled: row.two_factor_enabled === 1,
      }))[0] as PartialUser | undefined;

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};
