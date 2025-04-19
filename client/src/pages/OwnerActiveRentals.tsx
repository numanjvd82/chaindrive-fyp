import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";

const OwnerActiveRentals = () => {
  const rentals = [
    {
      id: 1,
      renter: "Lauren B.",
      vehicle: "Honda Civic 2013",
      duration: "23 Nov - 15 Jan",
      status: "In Progress",
      image: "/images/honda-civic.jpg",
    },
    {
      id: 2,
      renter: "J.D Advert",
      vehicle: "Audi A4",
      duration: "23 Oct - 15 Nov",
      status: "Completed",
      image: "/images/audi-a4.jpg",
    },
    {
      id: 3,
      renter: "Lauren B.",
      vehicle: "Mercedes AMG G63",
      duration: "27 May - 15 June",
      status: "Completed",
      image: "/images/mercedes-amg.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Active Rentals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={rental.image}
              alt={rental.vehicle}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{rental.vehicle}</h2>
              <div className="flex items-center text-gray-600 mt-2">
                <FaUser className="mr-2" />
                <span>{rental.renter}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <FaCalendarAlt className="mr-2" />
                <span>{rental.duration}</span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <FaClock className="mr-2" />
                <span>{rental.status}</span>
              </div>
              <button
                className={`mt-4 w-full py-2 rounded-lg ${
                  rental.status === "In Progress"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
                disabled={rental.status !== "In Progress"}
              >
                {rental.status === "In Progress" ? "End Rental" : "Completed"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerActiveRentals;
