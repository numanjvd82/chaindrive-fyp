import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { axiosInstance } from "../lib/axios";

export const LogoutButton = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      setUser(null); // Clear user context
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};
