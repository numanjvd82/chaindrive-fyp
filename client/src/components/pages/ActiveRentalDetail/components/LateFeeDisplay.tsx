import { motion } from "motion/react";
import { FaExclamationTriangle, FaClock, FaEthereum } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useLateFee } from "@/hooks/useLateFee";
import { RentalWithImages } from "@/lib/types";
import Loader from "@/components/Loader";

interface LateFeeDisplayProps {
  rental: RentalWithImages;
}

export const LateFeeDisplay: React.FC<LateFeeDisplayProps> = ({ rental }) => {
  const { hoursLate, lateFeeInEth, lateFeeInPkr, isLate, isLoading, error } =
    useLateFee(rental);

  console.log(hoursLate, isLate);

  // Don't show anything if not late
  if (!isLate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
            <FaClock className="text-red-600" />
            Late Return Fee
          </h2>

          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader variant="spinner" size="sm" />
              <span className="text-red-700">Calculating late fee...</span>
            </div>
          ) : error ? (
            <div className="text-red-700">
              <p className="font-medium">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Hours Late */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-red-600 w-5 h-5" />
                    <div>
                      <span className="text-sm text-gray-600">
                        Time Overdue
                      </span>
                      <p className="font-bold text-red-800 text-lg">
                        {hoursLate} hour{hoursLate !== 1 ? "s" : ""} late
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ETH Amount */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaEthereum className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Late Fee (ETH)
                      </span>
                      <p className="font-bold text-gray-900 text-lg">
                        {parseFloat(lateFeeInEth).toFixed(6)} ETH
                      </p>
                    </div>
                  </div>
                </div>

                {/* PKR Amount */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <RiMoneyDollarCircleFill className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Late Fee (PKR)
                      </span>
                      <p className="font-bold text-gray-900 text-lg">
                        ₨{" "}
                        {lateFeeInPkr.toLocaleString("en-PK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-100 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Important Notice:</p>
                    <p>
                      Late fees accumulate at 0.001 ETH per hour. Please
                      complete your rental as soon as possible to avoid
                      additional charges. The maximum late fee is capped at 3x
                      the original rental fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
