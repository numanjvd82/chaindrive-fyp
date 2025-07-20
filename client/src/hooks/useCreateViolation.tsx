import { useMutation } from "react-query";
import { axiosInstance } from "@/lib/axios";

async function addViolation(violation: FormData) {
  try {
    const { data } = await axiosInstance.post("/api/violations", violation, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message || "An error occurred";
    }
  }
}

export const useCreateViolation = () => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: addViolation,
  });

  return { createViolation: mutateAsync, isLoading };
};
