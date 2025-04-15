import { axiosInstance } from "@/lib/axios";
import { Wallet } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchWallet(params: { walletAddress?: string; id?: number }) {
  try {
    const { data } = await axiosInstance.get<Wallet>("/api/wallet", {
      params,
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
}

export function useListWallet(params: { walletAddress?: string; id?: number }) {
  const { data, error, isLoading, refetch } = useQuery(
    ["wallet", params],
    () => fetchWallet(params),
    {
      refetchOnWindowFocus: false,
      enabled: !!params.walletAddress || !!params.id,
    }
  );

  return {
    wallet: data,
    error,
    isLoading,
    refetch,
  };
}
