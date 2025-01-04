import { createOne } from "./createOne";
import { deleteOne } from "./deleteOne";
import { findOne } from "./findOne";

export type Session = {
  id: string;
  user_id: number;
  session_id: string;
  data: Record<string, unknown>;
  expires_at: Date;
  created_at: Date;
};

export const sessionModel = {
  createOne,
  findOne,
  deleteOne,
};
