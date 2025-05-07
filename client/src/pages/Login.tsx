import Button from "@/components/Button";
import Input from "@/components/Input";
import { useUser } from "@/hooks/useUser";
import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", data);

      // Check if OTP is required
      if (response.data.message === "OTP sent to your email") {
        toast.success("OTP sent to your email", {
          onClose: () =>
            navigate("/otp-input", { state: { email: data.email } }),
        });
        return;
      }

      // If no OTP is required, fetch user data and redirect
      const user = await fetchUser(); // Fetch and update user context
      if (user.data) {
        const role = user.data.role;
        const path =
          role === "renter" ? "/renter-dashboard" : "/owner-dashboard";
        navigate(path);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.info("User not verified. Redirecting to OTP page.", {
          onClose: () => {
            navigate("/otp-input", { state: { email: data.email } });
          },
        });
        return;
      }
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
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="mb-4 text-right">
          <a href="#" className="text-sm text-primary hover:underline">
            Forget your password?
          </a>
        </div>
        <div
          className="
            flex
            items-center
            justify-center
            w-full
            mt-4
        "
        >
          <Button
            disabled={!isDirty || !isValid}
            isLoading={isSubmitting}
            type="submit"
            size="lg"
          >
            Login
          </Button>
        </div>
        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
