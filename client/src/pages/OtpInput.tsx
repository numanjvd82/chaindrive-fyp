import { useUser } from "@/hooks/useUser";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type OtpInputs = {
  otp: string[];
};

const OTP_LENGTH = 6;

const OtpInput: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email as string;
  const navigate = useNavigate();

  const { fetchUser } = useUser();
  const { isVerifyOtpLoading, verifyOtp } = useVerifyOtp();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isSubmitting },
  } = useForm<OtpInputs>({
    defaultValues: {
      otp: Array(OTP_LENGTH).fill(""),
    },
    mode: "onChange",
  });

  const otpValues = watch("otp");
  const isOtpValid = otpValues.every((digit) => /^\d$/.test(digit));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const onSubmit = async (data: OtpInputs) => {
    if (!email) return;
    const otp = data.otp.join("");

    try {
      await verifyOtp({ email, otp });
      const user = await fetchUser();
      if (user.data) {
        const path =
          user.data.role === "renter"
            ? "/renter-dashboard"
            : "/owner-dashboard";
        toast.success("OTP verified successfully", {
          onClose: () => navigate(path),
        });
      }
    } finally {
      // Pass
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      setValue(`otp.${index}`, value);
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      setValue(`otp.${index}`, "");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const value = getValues(`otp.${index}`);
      if (value === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  if (!email) {
    return <div>No email provided</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
        <p className="text-center text-gray-500 mb-6">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex gap-2 justify-center">
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              <Controller
                key={index}
                name={`otp.${index}`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:ring-2 focus:ring-primary focus:outline-none"
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                )}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={!isOtpValid || isSubmitting || isVerifyOtpLoading}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              !isOtpValid || isSubmitting || isVerifyOtpLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting || isVerifyOtpLoading ? "Verifying..." : "Submit"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Entered wrong email? Didn't receive the OTP?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Go back to login
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpInput;
