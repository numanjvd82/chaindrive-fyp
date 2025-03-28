import ImageSlider from '@/components/ImageSlider';
import React from 'react';

const CarDetail = () => {
  const carData = {
    name: "MERCEDES C63 AMG",
    location: "Larvae, Pakistan",
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 2,
    paintColor: "Black",
    features: [
      "Free picking up",
      "Free street parking",
      "EV charging",
      "Bluetooth",
      "GPS navigation",
      "Keyless entry",
      "Leather seats"
    ],
  };

  const images = [
    '/logo.svg',
    '/maincar.svg',
    'card2(prd).svg'
  ];

  return (
    <div className="p-6 w-full mr-auto">
      <h1 className="text-2xl font-bold mb-2">{carData.name}</h1>
      <ImageSlider images={images} />
      <h1 className="text-xl font-bold text-gray-800 my-6">Car Details</h1>
      
      <div className="space-y-2">
        <p className='flex justify-between'><span className="font-medium text-blue-500">Location:</span> {carData.location}</p>
        <p className='flex justify-between'><span className="font-medium text-blue-500">Fuel type:</span> {carData.fuelType}</p>
        <p className='flex justify-between'><span className="font-medium text-blue-500">Transmission:</span> {carData.transmission}</p>
        <p className='flex justify-between'><span className="font-medium text-blue-500">Seats:</span> {carData.seatingCapacity}</p>
        <p className='flex justify-between'><span className="font-medium text-blue-500">Color:</span> {carData.paintColor}</p>
        <p className='flex justify-between'><span className="font-medium text-blue-500">Features:</span> {carData.features}</p>
      </div>

    </div>
  );
};

export default CarDetail;