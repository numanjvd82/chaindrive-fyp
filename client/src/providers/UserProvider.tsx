import { UserContext } from "@/contexts/UserContext";
import useAuthUser from "@/hooks/useAuthUser";
import { User } from "../lib/types";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, refetch } = useAuthUser(); // Use the custom hook

  return (
    <UserContext.Provider
      value={{
        user: user as User,
        fetchUser: refetch,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
