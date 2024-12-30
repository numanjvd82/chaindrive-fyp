import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { User } from "../../lib/types";
import { sql } from "../../utils/utils";
import { signUpSchema } from "./createOne";

export type findOneByEmailType = z.infer<typeof signUpSchema>["email"];

export const findOneByEmail = async (email: findOneByEmailType) => {
  if (!email) return;
  try {
    const user = sqliteInstance
      .prepare(sql`SELECT * FROM users WHERE email = ?`)
      .get(email) as User | undefined;

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};
