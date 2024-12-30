import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export const useUser = () => {
  if (!UserContext) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return useContext(UserContext);
};
