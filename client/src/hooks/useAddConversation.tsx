import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

interface AddConversationInput {
  user1: number;
  user2: number;
}

async function addConversation(input: AddConversationInput) {
  try {
    const { data } = await axiosInstance.post<number>(
      "/api/conversations",
      input
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data.message || "Failed to add conversation"
    );
  }
}

export default function useAddConversation() {
  const { mutateAsync, isLoading, error } = useMutation(addConversation);

  return {
    addConversation: mutateAsync,
    isLoading,
    error,
  };
}
