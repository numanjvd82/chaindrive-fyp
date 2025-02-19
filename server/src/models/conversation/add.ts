import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const addConversationSchema = z.object({
  user1: z.number().int().positive(),
  user2: z.number().int().positive(),
});

export type AddConversationInput = z.infer<typeof addConversationSchema>;

const INSERT_QUERY = sql`
INSERT INTO Conversations (user1, user2, last_message, last_seen)
VALUES (?, ?, NULL, CURRENT_TIMESTAMP);
`;

export const addConversation = async (input: AddConversationInput) => {
  const parsedInput = addConversationSchema.parse(input);

  try {
    const stmt = sqliteInstance.prepare(INSERT_QUERY);
    const result = stmt.run(parsedInput.user1, parsedInput.user2);

    if (result.changes === 0) {
      throw new Error("Failed to add conversation");
    }

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
