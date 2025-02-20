import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";
import { conversationModel } from "../conversation";

export const insertMessageSchema = z.object({
  conversationId: z.number().int().positive(),
  senderId: z.number().int().positive(),
  message: z.string().min(1),
});

export type InsertMessageInput = z.infer<typeof insertMessageSchema>;

export const insertMessage = async (input: InsertMessageInput) => {
  const parsedInput = insertMessageSchema.parse(input);

  try {
    // Insert message to the database
    const stmt = sqliteInstance.prepare(
      sql`INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)`
    );

    const result = stmt.run(
      parsedInput.conversationId,
      parsedInput.senderId,
      parsedInput.message
    );

    if (result.changes === 0) {
      throw new Error("Failed to insert message");
    }

    // Update the conversation's last message
    await conversationModel.update({
      id: parsedInput.conversationId,
      lastMessage: parsedInput.message,
    });

    const newMessage = {
      id: result.lastInsertRowid,
      conversationId: parsedInput.conversationId,
      senderId: parsedInput.senderId,
      message: parsedInput.message,
      isRead: 0,
      createdAt: new Date().toISOString(),
    };

    return newMessage;
  } catch (error: any) {
    throw Error(error.message);
  }
};
