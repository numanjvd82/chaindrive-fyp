import useAuthUser from "@/hooks/useAuthUser";
import { useListRentals } from "@/hooks/useListRentals";
import ActiveRentalCard from "./ActiveRentalCard";

const ActiveRentals = () => {
  const { user, loading } = useAuthUser();
  const { rentals, isLoading } = useListRentals({
    userId: user?.id,
    isOwner: user?.role === "owner" ? true : false,
    isRenter: user?.role === "renter" ? true : false,
  });

  if (isLoading || loading) {
    return (
      <div className="mt-4 flex items-center justify-between p-4 bg-accent rounded-lg shadow">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <div className="mt-4 flex items-center justify-between p-4 bg-accent rounded-lg shadow">
        <p className="text-md">No active rentals found.</p>
      </div>
    );
  }

  const activeRentals = rentals.filter((rental) => rental.status === "active");

  if (activeRentals.length === 0) {
    return (
      <div className="mt-4 flex items-center justify-between p-4 bg-accent rounded-lg shadow">
        <p className="text-md">No active rentals found.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {activeRentals.map((rental) => (
        <ActiveRentalCard key={rental.id} {...rental} />
      ))}
    </div>
  );
};

export default ActiveRentals;
