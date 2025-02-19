import { axiosInstance } from "@/lib/axios";
import { Conversation } from "@/lib/types";
import { useQuery } from "react-query";

async function getConversations() {
  try {
    const { data } = await axiosInstance.get<Conversation[]>(
      "/api/conversations"
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data);
  }
}

export default function useListConversations() {
  const {
    data: conversations,
    isLoading,
    refetch,
    error,
  } = useQuery("conversations", getConversations, {
    staleTime: 1000 * 60 * 1, // 1 minutes
  });

  return { conversations, isLoading, refetch, error };
}
