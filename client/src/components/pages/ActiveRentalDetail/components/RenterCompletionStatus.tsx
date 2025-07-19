import { motion } from "motion/react";
import { FaCheckCircle } from "react-icons/fa";
import { RentalWithImages } from "@/lib/types";

interface RenterCompletionStatusProps {
  rental: RentalWithImages;
}

export const RenterCompletionStatus: React.FC<RenterCompletionStatusProps> = ({
  rental,
}) => {
  const renderCompletionStatus = () => {
    if (rental.completedByOwner && rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-green-600 font-medium">
          <FaCheckCircle /> Rental completed by both you and owner
        </p>
      );
    }
    if (rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental is completed by you
        </p>
      );
    }
    if (rental.completedByOwner) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental completed by owner
        </p>
      );
    }
    return null;
  };

  const completionStatus = renderCompletionStatus();

  if (!completionStatus) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      {completionStatus}
    </motion.div>
  );
};
