import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { PartialUser } from "../../lib/types";
import { hashPassword } from "../../utils/cryptoUtils";
import { sql } from "../../utils/utils";

export const signUpSchema = z.object({
  role: z
    .enum(["renter", "owner"], { required_error: "Role is required" })
    .default("renter"),
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters long"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email("Invalid email address")
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\d{11}$/, "Phone number must be 11 digits long")
    .refine(
      (phone) => phone.startsWith("0"),
      "Phone number must start with '0'"
    )
    .transform((phone) => `92${phone.slice(1)}`),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  dob: z
    .string()
    .nonempty("Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format"),
  idCardFront: z.any(),
  idCardBack: z.any(),
  selfie: z.any(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("State is required"),
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

    // Hash password
    const { hash, salt } = hashPassword(parsedUser.password);

    // Begin transaction
    const tx = sqliteInstance.transaction(() => {
      // Insert user into `users` table
      const userInsertStmt = sqliteInstance.prepare(
        sql`
INSERT INTO users 
(email, password_hash, salt, role) 
VALUES (?, ?, ?, ?)`
      );
      userInsertStmt.run(parsedUser.email, hash, salt, parsedUser.role);

      // Get the inserted user's ID
      const user = sqliteInstance
        .prepare(sql`SELECT id FROM users WHERE email = ?`)
        .get(parsedUser.email) as PartialUser | undefined;
      if (!user) {
        throw new Error("User not found after insertion");
      }

      const userId = user.id;

      // Insert user's personal information into `PersonalInfo` table
      const personalInfoStmt = sqliteInstance.prepare(
        sql`
INSERT INTO PersonalInfo 
(user_id, first_name, last_name, phone, address, city, state) 
VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      personalInfoStmt.run(
        userId,
        parsedUser.firstName,
        parsedUser.lastName,
        parsedUser.phone,
        parsedUser.address,
        parsedUser.city,
        parsedUser.state
      );

      // Insert user's KYC information into `KycInfo` table
      const kycInfoStmt = sqliteInstance.prepare(
        sql`
INSERT INTO KycInfo 
(user_id, dob, id_card_front, id_card_back, selfie) 
VALUES (?, ?, ?, ?, ?)`
      );
      kycInfoStmt.run(
        userId,
        new Date(parsedUser.dob).toISOString(),
        parsedUser.idCardFront,
        parsedUser.idCardBack,
        parsedUser.selfie
      );
    });

    tx();

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
