import Button from "@/components/Button";
import useAuthUser from "@/hooks/useAuthUser";
import { useWallet } from "@/hooks/useWallet";
import { AvailableRental } from "@/lib/types";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const { account, provider, signer, connectWallet } = useWallet();
  const location = useLocation();
  const { rental, bookingData } = location.state as LocationState;
  const { user } = useAuthUser();
  const [grandTotalInEth, setGrandTotalInEth] = useState<number | undefined>();

  const securityDeposit = rental.pricePerDay * bookingData.totalDays * 0.4;
  const platformFee = bookingData.totalPrice * 0.2;
  const grandTotal = bookingData.totalPrice + securityDeposit + platformFee;

  const startDate = dayjs(bookingData.startDate).format("DD MMM YYYY HH:mm");
  const endDate = dayjs(bookingData.endDate).format("DD MMM YYYY HH:mm");

  useEffect(() => {
    const fetchPkrToEth = async (grandTotal: number) => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=pkr"
      );
      const data = await response.json();
      const pkrToEth = data.ethereum.pkr;
      const totalPriceInPkr = (grandTotal / pkrToEth).toFixed(6);
      setGrandTotalInEth(Number(totalPriceInPkr));
    };
    fetchPkrToEth(grandTotal);
  }, [grandTotal]);

  if (!rental || !bookingData || !user) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          An error occurred while fetching data.
        </p>
      </div>
    );
  }

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
              <span>ETH {grandTotalInEth}</span>
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

        <Button className="w-full py-3  font-bold rounded-lg">
          Confirm Payment
        </Button>
      </div>
    </div>
  );
};

export default RentalConfirmation;
