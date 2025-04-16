import { ethers } from "ethers";
import { useQuery } from "react-query";

const fetchEthPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,pkr"
  );
  const data = await response.json();
  return data.ethereum; // Returns { usd: price, pkr: price }
};

export const useEthConversion = (weiValue?: string, pkrAmount?: number) => {
  const {
    data: ethPrice,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: fetchEthPrice,
    staleTime: 60000, // 1 min caching
  });

  const eth = weiValue ? ethers.formatEther(weiValue) : null;

  console.log(pkrAmount);

  const pkrToEth =
    ethPrice && pkrAmount ? (pkrAmount / ethPrice.pkr).toFixed(6) : null;

  const pkrToWei = pkrToEth ? ethers.parseEther(pkrToEth).toString() : null;

  return {
    eth: eth !== null ? eth.toString() : "",
    usd: ethPrice.usd,
    pkr: ethPrice.pkr,
    pkrToEth,
    pkrToWei,
    isLoading,
    error,
  };
};
