import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function editListing(listing: FormData) {
  try {
    const id = listing.get("id") as string;
    if (!id) {
      throw new Error("Listing ID is required");
    }
    const { data } = await axiosInstance.patch(`/api/listings/${id}`, listing, {
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

export const useEditListing = () => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: editListing,
  });

  return { editListing: mutateAsync, isLoading };
};
