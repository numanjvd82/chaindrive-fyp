import { AvailableRental } from "@/lib/types";
import React from "react";

type Props = {
  rental: Omit<AvailableRental, "images">;
};

const CarDetail: React.FC<Props> = ({ rental }) => {
  return (
    <div className="bg-gray-900 text-white p-6 md:p-8 rounded-lg shadow-lg ">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-400">
        {rental.title} {rental.model} ({rental.year})
      </h2>

      <p className="text-lg text-gray-300 mt-2">
        Price:{" "}
        <span className="text-blue-400 font-semibold">
          {rental.pricePerDay}
          <span className="text-sm"> PKR / day</span>
        </span>
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p>
          <span className="text-blue-300 font-medium">Location:</span>{" "}
          {rental.location}
        </p>
        <p>
          <span className="text-blue-300 font-medium">Fuel Type:</span>{" "}
          {rental.fuelType.toUpperCase()}
        </p>
        <p>
          <span className="text-blue-300 font-medium">Transmission:</span>{" "}
          {rental.transmissionType.toUpperCase()}
        </p>
        <p>
          <span className="text-blue-300 font-medium">Seats:</span>{" "}
          {rental.numOfSeats}
        </p>
        <p>
          <span className="text-blue-300 font-medium">License Plate:</span>{" "}
          {rental.licensePlate}
        </p>
      </div>
    </div>
  );
};

export default CarDetail;
