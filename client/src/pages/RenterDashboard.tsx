import { CarProps } from "@/components/pages/RenterDashboard/CarCard";
import { CarGrid } from "@/components/pages/RenterDashboard/CarGrid";

import car1Image from "@/assets/images/car-1.png";
import car2Image from "@/assets/images/car-2.png";
import car3Image from "@/assets/images/car-3.png";
import car4Image from "@/assets/images/car-4.png";
import Footer from "@/components/Footer";

const cars: CarProps[] = [
  {
    name: "Jaguar XE L P250",
    rating: 4.8,
    reviews: 2436,
    passengers: 4,
    transmission: "Auto",
    airConditioning: true,
    doors: 4,
    price: 1800,
    image: car1Image,
    link: "/listing-detail/1",
  },
  {
    name: "Audi R8",
    rating: 4.6,
    reviews: 1936,
    passengers: 2,
    transmission: "Auto",
    airConditioning: true,
    doors: 2,
    price: 2100,
    image: car2Image,
    link: "/vehicle-detail",
  },
  {
    name: "BMW M3",
    rating: 4.5,
    reviews: 2036,
    passengers: 4,
    transmission: "Auto",
    airConditioning: true,
    doors: 4,
    price: 1600,
    image: car3Image,
    link: "/vehicle-detail",
  },
  {
    name: "Lamborghini Huracan",
    rating: 4.3,
    reviews: 2236,
    passengers: 2,
    transmission: "Auto",
    airConditioning: true,
    doors: 2,
    price: 2300,
    image: car4Image,
    link: "/vehicle-detail",
  },
];

const RenterDashboard = () => {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8">Car Rental</h1>
        <CarGrid cars={cars} />
      </div>
      <Footer />
    </div>
  );
};

export default RenterDashboard;
