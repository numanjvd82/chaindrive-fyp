import { createContext } from "react";
import { QueryObserverResult } from "react-query";
import { User } from "../lib/types";

export const UserContext = createContext<{
  user: User | null;
  fetchUser: () => Promise<QueryObserverResult<User | null, unknown>>;
  loading: boolean;
}>({
  user: null,
  fetchUser: async () =>
    ({ data: null } as QueryObserverResult<User | null, unknown>),
  loading: true,
});
