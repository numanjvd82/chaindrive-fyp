import { CarCard, CarProps } from "./CarCard";

interface CarGridProps {
  cars: CarProps[];
}

export const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cars.map((car, index) => (
        <CarCard key={index} {...car} />
      ))}
    </div>
  );
};
