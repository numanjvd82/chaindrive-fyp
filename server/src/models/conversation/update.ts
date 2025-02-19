import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const updateConversationSchema = z.object({
  id: z.number().int().positive(),
  lastMessage: z.string().min(1),
});

export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;

const UPDATE_QUERY = sql`
UPDATE Conversations 
SET last_message = ?, last_seen = CURRENT_TIMESTAMP
WHERE id = ?;
`;

export const updateConversation = async (input: UpdateConversationInput) => {
  const parsedInput = updateConversationSchema.parse(input);

  try {
    const stmt = sqliteInstance.prepare(UPDATE_QUERY);
    const result = stmt.run(parsedInput.lastMessage, parsedInput.id);

    if (result.changes === 0) {
      throw new Error("Failed to update conversation");
    }

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
