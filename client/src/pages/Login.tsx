import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { axiosInstance } from "../lib/axios";

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/login", form);
      const user = await fetchUser(); // Fetch and update user context
      if (user) {
        navigate(user.role === "renter" ? "/renter-profile" : "/owner-profile");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
