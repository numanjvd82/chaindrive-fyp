import { motion } from "motion/react";
import {
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import dayjs from "dayjs";
import { Listing, RentalWithImages } from "@/lib/types";

interface VehicleDetailsProps {
  listing: Listing;
  rental: RentalWithImages;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  listing,
  rental,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Vehicle Details</h2>
        <p className="text-blue-100">{listing.title}</p>
      </div>

      <div className="p-6">
        {/* Rental Timeline */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rental Period
          </h3>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-blue-600" />
              <span className="font-medium">Start:</span>
              <span>{dayjs(rental.startDate).format("MMM D, YYYY")}</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-blue-600" />
              <span className="font-medium">End:</span>
              <span>{dayjs(rental.endDate).format("MMM D, YYYY")}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Specifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaMapMarkerAlt className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Location</span>
                <p className="font-medium">{listing.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaGasPump className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Fuel Type</span>
                <p className="font-medium">{listing.fuelType.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCogs className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Transmission</span>
                <p className="font-medium">
                  {listing.transmissionType.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaUsers className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Seats</span>
                <p className="font-medium">{listing.numOfSeats}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
              <FaIdCard className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">License Plate</span>
                <p className="font-medium">{listing.licensePlate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
              <FaDollarSign className="text-green-600" />
              <div>
                <span className="text-sm text-gray-500">Price per Day</span>
                <p className="font-medium text-green-600">
                  {listing.pricePerDay} PKR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
