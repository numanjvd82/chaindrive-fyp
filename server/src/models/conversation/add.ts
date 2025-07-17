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
    // Check if the conversation already exists
    const checkStmt = sqliteInstance.prepare(
      sql`SELECT id FROM Conversations WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?);`
    );

    const existingConversation = checkStmt
      .all(
        parsedInput.user1,
        parsedInput.user2,
        parsedInput.user2,
        parsedInput.user1
      )
      .map((row: any) => ({
        id: row.id,
      }))[0];

    if (existingConversation) {
      return existingConversation.id as number;
    }

    const stmt = sqliteInstance.prepare(INSERT_QUERY);
    const result = stmt.run(parsedInput.user1, parsedInput.user2);

    if (result.changes === 0) {
      throw new Error("Failed to add conversation");
    }

    // return the ID of the newly created conversation
    const conversationId = result.lastInsertRowid;
    return conversationId as number;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
