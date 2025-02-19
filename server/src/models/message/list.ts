import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { Message } from "../../lib/types";
import { sql } from "../../utils/utils";

// Schema for listing messages
export const listMessagesSchema = z.object({
  conversationId: z.number().int().positive(),
});

export type ListMessagesInput = z.infer<typeof listMessagesSchema>;

export const listMessages = async (input: ListMessagesInput) => {
  const parsedInput = listMessagesSchema.parse(input);

  try {
    // Fetch messages from the database
    const stmt = sqliteInstance.prepare(
      sql`SELECT * FROM messages WHERE conversation_id = ?`
    );
    const messages = stmt
      .all(parsedInput.conversationId)
      .map((message: any) => ({
        id: message.id,
        conversationId: message.conversation_id,
        senderId: message.sender_id,
        message: message.message,
        isRead: message.is_read === 1 ? true : false,
        createdAt: new Date(message.created_at),
      })) as Message[];

    return messages;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
