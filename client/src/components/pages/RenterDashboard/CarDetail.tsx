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
    rules: [
      "No smoking",
      "Pets allowed"
    ]
  };

  const images = [
    '/logo.svg',
    '/maincar.svg',
    'card2(prd).svg'
  ];

  return (
    <div className="p-8 max-w-2xl ">
      <h1 className="text-2xl font-bold mb-2">{carData.name}</h1>
      <ImageSlider images={images} />
      <h2 className="text-xl font-semibold mt-6 mb-3">Car Details</h2>
      
      <div className="space-y-2">
        <p><span className="font-medium">Location:</span> {carData.location}</p>
        <p><span className="font-medium">Fuel type:</span> {carData.fuelType}</p>
        <p><span className="font-medium">Transmission:</span> {carData.transmission}</p>
        <p><span className="font-medium">Seats:</span> {carData.seatingCapacity}</p>
        <p><span className="font-medium">Color:</span> {carData.paintColor}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg">Features</h3>
        <p className="list-disc pl-5 mt-2">
          {carData.features.map((feature, index) => (
            <p key={index}>{feature}</p>
          ))}
        </p> 
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg">Rules</h3>
        <ul className="list-disc pl-5 mt-2">
          {carData.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarDetail;