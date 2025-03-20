import { hoverTransition } from "@/components/pages/OwnerDashboard/ActiveRentalCard";
import ActiveRentals from "@/components/pages/OwnerDashboard/ActiveRentals";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OwnerDashboard: React.FC = () => {
  const user = {
    name: "Alexa",
    activeRentals: 5,
    totalEarnings: 7200,
    vehiclesListed: 8,
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <Link to="/dummy-contract" className="text-blue-500">
        Dummy Contract
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Rentals", value: user.activeRentals },
          {
            label: "Total Earnings",
            value: `$${user.totalEarnings.toLocaleString()}`,
          },
          { label: "Vehicles Listed", value: user.vehiclesListed },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="p-4 bg-accent rounded-lg shadow"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            transition={hoverTransition}
          >
            <h2 className="text-sm font-medium text-gray-500">{stat.label}</h2>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold">Rentals</h2>
        <ActiveRentals />
      </div>
    </div>
  );
};

export default OwnerDashboard;
