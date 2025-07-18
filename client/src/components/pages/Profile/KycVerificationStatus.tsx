import React from "react";
import { motion } from "motion/react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaIdCard,
} from "react-icons/fa";

type Props = {
  profileVerified: boolean;
};

const KycVerificationStatus: React.FC<Props> = ({ profileVerified }) => {
  const kycVerified = true;
  const kycFailReason = "ID Card is not clear";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl text-white">
          <FaIdCard className="text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Verification Status
          </h2>
          <p className="text-gray-600">Your account verification progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KYC Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl border-2 ${
            kycVerified
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            {kycVerified ? (
              <FaCheckCircle className="text-green-600 text-xl" />
            ) : (
              <FaTimesCircle className="text-red-600 text-xl" />
            )}
            <h3 className="font-semibold text-gray-800">KYC Verification</h3>
          </div>
          <p
            className={`text-sm font-medium flex items-center space-x-1 ${
              kycVerified ? "text-green-700" : "text-red-700"
            }`}
          >
            {kycVerified ? (
              <>
                <FaCheckCircle className="text-xs" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-xs" />
                <span>Not Verified</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Know Your Customer verification
          </p>
        </motion.div>

        {/* Profile Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl border-2 ${
            profileVerified
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            {profileVerified ? (
              <FaCheckCircle className="text-green-600 text-xl" />
            ) : (
              <FaTimesCircle className="text-red-600 text-xl" />
            )}
            <h3 className="font-semibold text-gray-800">
              Profile Verification
            </h3>
          </div>
          <p
            className={`text-sm font-medium flex items-center space-x-1 ${
              profileVerified ? "text-green-700" : "text-red-700"
            }`}
          >
            {profileVerified ? (
              <>
                <FaCheckCircle className="text-xs" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-xs" />
                <span>Not Verified</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Identity document verification
          </p>
        </motion.div>
      </div>

      {!kycVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-start space-x-3">
            <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Verification Failed</p>
              <p>
                <strong>Reason:</strong> {kycFailReason}
              </p>
              <p className="mt-2 text-xs">
                Please update your documents and try again.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KycVerificationStatus;
