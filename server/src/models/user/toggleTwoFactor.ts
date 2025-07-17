import { z } from "zod";
import { getDbInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const toggleTwoFactorSchema = z.object({
  enabled: z.boolean(),
});

type ToggleTwoFactorInput = z.infer<typeof toggleTwoFactorSchema> & {
  userId: number;
};

export const toggleTwoFactor = async (input: ToggleTwoFactorInput) => {
  try {
    const parsedInput = toggleTwoFactorSchema.parse(input);
    const db = getDbInstance();
    const result = db
      .prepare(sql`UPDATE Users SET two_factor_enabled = ? WHERE id = ?`)
      .run(parsedInput.enabled === true ? 1 : 0, input.userId);

    if (result.changes === 0) {
      throw new Error("Failed to update two-factor authentication setting");
    }

    return true;
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to toggle two-factor authentication"
    );
  }
};
