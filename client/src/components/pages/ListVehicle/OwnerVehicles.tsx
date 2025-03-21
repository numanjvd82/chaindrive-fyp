import Button from "@/components/Button";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";

type Car = {
  year: number;
  title: string;
  type: string;
  seats: number;
  doors: number;
  passengers: number;
  images: string[];
};

const CarCard: React.FC<{ car: Car; onDelete: () => void }> = ({ car, onDelete }) => {
  // Display only the first image
  const firstImage = car.images[0];

  return (
    <div className="bg-gray-100 p-4 flex items-center gap-4 justify-between">
      <div>
        <p className="text-sm text-gray-500">Listed</p>
        <h2 className="text-lg font-semibold">
          {car.title} {car.year}
        </h2>
        <p className="text-sm text-gray-600">
          {car.type} - {car.seats} seats - {car.doors} doors - {car.passengers} passengers
        </p>
        <div className="flex mt-2">
          <Button size="sm" variant="primary" type="button" className="mr-4 text-sm">
            Edit
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="bg-red-600 text-sm"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      {/* Display only the first image */}
      {firstImage && (
        <img
          src={firstImage}
          alt={`${car.title}`}
          className="w-56 h-36 rounded-lg object-cover"
        />
      )}
    </div>
  );
};

const OwnerVehicles: React.FC = () => {
  const [savedVehicles, setSavedVehicles] = useState<Car[]>([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedVehicles") || "[]");
    setSavedVehicles(Array.isArray(savedData) ? savedData : [savedData]);
  }, []);

  const handleDelete = (index: number) => {
    const updatedVehicles = savedVehicles.filter((_, i) => i !== index);
    localStorage.setItem("savedVehicles", JSON.stringify(updatedVehicles));
    setSavedVehicles(updatedVehicles); 
  };

  return (
    <div className="bg-gray-100">
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">Your Vehicles ({savedVehicles.length})</h2>
        <div className="mt-4 space-y-4">
          {savedVehicles.map((car, index) => (
            <CarCard
              key={index}
              car={car}
              onDelete={() => handleDelete(index)} 
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerVehicles;