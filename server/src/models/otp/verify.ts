import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export async function verify(input: VerifyOtpInput) {
  try {
    const { email, otp } = verifyOtpSchema.parse(input);

    const db = sqliteInstance;
    const doesOtpExist = db
      .prepare(
        sql`SELECT * FROM otp WHERE email = ? AND otp = ? AND expiresAt > strftime('%s', 'now')`
      )
      .get(email, otp);

    if (!doesOtpExist) {
      throw new Error("Invalid or expired OTP");
    }

    db.prepare(sql`DELETE FROM otp WHERE email = ?`).run(email);

    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify OTP");
  }
}
