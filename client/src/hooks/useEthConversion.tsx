import { ethers } from "ethers";
import { useQuery } from "react-query";

const fetchEthPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,pkr"
  );
  const data = await response.json();
  return data.ethereum; // Returns { usd: price, pkr: price }
};

export const useEthConversion = (weiValue: string) => {
  const {
    data: ethPrice,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: fetchEthPrice,
    staleTime: 60000, // 1 min caching
    enabled: weiValue !== "",
  });

  if (!weiValue) {
    return {
      ethValue: "",
      usdValue: null,
      pkrValue: null,
      isLoading,
      error,
    };
  }

  const ethValue = ethers.formatEther(weiValue);

  return {
    ethValue,
    usdValue: ethPrice
      ? (parseFloat(ethValue) * ethPrice.usd).toFixed(2)
      : null,
    pkrValue: ethPrice
      ? (parseFloat(ethValue) * ethPrice.pkr).toFixed(2)
      : null,
    isLoading,
    error,
  };
};
