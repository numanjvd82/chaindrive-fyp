import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { sql } from "../../utils/utils";

export const listOneConversationSchema = z.object({
  conversationId: z.number().int().positive(),
  userId: z.number().int().positive(),
});

type LightConversation = {
  id: number;
  user1: number;
  user2: number;
  name: string;
};

export type listOneConversationInput = z.infer<
  typeof listOneConversationSchema
>;

const SQL_QUERY = sql`
SELECT conversations.id,
       user1,
       user2,
       CASE 
         WHEN u1.id = ? THEN pi1.first_name || ' ' || pi1.last_name 
         ELSE pi2.first_name || ' ' || pi2.last_name 
       END AS name
FROM conversations
JOIN users u1 ON user1 = u1.id
JOIN users u2 ON user2 = u2.id
JOIN PersonalInfo pi1 ON u1.id = pi1.user_id
JOIN PersonalInfo pi2 ON u2.id = pi2.user_id
WHERE conversations.id = ?
`;

export const listOneConversation = async (input: listOneConversationInput) => {
  if (!input) return;
  const { conversationId, userId } = listOneConversationSchema.parse(input);

  try {
    const stmt = sqliteInstance.prepare(SQL_QUERY);
    const conversation = stmt.get(userId, conversationId) as LightConversation;

    if (!conversation) {
      throw new Error("No conversation found");
    }

    return conversation;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
