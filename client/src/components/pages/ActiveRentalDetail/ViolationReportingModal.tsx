import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/Button";
import { FaExclamationTriangle, FaTimes, FaFileUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { ViolationType, violationTypes } from "@/lib/violationTypes";

interface ViolationReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: string;
  onReportSubmitted: () => void;
}

export const ViolationReportingModal: React.FC<
  ViolationReportingModalProps
> = ({ isOpen, onClose, rentalId, onReportSubmitted }) => {
  const [selectedViolationType, setSelectedViolationType] =
    useState<ViolationType>(ViolationType.DAMAGE);
  const [violationDetails, setViolationDetails] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signer } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signer) {
      toast.error("Please connect your wallet to report violations.");
      return;
    }

    if (!violationDetails.trim()) {
      toast.error("Please provide violation details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const contract = getContractInstance(signer);

      const tx = await contract.reportViolation(
        rentalId,
        selectedViolationType,
        violationDetails
      );

      toast.loading("Submitting violation report to blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        toast.error("Failed to submit violation report to blockchain.");
        return;
      }

      toast.dismiss();
      toast.success(`Violation report submitted successfully!
        Transaction Hash: ${tx.hash}
        View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}
      `);

      // Reset form
      setViolationDetails("");
      setEvidenceFiles(null);
      setSelectedViolationType(ViolationType.DAMAGE);

      onReportSubmitted();
      onClose();
    } catch (error: unknown) {
      console.error("Error reporting violation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit violation report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceFiles(e.target.files);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Report Violation
                </h3>
                <p className="text-sm text-gray-600">Rental ID: {rentalId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Violation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Violation Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {violationTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedViolationType === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedViolationType(type.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${type.color}`} />
                      <span className="font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                    {selectedViolationType === type.value && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Violation Details */}
            <div>
              <label
                htmlFor="violationDetails"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Violation Details
              </label>
              <textarea
                id="violationDetails"
                value={violationDetails}
                onChange={(e) => setViolationDetails(e.target.value)}
                placeholder="Describe the violation in detail..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="evidence-upload"
                />
                <label htmlFor="evidence-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <FaFileUpload className="text-gray-400 text-2xl" />
                    <p className="text-sm text-gray-600">
                      Click to upload photos or documents
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </div>
                </label>
              </div>
              {evidenceFiles && evidenceFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {evidenceFiles.length} file(s) selected
                  </p>
                </div>
              )}
            </div>

            {/* Terms Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-lg flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      This report will be recorded on the blockchain and cannot
                      be modified
                    </li>
                    <li>
                      False reporting may result in penalties under the rental
                      terms
                    </li>
                    <li>
                      The renter will be notified of this violation report
                    </li>
                    <li>
                      Penalty amounts will be automatically calculated and
                      deducted from security deposit
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViolationReportingModal;
