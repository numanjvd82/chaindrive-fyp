import { addConversation } from "./add";
import { listConversations } from "./list";
import { listOneConversation } from "./listOne";
import { updateConversation } from "./update";

export const conversationModel = {
  list: listConversations,
  add: addConversation,
  update: updateConversation,
  byId: listOneConversation,
};
