import { hoverTransition } from "@/components/pages/OwnerDashboard/ActiveRentalCard";
import ActiveRentals from "@/components/pages/OwnerDashboard/ActiveRentals";
import useAuthUser from "@/hooks/useAuthUser";
import { useDashboardBasicInfo } from "@/hooks/useDashboardBasicInfo";
import { motion } from "framer-motion";

const OwnerDashboard: React.FC = () => {
  const { user } = useAuthUser();
  const { dashboardBasicInfo, isLoading } = useDashboardBasicInfo();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || !dashboardBasicInfo) {
    return null;
  }

  const name = `${user.firstName} ${user.lastName}`;

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold">Welcome, {name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Rentals", value: dashboardBasicInfo.activeBookings },
          {
            label: "Pending Rentals",
            value: dashboardBasicInfo.pendingBookings,
          },
          {
            label: "Completed Rentals",
            value: dashboardBasicInfo.completedBookings,
          },
          {
            label: "Cancelled Rentals",
            value: dashboardBasicInfo.cancelledBookings,
          },
          {
            label: "Total Earnings (PKR)",
            value: `${dashboardBasicInfo.totalEarnings}`,
          },
          { label: "Vehicles Listed", value: dashboardBasicInfo.totalListings },
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
