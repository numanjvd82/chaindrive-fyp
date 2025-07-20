import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { usePkrToEth } from "@/hooks/usePkrToEth";
import { RentalWithImages } from "@/lib/types";
import dayjs from "dayjs";
import { ethers } from "ethers";

interface LateFeeData {
  hoursLate: number;
  lateFeeInEth: string;
  lateFeeInPkr: number;
  isLate: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useLateFee = (rental: RentalWithImages): LateFeeData => {
  const [lateFeeData, setLateFeeData] = useState<LateFeeData>({
    hoursLate: 0,
    lateFeeInEth: "0",
    lateFeeInPkr: 0,
    isLate: false,
    isLoading: false,
    error: null,
  });

  const { signer } = useWallet();
  const { data: ethToPkrRate, isLoading: isRateLoading } = usePkrToEth();

  useEffect(() => {
    const calculateLateFee = async () => {
      try {
        const currentTime = dayjs();
        const endTime = dayjs(rental.endDate);
        // const endTimeWithBuffer = endTime.add(1, "hour");

        // Check if rental is late
        if (!currentTime.isAfter(endTime) || rental.status === "completed") {
          setLateFeeData((prev) => ({
            ...prev,
            isLate: false,
            hoursLate: 0,
            lateFeeInEth: "0",
            lateFeeInPkr: 0,
            isLoading: false,
          }));
          return;
        }

        const hoursLate = Math.ceil(currentTime.diff(endTime, "hour", true));

        if (!signer || !ethToPkrRate) {
          setLateFeeData((prev) => ({
            ...prev,
            hoursLate,
            isLate: true,
            isLoading: isRateLoading,
          }));
          return;
        }

        setLateFeeData((prev) => ({ ...prev, isLoading: true, error: null }));

        // Call the contract function to get late fee
        const contract = getContractInstance(signer);
        const lateFeeWei = await contract.calculateLateFee(
          rental.id,
          hoursLate
        );

        // Convert wei to ether
        const lateFeeInEth = ethers.formatEther(lateFeeWei);

        // Convert to PKR
        const lateFeeInPkr = parseFloat(lateFeeInEth) * ethToPkrRate;

        setLateFeeData({
          hoursLate,
          lateFeeInEth,
          lateFeeInPkr,
          isLate: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error calculating late fee:", error);
        setLateFeeData((prev) => ({
          ...prev,
          error: "Failed to calculate late fee",
          isLoading: false,
        }));
      }
    };

    calculateLateFee();

    // Update every minute to keep the hours late current
    const interval = setInterval(calculateLateFee, 60000);

    return () => clearInterval(interval);
  }, [rental, signer, ethToPkrRate, isRateLoading]);

  return lateFeeData;
};
