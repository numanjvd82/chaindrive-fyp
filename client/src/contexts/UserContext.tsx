import { createContext } from "react";
import { User } from "../lib/types";

export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => Promise<User | null>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  fetchUser: async () => null,
  loading: true,
});
