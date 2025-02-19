import { insertMessage } from "./add";
import { listMessages } from "./list";

export const messageModel = {
  list: listMessages,
  add: insertMessage,
};
