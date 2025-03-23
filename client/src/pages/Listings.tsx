import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { useListings } from "@/hooks/useListings";
import { Listing } from "@/lib/types";
import { motion } from "framer-motion";
import React from "react";
import {
  FaCar,
  FaCogs,
  FaEdit,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";

const CarCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const {
    title,
    year,
    fuelType,
    numOfSeats,
    images,
    licensePlate,
    model,
    transmissionType,
    location,
  } = listing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white shadow-lg rounded-xl  p-5 flex items-center gap-6 justify-between border border-gray-200"
    >
      <div className="flex-1">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaCar className="text-gray-400" /> Listed
        </p>
        <h2 className="text-xl font-semibold">
          {title} {year}
        </h2>
        <p className="text-md text-gray-600">
          {model} - {numOfSeats} seats
        </p>

        <div className="mt-3 space-y-2 text-gray-600 text-sm">
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> {location}
          </p>
          <p className="flex items-center gap-2">
            <FaIdCard className="text-blue-500" /> {licensePlate.toUpperCase()}
          </p>
          <p className="flex items-center gap-2">
            <FaCogs className="text-green-500" />{" "}
            {transmissionType.toUpperCase()}
          </p>
          <p className="flex items-center gap-2">
            <FaGasPump className="text-yellow-500" /> {fuelType.toUpperCase()}
          </p>
        </div>

        <div className="flex mt-4 gap-3">
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="flex items-center gap-2"
          >
            <FaEdit /> Edit
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="bg-red-600 text-white flex items-center gap-2"
          >
            <FaTrash /> Delete
          </Button>
        </div>
      </div>

      {/* Display Image */}
      <div>
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={`data:image/png;base64,${img}`}
            alt={title + i}
            className="w-56 h-36 rounded-lg object-cover shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Listings: React.FC = () => {
  const { error, isLoading, listings } = useListings();

  if (isLoading) {
    <div className="text-center h-screen flex items-center justify-center">
      <Loader size="lg" />
    </div>;
  }

  if (error) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error fetching listings</p>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No listings found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">
          Your Vehicles ({listings.length})
        </h2>
        <div className="mt-5 space-y-5">
          {listings.map((listing) => (
            <CarCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
