import { motion } from "motion/react";
import { FaExclamationTriangle, FaCamera } from "react-icons/fa";
import dayjs from "dayjs";
import { Violation } from "@/lib/types";

interface ViolationReportsProps {
  violation: Violation | undefined;
}

export const ViolationReports: React.FC<ViolationReportsProps> = ({
  violation,
}) => {
  if (!violation) return null;

  console.log(violation.photos);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <FaExclamationTriangle className="text-red-600" />
        Violation Reports (1)
      </h2>
      <div className="space-y-4">
        <div className="border border-red-200 rounded-xl p-4 bg-red-50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {violation.violationType.replace("_", " ").toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {violation.status.toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {dayjs(violation.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{violation.detailedQuery}</p>
          {violation.expectedDamage && (
            <p className="text-sm text-red-600">
              <strong>Expected Damage:</strong> {violation.expectedDamage}
            </p>
          )}
          {violation.photos && violation.photos.length > 0 && (
            <>
              <p className="text-sm text-gray-600 mt-2">
                <FaCamera className="inline-block mr-1" />
                {violation.photos.length} photo(s) attached
              </p>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {violation.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`data:image/png;base64,${photo}`}
                    alt={`Violation photo ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
