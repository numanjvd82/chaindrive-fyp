import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { hashPassword } from "../../utils/cryptoUtils";
import { sql } from "../../utils/utils";

export const signUpSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(32),
  role: z.enum(["owner", "renter"]),
});

export const createOne = async (input: z.infer<typeof signUpSchema>) => {
  if (!input) return;
  try {
    // Validate and parse the input
    const parsedUser = signUpSchema.parse(input);

    // Check for duplicate email
    const emailExists = sqliteInstance
      .prepare(sql`SELECT 1 FROM users WHERE email = ?`)
      .get(parsedUser.email);

    if (emailExists) {
      throw new Error("Email already exists");
    }

    // Hash password and insert the user into the database
    const { hash, salt } = hashPassword(parsedUser.password);

    const stmt = sqliteInstance.prepare(
      sql`INSERT INTO users (first_name, last_name, email, password_hash, salt, role) VALUES (?, ?, ?, ?, ?, ?)`
    );

    stmt.run(
      parsedUser.first_name,
      parsedUser.last_name,
      parsedUser.email,
      hash,
      salt,
      parsedUser.role
    );

    return true;
  } catch (error: any) {
    throw error;
  }
};
