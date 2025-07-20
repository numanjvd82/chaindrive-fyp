import { useState } from "react";
import Button from "../../../Button";
import KycModal from "./KycModal";

const KycVerification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleConfirm = async () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">KYC Verification</h2>
          <p className="text-gray-600 text-sm">
            Complete identity verification
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Upload ID card (front & back) and selfie for verification
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure & encrypted
            </div>
          </div>
          <Button
            onClick={openModal}
            variant="primary"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:scale-105 transition-transform text-sm"
          >
            Start KYC
          </Button>
        </div>
      </div>
      <KycModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        openModal={openModal}
        closeModal={closeModal}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default KycVerification;
