import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { axiosInstance } from "../lib/axios";
import { User } from "../lib/types";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get<User>("/api/auth/me");
      setUser(data);
      return data;
    } catch (err) {
      console.error(err);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user details on initial render
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
