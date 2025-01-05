import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import Button from "../components/Button";
import Input from "../components/Input";
import { useUser } from "../hooks/useUser";
import { axiosInstance } from "../lib/axios";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const { refetch } = useUser();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      await axiosInstance.post("/api/auth/login", data);
      const user = await refetch(); // Fetch and update user context
      if (user.data) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
      reset();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign in</h2>
        <Input
          type="text"
          placeholder="User name or email address"
          {...register("email")}
        />
        <div className="text-red-500 text-sm">{errors.email?.message}</div>
        <div className="relative mb-4">
          <Input
            type="password"
            placeholder="Your password"
            {...register("password")}
          />
          <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
            Hide
          </span>
        </div>
        <div className="text-red-500 text-sm">{errors.password?.message}</div>
        <div className="mb-4 text-right">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forget your password?
          </a>
        </div>
        <Button disabled={!isDirty || !isValid} text="Login" type="submit" />
        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
