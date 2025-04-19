import { useQuery } from "react-query";
import { toast } from "react-toastify";

const fetchPkrToEth = async (): Promise<number> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch PKR to ETH conversion rate");
  }

  const data = await response.json();
  return data.ethereum.pkr;
};

export const usePkrToEth = () => {
  return useQuery<number, Error>("pkrToEth", fetchPkrToEth, {
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    onError: (error) => {
      console.error("Error fetching PKR to ETH conversion rate:", error);
      toast.error(
        "Failed to fetch the conversion rate. Please try again later."
      );
    },
  });
};
