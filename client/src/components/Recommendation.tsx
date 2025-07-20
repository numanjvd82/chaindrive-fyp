import { motion } from "motion/react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

const Recommendation = () => {
  const recommendations = [
    {
      id: 1,
      imageUrl: "/maincar.svg",
      name: "Toyota Corolla GLI",
      year: "2006",
      price: "120",
      location: "Islamabad",
      rating: 4.5,
      reviews: 23,
    },
    {
      id: 2,
      imageUrl: "/maincar.svg",
      name: "Honda Civic",
      year: "2018",
      price: "150",
      location: "Lahore",
      rating: 4.8,
      reviews: 41,
    },
    {
      id: 3,
      imageUrl: "/maincar.svg",
      name: "Suzuki Swift",
      year: "2020",
      price: "130",
      location: "Karachi",
      rating: 4.3,
      reviews: 18,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
          >
            {/* Image Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-sm font-bold text-green-600">PKR {item.price}/day</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.name} {item.year}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <FaMapMarkerAlt className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {item.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">({item.reviews} reviews)</span>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                View Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;
