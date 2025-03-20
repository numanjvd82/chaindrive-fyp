import { useEthConversion } from "@/hooks/useEthConversion";

export const EthPriceDisplay: React.FC<{
  wei: string;
  showUsd?: boolean;
  showPkr?: boolean;
}> = ({ wei, showUsd = true, showPkr = false }) => {
  const { ethValue, usdValue, pkrValue, isLoading, error } =
    useEthConversion(wei);

  if (!wei) return <p>No price available</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{ethValue} Error fetching price</p>;

  return (
    <div>
      <p>
        {ethValue} ETH
        {showUsd && usdValue && <span> ≈ ${usdValue}</span>}
        {showPkr && pkrValue && <span> ≈ Rs.{pkrValue}</span>}
      </p>
    </div>
  );
};
