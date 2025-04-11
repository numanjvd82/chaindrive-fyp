import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

async function storeWallet(walletAddress: string) {
  try {
    const { data } = await axiosInstance.post("/api/wallet/add", {
      walletAddress,
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
}

export function useStoreWallet() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: storeWallet,
    onSuccess: () => {
      toast.success("Wallet added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while storing the wallet"
      );
    },
  });

  return {
    storeWallet: mutateAsync,
    isLoadingStoreWallet: isLoading,
  };
}
