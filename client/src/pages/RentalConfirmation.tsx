import Button from "@/components/Button";
import useAuthUser from "@/hooks/useAuthUser";
import { useCreateRental } from "@/hooks/useCreateRental";
import { useListWallet } from "@/hooks/useListWallet";
import { usePkrToEth } from "@/hooks/usePkrToEth";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { AvailableRental } from "@/lib/types";
import dayjs from "dayjs";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type LocationState = {
  rental: AvailableRental;
  bookingData: {
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    totalDays: number;
  };
};

const RentalConfirmation: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<
    "easypaisa" | "ethereum"
  >("ethereum");

  const navigate = useNavigate();

  const { user } = useAuthUser();
  const { account, provider, signer, connectWallet } = useWallet();
  const location = useLocation();

  const { rental, bookingData } = location.state as LocationState;
  const { wallet: ownerWallet, isLoading: isOwnerWalletLoading } =
    useListWallet({
      id: rental?.ownerId,
    });
  const { createRental, isCreateRentalLoading } = useCreateRental();
  const { data: ethInPkr, isLoading: isEthInPkrLoading } = usePkrToEth();

  if (isEthInPkrLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading conversion rate...</p>
      </div>
    );
  }

  if (!rental || !bookingData || !user) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          An error occurred while fetching data.
        </p>
      </div>
    );
  }

  if (!ownerWallet) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          An error occurred while fetching the owner's wallet address.
        </p>
      </div>
    );
  }

  if (!ethInPkr) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          An error occurred while fetching the PKR to ETH conversion rate.
        </p>
      </div>
    );
  }

  const securityDeposit = rental.pricePerDay * bookingData.totalDays * 0.4;
  const platformFee = bookingData.totalPrice * 0.2;
  const grandTotal = bookingData.totalPrice + securityDeposit + platformFee;
  const startDate = dayjs(bookingData.startDate).format("DD MMM YYYY HH:mm");
  const endDate = dayjs(bookingData.endDate).format("DD MMM YYYY HH:mm");

  const handleCreateRental = async () => {
    if (selectedPayment === "easypaisa") {
      toast.info("Easypaisa payment method is currently not supported.");
      return;
    }

    if (!account || !provider || !signer) {
      toast.error("Please connect your wallet to proceed.");
      return;
    }

    if (!ownerWallet) {
      toast.error("Unable to retrieve the owner's wallet address.");
      return;
    }

    if (!ethInPkr) {
      toast.error("Failed to calculate total ETH. Please try again.");
      return;
    }

    try {
      toast.loading("Creating rental...");
      // Now create rental in DB
      const rentalData = {
        listingId: rental.id,
        renterAddress: account,
        ownerAddress: ownerWallet.walletAddress,
        startDate: bookingData.startDate.toISOString(),
        endDate: bookingData.endDate.toISOString(),
        rentalFee: bookingData.totalPrice,
        securityDeposit,
        platformFee,
        totalEth: (grandTotal / ethInPkr).toFixed(6),
        ownerConfirmed: false,
        isCompleted: false,
        renterId: user.id,
        status: "pending",
      };

      const createdRental = await createRental(rentalData);
      if (!createdRental) {
        toast.dismiss();
        throw new Error("Failed to create rental.");
      }

      toast.dismiss();
      toast.loading("Creating rental on blockchain...");

      const rentalContract = getContractInstance(signer);

      const rentalFeeEth = bookingData.totalPrice / ethInPkr;
      const securityDepositEth = securityDeposit / ethInPkr;
      const platformFeeEth = platformFee / ethInPkr;

      const rentalFeeWei = ethers.parseUnits(rentalFeeEth.toFixed(18), "ether");
      const securityDepositWei = ethers.parseUnits(
        securityDepositEth.toFixed(18),
        "ether"
      );
      const platformFeeWei = ethers.parseUnits(
        platformFeeEth.toFixed(18),
        "ether"
      );

      const totalAmountInWei =
        rentalFeeWei + securityDepositWei + platformFeeWei;

      const tx = await rentalContract.initiateRental(
        createdRental.id,
        ownerWallet.walletAddress,
        rentalFeeWei,
        securityDepositWei,
        platformFeeWei,
        {
          value: totalAmountInWei,
        }
      );

      toast.dismiss();
      toast.loading("Transaction sent. Waiting for confirmation...");

      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        toast.dismiss();
        toast.error("Transaction failed or was reverted.");
        return;
      }

      const rentalCreatedEvent = receipt.logs
        .map((log) => rentalContract.interface.parseLog(log))
        .find((event) => event?.name === "RentalInitiated");

      if (!rentalCreatedEvent) {
        toast.dismiss();
        toast.error("Rental creation failed. Please try again.");
        return;
      }

      toast.dismiss();
      toast.success(
        `Rental created successfully!
        \nTransaction Hash: ${receipt.hash}
        \nRental ID: ${createdRental.id}
        \nRental Fee: ${rentalFeeEth} ETH
        \nSecurity Deposit: ${securityDepositEth} ETH
        \nPlatform Fee: ${platformFeeEth} ETH
        `,
        {
          onClose: () => navigate(`/rental-successful/${createdRental.id}`),
        }
      );
    } catch (err: any) {
      console.error("Error creating rental:", err);
      toast.dismiss(); // Clear loading if shown
      toast.error(
        err.response?.data.message ||
          "Rental creation failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center  min-h-screen bg-gray-100">
      <div className="basis-[550px] mx-auto p-6 bg-white rounded-lg shadow-md my-5">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
          Pay & Get Your Ride!!
        </h1>

        <div className="border rounded-lg p-5 bg-gray-50 mb-8">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

          <div className="space-y-3 mb-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Start Date</span>
              <span>{startDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">End Date</span>
              <span>{endDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Rental Fee</span>
              <span>
                {bookingData.totalDays} days x PKR {rental.pricePerDay}/day ={" "}
                {bookingData.totalPrice}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Security Deposit</span>
              <span>PKR {securityDeposit} (40% of rental)</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Platform Fee</span>
              <span>PKR {platformFee}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Grand Total in ETH</span>
              <span>
                ETH {ethInPkr ? (grandTotal / ethInPkr).toFixed(6) : "..."}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">PKR {grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your payment method</h2>

          <div className="space-y-4">
            <div
              className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                selectedPayment === "easypaisa"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPayment("easypaisa")}
            >
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600"
                checked={selectedPayment === "easypaisa"}
                onChange={() => setSelectedPayment("easypaisa")}
              />
              <label className="ml-3 flex-1">
                <span className="block font-medium">Easypaisa wallet</span>
                <span className="block text-gray-500">
                  {user.phone.slice(0, 2) +
                    "..." +
                    user.phone.slice(user.phone.length - 3)}
                </span>
              </label>
            </div>

            <div className="flex items-center justify-center my-2">
              <span className="px-2 text-gray-500">OR</span>
            </div>

            <div className="border-b border-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="px-2 bg-white text-gray-500">[_____]</div>
              </div>
            </div>

            <div className="my-8">
              {!account || !provider || !signer ? (
                <Button
                  className="w-full py-3 text-lg font-semibold"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              ) : (
                <div
                  className={`flex items-center p-3 border rounded-lg cursor-pointer  ${
                    selectedPayment === "ethereum"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedPayment("ethereum")}
                >
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-blue-600"
                    checked={selectedPayment === "ethereum"}
                    onChange={() => setSelectedPayment("ethereum")}
                  />
                  <label className="ml-3 flex-1">
                    <span className="block font-medium">Ethereum</span>
                    <span className="block text-gray-500">
                      {account?.slice(0, 5) +
                        "..." +
                        account?.slice(account.length - 4)}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          disabled={isOwnerWalletLoading || isCreateRentalLoading}
          onClick={handleCreateRental}
          className="w-full py-3  font-bold rounded-lg"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default RentalConfirmation;
