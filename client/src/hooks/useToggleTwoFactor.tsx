import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

interface ToggleTwoFactorInput {
  enabled: boolean;
}

async function toggleTwoFactor(input: ToggleTwoFactorInput) {
  try {
    const { data } = await axiosInstance.post<boolean>(
      "/api/users/toggle-2fa",
      input
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to toggle 2FA");
  }
}

export function useToggleTwoFactor() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: toggleTwoFactor,
    onError: (error: any) => {
      toast.error(error.message || "An error occurred while toggling 2FA");
    },
  });

  return {
    toggleTwoFactor: mutateAsync,
    isToggleTwoFactorLoading: isLoading,
  };
}
