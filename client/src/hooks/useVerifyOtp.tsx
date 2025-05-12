import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface VerifyOtpInput {
  email: string;
  otp: string;
}

async function verifyOtp(input: VerifyOtpInput) {
  try {
    const { data } = await axiosInstance.post<boolean>(
      "/api/otp/verify",
      input
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
}

export function useVerifyOtp() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: verifyOtp,
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while verifying OTP");
    },
  });

  return {
    verifyOtp: mutateAsync,
    isVerifyOtpLoading: isLoading,
  };
}
