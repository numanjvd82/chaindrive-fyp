import { z } from "zod";
import { sqliteInstance } from "../../lib/db/sqlite";
import { Conversation } from "../../lib/types";
import { sql } from "../../utils/utils";

export const listConversationSchema = z.number().int().positive();

export type listConversationInput = z.infer<typeof listConversationSchema>;

const SQL_QUERY = sql`
SELECT c.id, 
       CASE 
         WHEN u1.id = ? THEN u2.id 
         ELSE u1.id 
       END AS other_user_id,
       CASE 
         WHEN u1.id = ? THEN pi2.first_name || ' ' || pi2.last_name 
         ELSE pi1.first_name || ' ' || pi1.last_name 
       END AS name,
       CASE 
         WHEN u1.id = ? THEN kyc2.selfie 
         ELSE kyc1.selfie 
       END AS avatar,
       c.last_message, 
       c.last_seen
FROM Conversations c
JOIN Users u1 ON c.user1 = u1.id
JOIN Users u2 ON c.user2 = u2.id
JOIN PersonalInfo pi1 ON u1.id = pi1.user_id
JOIN PersonalInfo pi2 ON u2.id = pi2.user_id
JOIN KycInfo kyc1 ON u1.id = kyc1.user_id
JOIN KycInfo kyc2 ON u2.id = kyc2.user_id
WHERE ? IN (c.user1, c.user2);
`;

export const listConversations = async (input: listConversationInput) => {
  if (!input) return;
  const parsedInput = listConversationSchema.parse(input);

  try {
    const stmt = sqliteInstance.prepare(SQL_QUERY);
    const conversations = stmt
      .all(parsedInput, parsedInput, parsedInput, parsedInput)
      .map((conversation: any) => {
        return {
          id: conversation.id,
          otherUserId: conversation.other_user_id,
          name: conversation.name,
          avatar: conversation.avatar,
          lastMessage: conversation.last_message,
          lastSeen: new Date(conversation.last_seen),
        };
      }) as Conversation[];

    if (!conversations.length) {
      throw new Error("No conversations found");
    }

    return conversations;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
