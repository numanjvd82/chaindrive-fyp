import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function deleteListing(id: number) {
  try {
    const { data } = await axiosInstance.delete<boolean>(`/api/listings/${id}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message || "An error occurred";
    }
  }
}

export const useDeleteListing = () => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: deleteListing,
  });

  return { deleteListing: mutateAsync, isLoading };
};
