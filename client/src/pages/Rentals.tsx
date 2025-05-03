import Button from "@/components/Button";
import UserFullName from "@/components/UserFullName";
import useAuthUser from "@/hooks/useAuthUser";
import { useListRentals } from "@/hooks/useListRentals";
import dayjs from "dayjs";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Rentals = () => {
  const { rentals, isLoading, error } = useListRentals();
  const { user } = useAuthUser();

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Something went wrong:</div>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">No Rentals Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Rentals</h1>
      <p className="text-gray-600 mb-4">
        Here are the rentals you have made. You can view the details and status
        of each rental.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <Link
            to={`/rentals/${rental.id}`}
            key={rental.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`data:image/jpeg;base64,${rental.images[0]}`}
              alt={rental.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{rental.title}</h2>
              <div className="flex items-center text-gray-600 mt-2">
                <FaUser className="mr-2" />
                {rental.renterId === user?.id ? (
                  <p>Rented by you</p>
                ) : (
                  <UserFullName userId={rental.renterId} />
                )}
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <FaCalendarAlt className="mr-2" />
                <span>
                  Duration: {dayjs(rental.startDate).format("MMM D, YYYY")} -{" "}
                  {dayjs(rental.endDate).format("MMM D, YYYY")}
                </span>
              </div>

              <div className="flex justify-center w-full mt-4">
                <Button
                  className="w-full"
                  disabled={rental.status !== "active"}
                >
                  {rental.status === "active"
                    ? "Active"
                    : rental.status === "completed"
                    ? "Completed"
                    : rental.status === "pending"
                    ? "Pending"
                    : "Cancelled"}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Rentals;
