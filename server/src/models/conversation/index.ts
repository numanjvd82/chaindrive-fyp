import { addConversation } from "./add";
import { listConversations } from "./list";
import { updateConversation } from "./update";

export const conversationModel = {
  list: listConversations,
  add: addConversation,
  update: updateConversation,
};
