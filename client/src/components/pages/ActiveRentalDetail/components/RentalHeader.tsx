import { motion } from "motion/react";
import { FaCheckCircle, FaClock, FaTimes, FaCircle } from "react-icons/fa";

interface RentalHeaderProps {
  status: string;
}

export const RentalHeader: React.FC<RentalHeaderProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case "completed":
        return <FaCheckCircle className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <FaClock className="w-4 h-4 text-yellow-600" />;
      case "cancelled":
        return <FaTimes className="w-4 h-4 text-red-600" />;
      default:
        return <FaCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Rental Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage your vehicle rental request
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                status
              )}`}
            >
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
