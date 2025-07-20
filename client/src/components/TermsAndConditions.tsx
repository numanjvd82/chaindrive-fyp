import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FiCheck,
  FiAlertTriangle,
  FiClock,
  FiShield,
  FiDollarSign,
  FiLoader,
} from "react-icons/fi";
import { useContractTerms } from "@/hooks/useContractTerms";
import { usePkrToEth } from "@/hooks/usePkrToEth";
import { PriceDisplay } from "@/components/PriceDisplay";

interface TermsAndConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
  rentalFee: string;
  securityDeposit: string;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onAccept,
  onDecline,
  rentalFee,
  securityDeposit,
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const {
    data: contractTerms,
    isLoading: isTermsLoading,
    error: termsError,
  } = useContractTerms();

  const handleAccept = () => {
    if (isAccepted) {
      onAccept();
    }
  };

  // Use contract data or fallback values
  const lateFeePerHour = contractTerms?.termsConfig.lateFeePerHour || "0.001";
  const maxLateFeeMultiplier =
    contractTerms?.termsConfig.maxLateFeeMultiplier || 3;
  const damageAssessmentPeriod =
    contractTerms?.termsConfig.damageAssessmentPeriod || 48;
  const violationPenaltyRate =
    contractTerms?.termsConfig.violationPenaltyRate || 50;

  // Calculate max late fee in ETH based on PKR rental fee
  const { data: ethToPkrRate } = usePkrToEth();
  const rentalFeeInEth = ethToPkrRate
    ? (parseFloat(rentalFee) / ethToPkrRate).toFixed(6)
    : "0";
  const maxLateFee = (
    parseFloat(rentalFeeInEth) * maxLateFeeMultiplier
  ).toFixed(4);

  // Show loading state
  if (isTermsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="flex items-center justify-center gap-3">
            <FiLoader className="animate-spin text-blue-600 text-xl" />
            <span className="text-gray-700">Loading Terms & Conditions...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (termsError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <FiAlertTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Unable to Load Terms
            </h3>
            <p className="text-gray-600 mb-4">
              Please ensure your wallet is connected and try again.
            </p>
            <button
              onClick={onDecline}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!contractTerms || !contractTerms.termsAndConditions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md">
          <div className="text-center">
            <FiAlertTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Terms Not Available
            </h3>
            <p className="text-gray-600 mb-4">
              The rental terms are currently unavailable. Please try again
              later.
            </p>
            <button
              onClick={onDecline}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  console.log(damageAssessmentPeriod);

  const parsedTerms = (
    (contractTerms.termsAndConditions || "").match(
      /\d+\.\s[^]+?(?=\d+\.|$)/g
    ) || []
  )
    .map((item) => {
      // Extract number, title, and description
      const match = item.match(/(\d+)\.\s([A-Z ]+):\s(.+)/);
      if (!match) return null;
      const [, number, title, description] = match;
      return { number, title, description };
    })
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FiShield className="text-3xl" />
            ChainDrive Rental Terms & Conditions
          </h2>
          <p className="mt-2 opacity-90">
            Please read and accept the following terms before proceeding with
            your rental
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Financial Terms */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-blue-600" />
              Financial Terms for This Rental
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Rental Fee</p>
                <PriceDisplay
                  value={rentalFee}
                  valueType="pkr"
                  className="text-xl font-bold text-blue-600"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600">Security Deposit</p>
                <PriceDisplay
                  value={securityDeposit}
                  valueType="pkr"
                  className="text-xl font-bold text-blue-600"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-gray-600">Late Fee (per hour)</p>
                <PriceDisplay
                  value={lateFeePerHour}
                  valueType="eth"
                  className="text-xl font-bold text-orange-600"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600">Maximum Late Fee</p>
                <PriceDisplay
                  value={maxLateFee}
                  valueType="eth"
                  className="text-xl font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Smart Contract Terms */}
          {parsedTerms !== null && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                <FiShield className="text-indigo-600" />
                Smart Contract Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {parsedTerms.map((term) => {
                  if (!term) return null;
                  return (
                    <div key={term.number} className="mb-4">
                      <h4 className="font-semibold text-indigo-800 mb-1">
                        {term.number}. {term.title}
                      </h4>
                      <p className="text-gray-700">{term.description}</p>
                    </div>
                  );
                })}
              </p>
              <div className="mt-4 text-sm text-indigo-600 bg-indigo-100 rounded-lg p-3">
                <FiCheck className="inline mr-2" />
                These terms are enforced automatically by blockchain smart
                contract
              </div>
            </div>
          )}

          {/* Terms Sections */}
          <div className="space-y-4">
            {/* Late Return Policy */}
            <div className="border border-orange-200 rounded-xl p-6 bg-orange-50">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <FiClock className="text-xl" />
                1. Late Return Policy
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  Late fees apply for every hour past the agreed return time
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  Late fee rate: <strong>{lateFeePerHour} ETH per hour</strong>
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  Maximum late fee is capped at{" "}
                  <strong>
                    {maxLateFeeMultiplier}x the rental fee (see financial terms
                    above)
                  </strong>
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-orange-500 mt-1 flex-shrink-0" />
                  Late fees are automatically calculated and deducted from your
                  security deposit
                </li>
              </ul>
            </div>

            {/* Damage Responsibility */}
            <div className="border border-red-200 rounded-xl p-6 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <FiShield className="text-xl" />
                2. Damage Responsibility
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  You are fully responsible for any damage to the vehicle during
                  the rental period
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  Damage costs will be deducted from your security deposit
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  Car owners have {Math.floor(damageAssessmentPeriod / 3600)}{" "}
                  hours after rental completion to report damages
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  If damage costs exceed the security deposit, you remain liable
                  for the difference
                </li>
              </ul>
            </div>

            {/* Legal Responsibilities */}
            <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <FiAlertTriangle className="text-xl" />
                3. Legal Responsibilities
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-purple-500 mt-1 flex-shrink-0" />
                  Any criminal or illegal activity using the rented vehicle
                  makes you fully liable
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-purple-500 mt-1 flex-shrink-0" />
                  Violations include but are not limited to: reckless driving,
                  DUI, drug-related activities
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-purple-500 mt-1 flex-shrink-0" />
                  Legal violations result in {violationPenaltyRate}% security
                  deposit penalty plus any additional costs
                </li>
                <li className="flex items-start gap-2">
                  <FiAlertTriangle className="text-purple-500 mt-1 flex-shrink-0" />
                  You must report any accidents or legal incidents immediately
                </li>
              </ul>
            </div>

            {/* Additional Terms */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiCheck className="text-xl" />
                4. Additional Terms
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                  Security deposit is held in smart contract and released
                  automatically upon successful completion
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                  All terms are enforced by blockchain smart contract for
                  transparency
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                  ChainDrive platform mediates disputes based on provided
                  evidence
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                  All payments and penalties are processed automatically through
                  the smart contract
                </li>
              </ul>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <div className="border-t pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">
                I have read, understood, and agree to all the terms and
                conditions stated above. I understand that these terms are
                enforced by smart contract and acceptance is legally binding.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDecline}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Decline
            </motion.button>
            <motion.button
              whileHover={{ scale: isAccepted ? 1.02 : 1 }}
              whileTap={{ scale: isAccepted ? 0.98 : 1 }}
              onClick={handleAccept}
              disabled={!isAccepted}
              className={`flex-1 py-3 px-6 rounded-xl transition-colors ${
                isAccepted
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Accept & Continue
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsAndConditions;
