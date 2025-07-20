import React from "react";
import { usePkrToEth } from "@/hooks/usePkrToEth";

interface PriceDisplayProps {
  value: string;
  valueType: "eth" | "pkr";
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  value,
  valueType,
  className = "text-xl font-bold",
}) => {
  const { data: ethToPkrRate, isLoading } = usePkrToEth();

  const formatValue = () => {
    if (valueType === "eth") {
      // ETH value, convert to PKR
      const pkrValue = ethToPkrRate
        ? (parseFloat(value) * ethToPkrRate).toLocaleString("en-PK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })
        : null;

      return (
        <div className={className}>
          <div>{value} ETH</div>
          {!isLoading && pkrValue && (
            <div className="text-sm font-normal text-gray-600">
              ≈ Rs. {pkrValue}
            </div>
          )}
        </div>
      );
    } else {
      // PKR value, convert to ETH
      const ethValue = ethToPkrRate
        ? (parseFloat(value) / ethToPkrRate).toFixed(6)
        : null;

      return (
        <div className={className}>
          <div>Rs. {parseFloat(value).toLocaleString("en-PK")}</div>
          {!isLoading && ethValue && (
            <div className="text-sm font-normal text-gray-600">
              ≈ {ethValue} ETH
            </div>
          )}
        </div>
      );
    }
  };

  return formatValue();
};
