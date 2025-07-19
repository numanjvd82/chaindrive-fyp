import Button from "@/components/Button";
import TermsAndConditions from "@/components/TermsAndConditions";
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
import { motion } from "motion/react";
import {
  FaCreditCard,
  FaEthereum,
  FaWallet,
  FaShieldAlt,
  FaCalendarAlt,
  FaCar,
  FaCheckCircle,
} from "react-icons/fa";
import Loader from "@/components/Loader";

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
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <Loader size="lg" variant="spinner" />
          <p className="text-gray-600 mt-4 text-lg">
            Loading conversion rate...
          </p>
        </motion.div>
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

  const handleInitiateRental = () => {
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

    // Show terms and conditions modal
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    handleCreateRental();
  };

  const handleDeclineTerms = () => {
    setShowTermsModal(false);
  };

  const handleCreateRental = async () => {
    try {
      toast.loading("Creating rental...");
      // Now create rental in DB
      const rentalData = {
        listingId: rental.id,
        renterAddress: account as string,
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

      const rentalContract = getContractInstance(signer!);

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
        `,
        {
          onClose: () => navigate(`/rental-successful/${createdRental.id}`),
        }
      );
    } catch (err: unknown) {
      console.error("Error creating rental:", err);
      toast.dismiss(); // Clear loading if shown
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Rental creation failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="basis-[550px] mx-auto p-6 bg-white rounded-2xl shadow-lg my-5"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-6 -mx-6 -mt-6">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <FaCar className="w-6 h-6" />
            Pay & Get Your Ride!!
          </h1>
          <p className="text-blue-100 text-center mt-1">
            Complete your rental booking
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-5 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Booking Summary
          </h2>

          <div className="space-y-3 mb-4 text-gray-700">
            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium">Start Date</span>
              <span className="font-semibold">{startDate}</span>
            </div>

            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium">End Date</span>
              <span className="font-semibold">{endDate}</span>
            </div>

            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium flex items-center gap-2">
                <FaCar className="text-green-600" />
                Rental Fee
              </span>
              <div className="text-right">
                <div className="font-semibold">
                  PKR {bookingData.totalPrice}
                </div>
                <div className="text-sm text-gray-500">
                  {bookingData.totalDays} days × PKR {rental.pricePerDay}/day
                </div>
              </div>
            </div>

            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium flex items-center gap-2">
                <FaShieldAlt className="text-orange-600" />
                Security Deposit
              </span>
              <div className="text-right">
                <div className="font-semibold">PKR {securityDeposit}</div>
                <div className="text-sm text-gray-500">40% of rental fee</div>
              </div>
            </div>

            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium flex items-center gap-2">
                <FaCreditCard className="text-red-600" />
                Platform Fee
              </span>
              <div className="text-right">
                <div className="font-semibold">PKR {platformFee}</div>
                <div className="text-sm text-gray-500">20% service fee</div>
              </div>
            </div>

            <div className="flex justify-between p-3 bg-white rounded-lg shadow-sm">
              <span className="font-medium flex items-center gap-2">
                <FaEthereum className="text-indigo-600" />
                Total in ETH
              </span>
              <span className="font-semibold">
                {ethInPkr ? (grandTotal / ethInPkr).toFixed(6) : "..."} ETH
              </span>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4 pt-4">
            <div className="flex justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-xl font-bold">PKR {grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaWallet className="text-purple-600" />
            Payment Method
          </h2>

          <div className="space-y-4">
            {!account || !provider || !signer ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg"
                  onClick={connectWallet}
                >
                  <div className="flex items-center justify-center gap-3">
                    <FaWallet className="text-xl" />
                    Connect Wallet
                  </div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative p-4 border-2 border-blue-500 bg-blue-50 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-blue-500 flex items-center justify-center">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FaEthereum className="text-indigo-600" />
                      <span className="font-semibold text-gray-900">
                        Ethereum Wallet
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                        Connected
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {account?.slice(0, 8) +
                        "..." +
                        account?.slice(account.length - 6)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          disabled={
            isOwnerWalletLoading ||
            isCreateRentalLoading ||
            !account ||
            !provider ||
            !signer
          }
          isLoading={isCreateRentalLoading}
          onClick={handleInitiateRental}
          className="w-full py-4 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-3">
            <FaCheckCircle />
            {!account || !provider || !signer
              ? "Connect Wallet to Continue"
              : "Confirm Payment & Book Now"}
          </div>
        </Button>
      </motion.div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <TermsAndConditions
          onAccept={handleAcceptTerms}
          onDecline={handleDeclineTerms}
          rentalFee={bookingData.totalPrice.toString()}
          securityDeposit={securityDeposit.toString()}
        />
      )}
    </div>
  );
};

export default RentalConfirmation;
