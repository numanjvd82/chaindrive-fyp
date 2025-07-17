import { Listing } from "@/lib/types";
import { CarCard } from "./CarCard";

interface CarGridProps {
  availableRentals: Listing[];
}

export const CarGrid: React.FC<CarGridProps> = ({ availableRentals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {availableRentals.map((rentals, index) => (
        <div key={index} className="transform hover:scale-105 transition-transform duration-300">
          <CarCard {...rentals} />
        </div>
      ))}
    </div>
  );
};
