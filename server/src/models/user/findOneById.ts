import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { User } from "../../lib/types";
import { convertBufferToBase64, sql } from "../../utils/utils";

export const idSchema = z.number().int().positive();

export const SQL_QUERY = sql`
  SELECT 
  u.id,
  u.email,
  u.role,
  u.created_at,
  u.updated_at,
  u.two_factor_enabled,
  pi.first_name,
  pi.last_name,
  pi.phone,
  pi.address,
  pi.city,
  pi.state,
  k.dob,
  k.id_card_front,
  k.id_card_back,
  k.selfie
FROM users u
INNER JOIN PersonalInfo pi ON u.id = pi.user_id
INNER JOIN KycInfo k ON u.id = k.user_id
WHERE u.id = ?;
`;

export const findOneById = async (id: z.infer<typeof idSchema>) => {
  if (!id) return;
  try {
    const parsedId = idSchema.parse(id);
    const user = sqliteInstance
      .prepare(SQL_QUERY)
      .all(parsedId)
      .map((row: any) => {
        const changedRow = {
          ...row,
          firstName: row.first_name,
          lastName: row.last_name,
          idCardFront: convertBufferToBase64(row.id_card_front),
          idCardBack: convertBufferToBase64(row.id_card_back),
          selfie: convertBufferToBase64(row.selfie),
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
          twoFactorEnabled: row.two_factor_enabled === 1,
        };

        delete changedRow.first_name;
        delete changedRow.last_name;
        delete changedRow.created_at;
        delete changedRow.updated_at;
        delete changedRow.id_card_front;
        delete changedRow.id_card_back;
        delete changedRow.two_factor_enabled;

        return changedRow;
      })[0] as User;

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};
