import { motion } from "motion/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Map from "@/components/Map";
import { useLatestLocation } from "@/hooks/useLatestLocation";

interface VehicleLocationProps {
  rentalStatus: string;
  expectedDeviceId: string;
}

export const VehicleLocation: React.FC<VehicleLocationProps> = ({
  rentalStatus,
  expectedDeviceId,
}) => {
  const { latestLocation, isLocationLoading } = useLatestLocation(
    expectedDeviceId || ""
  );

  if (rentalStatus !== "active") return null;

  const renderMap = () => {
    if (isLocationLoading) {
      return <p className="text-gray-500">Loading location...</p>;
    }

    if (!latestLocation) {
      return <p className="text-gray-500">No location data available.</p>;
    }

    return (
      <Map
        latitude={latestLocation.latitude}
        longitude={latestLocation.longitude}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <FaMapMarkerAlt className="text-blue-600" />
        Vehicle Location
      </h2>
      <div className="bg-gray-50 rounded-xl p-4">{renderMap()}</div>
    </motion.div>
  );
};
