import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { axiosInstance } from "../lib/axios";
import { User } from "../lib/types";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<User>("/api/auth/me", {
        withCredentials: true,
      });
      setUser(data);
      return user;
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user details on initial render
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
