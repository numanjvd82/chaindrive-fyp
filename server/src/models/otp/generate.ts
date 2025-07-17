import otpGenerator from "otp-generator";
import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const generateOtpSchema = z.object({
  email: z.string().email(),
});

export type GenerateOtpInput = z.infer<typeof generateOtpSchema>;

const OTP_EXPIRATION_TIME = 2 * 60 * 1000; // 2 minutes

export async function generate(input: GenerateOtpInput) {
  try {
    const { email } = generateOtpSchema.parse(input);

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expiresAt = Math.floor((Date.now() + OTP_EXPIRATION_TIME) / 1000); // in seconds

    const db = getDbInstance();
    const result = db
      .prepare(
        sql`
      INSERT INTO Otp (email, otp, expiresAt)
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET otp = excluded.otp, expiresAt = excluded.expiresAt;
      `
      )
      .run(email, otp, expiresAt);

    if (result.changes === 0) {
      throw new Error("Failed to generate OTP");
    }

    return otp;
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate OTP");
  }
}
