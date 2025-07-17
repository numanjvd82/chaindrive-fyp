import { RentalWithImages } from "@/lib/types";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const hoverTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.8,
};

const ActiveRentalCard: React.FC<RentalWithImages> = ({
  id,
  rentalFee,
  images,
  startDate,
  endDate,
  title,
}) => {
  const formattedStartDate = dayjs(startDate).format("DD/MM/YY");
  const formattedEndDate = dayjs(endDate).format("DD/MM/YY");
  return (
    <Link to={`/rentals/${id}`}>
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
          <img
            src={`data:image/jpeg;base64,${images[0]}`}
            alt={title}
            className="w-12 h-12 rounded-md"
          />
          <div>
            <p className="text-sm text-gray-500">{`${formattedStartDate} - ${formattedEndDate}`}</p>
            <p className="font-medium">{title}</p>
          </div>
        </div>
        <p className="font-medium">PKR{rentalFee.toLocaleString()}</p>
      </motion.div>
    </Link>
  );
};

export default ActiveRentalCard;
