import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export const LogoutButton = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      queryClient.setQueryData("user", null); // Clear user data
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};
