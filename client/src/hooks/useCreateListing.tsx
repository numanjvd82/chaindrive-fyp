import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function addListing(listing: FormData) {
  try {
    const { data } = await axiosInstance.post("/api/listings", listing, {
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

export const useCreateListing = () => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: addListing,
  });

  return { createListing: mutateAsync, isLoading };
};
