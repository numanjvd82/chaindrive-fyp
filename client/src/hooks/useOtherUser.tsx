import { axiosInstance } from "@/lib/axios";
import { User } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchOtherUser(id: number) {
  try {
    const { data } = await axiosInstance.get<User>(`/api/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching User:", error);
    throw error;
  }
}

export function useOtherUser(id: number) {
  const { data, error, isLoading, refetch } = useQuery(
    ["otherUser", id],
    () => fetchOtherUser(id),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  return {
    user: data,
    error,
    isLoading,
    refetch,
  };
}
