import { axiosInstance } from "@/lib/axios";
import { Message } from "@/lib/types";
import { useQuery } from "react-query";

async function getMessages(conversationId: number | null) {
  if (!conversationId) return;
  try {
    const { data } = await axiosInstance.get<Message[]>(
      `/api/messages/${conversationId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data);
  }
}

export default function useMessages(conversationId: number | null) {
  const {
    data: messages,
    isLoading,
    refetch,
    error,
  } = useQuery<Message[] | undefined>(
    ["messages", conversationId], // Use a dynamic cache key

    () => getMessages(conversationId || null),
    {
      enabled: !!conversationId,
    }
  );

  return { messages, isLoading, refetch, error };
}
