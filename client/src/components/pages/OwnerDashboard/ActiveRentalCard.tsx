import { motion } from "framer-motion";

export interface Rental {
  id: number;
  dates: string;
  car: string;
  amount: number;
  image: string;
}

export const hoverTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.8,
};

const ActiveRentalCard: React.FC<Rental> = ({
  amount,
  car,
  dates,
  id,
  image,
}) => {
  return (
    <motion.div
      key={id}
      className="flex items-center justify-between p-4 bg-accent rounded-lg shadow"
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={hoverTransition}
    >
      <div className="flex items-center space-x-4">
        <img src={image} alt={car} className="w-12 h-12 rounded-md" />
        <div>
          <p className="text-sm text-gray-500">{dates}</p>
          <p className="font-medium">{car}</p>
        </div>
      </div>
      <p className="font-medium">${amount.toLocaleString()}</p>
    </motion.div>
  );
};

export default ActiveRentalCard;
