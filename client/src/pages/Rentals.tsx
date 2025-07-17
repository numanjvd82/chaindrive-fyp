import Button from "@/components/Button";
import Loader from "@/components/Loader";
import UserFullName from "@/components/UserFullName";
import useAuthUser from "@/hooks/useAuthUser";
import { useListRentals } from "@/hooks/useListRentals";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { FaCalendarAlt, FaUser, FaCar, FaSearch, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimes, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Rentals = () => {
  const { user } = useAuthUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { rentals, isLoading, error } = useListRentals({
    userId: user?.id,
    isOwner: user?.role === "owner" ? true : false,
    isRenter: user?.role === "renter" ? true : false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="w-3 h-3 text-green-600" />;
      case "completed":
        return <FaCheckCircle className="w-3 h-3 text-blue-600" />;
      case "pending":
        return <FaClock className="w-3 h-3 text-yellow-600" />;
      case "cancelled":
        return <FaTimes className="w-3 h-3 text-red-600" />;
      default:
        return <FaCircle className="w-3 h-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center">
            <Loader size="xl" variant="spinner" color="text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg mt-4">Loading your rentals...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-4">An error occurred while fetching your rentals.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Filter and search logic
  const filteredRentals = rentals?.filter((rental) => {
    const matchesSearch = rental.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const sortedRentals = filteredRentals.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  if (!rentals || rentals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCar className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Rentals Yet</h3>
          <p className="text-gray-600 mb-6">
            {user?.role === "owner" 
              ? "You haven't received any rental requests yet. Create a listing to get started!"
              : "You haven't made any rentals yet. Browse available cars to book your first ride!"
            }
          </p>
          <Link 
            to={user?.role === "owner" ? "/dashboard/owner" : "/dashboard/renter"}
            className="inline-block"
          >
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              {user?.role === "owner" ? "Create Listing" : "Browse Cars"}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user?.role === "owner" ? "Rental Requests" : "My Rentals"}
              </h1>
              <p className="text-lg text-gray-600">
                {user?.role === "owner" 
                  ? "Manage and track rental requests for your vehicles"
                  : "View and manage your rental history and active bookings"
                }
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 text-center min-w-[100px]"
              >
                <div className="text-2xl font-bold">{rentals?.length || 0}</div>
                <div className="text-sm opacity-90">Total</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-4 text-center min-w-[100px]"
              >
                <div className="text-2xl font-bold">
                  {rentals?.filter(r => r.status === "active").length || 0}
                </div>
                <div className="text-sm opacity-90">Active</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Rentals Grid */}
        {filteredRentals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No rentals match your current filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRentals.map((rental, index) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  to={`/rentals/${rental.id}`}
                  className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${rental.images[0]}`}
                      alt={rental.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(rental.status)}`}>
                        {getStatusIcon(rental.status)}
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {rental.title}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm">
                          {rental.renterId === user?.id ? (
                            "Rented by you"
                          ) : (
                            <UserFullName userId={rental.renterId} />
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="text-sm">
                          {dayjs(rental.startDate).format("MMM D")} - {dayjs(rental.endDate).format("MMM D, YYYY")}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                          rental.status === "completed" || rental.status === "cancelled"
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                        disabled={rental.status === "completed" || rental.status === "cancelled"}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(rental.status)}
                          <span>
                            {rental.status === "active" && "Active Rental"}
                            {rental.status === "pending" && "Pending Approval"}
                            {rental.status === "completed" && "Completed"}
                            {rental.status === "cancelled" && "Cancelled"}
                          </span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;
