import Button from "@/components/Button";
import { AvailableRental, Listing } from "@/lib/types";
import { FaRegSnowflake, FaStar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export const CarCard: React.FC<Listing> = (props) => {
  const {
    title,
    year,
    fuelType,
    numOfSeats,
    images,
    licensePlate,
    model,
    transmissionType,
    location,
    pricePerDay,
    id,
    createdAt,
    ownerId,
    updatedAt,
  } = props;

  const navigate = useNavigate();

  const rating = 4.5;
  const reviews = 120;
  const passengers = numOfSeats;
  const doors = 4;
  const transmission = transmissionType;

  const handleViewDetails = () => {
    const details: AvailableRental = {
      id,
      title,
      year,
      fuelType,
      numOfSeats,
      images,
      licensePlate,
      model,
      transmissionType,
      location,
      pricePerDay,
      createdAt,
      updatedAt,
      ownerId,
    };
    navigate(`/listing-detail/${id}`, {
      state: { details },
    });
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={`data:image/jpeg;base64,${images[0]}`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-semibold text-gray-800">PKR {pricePerDay}/day</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Rating */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium text-gray-700 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">({reviews} reviews)</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiUser className="text-blue-600 text-sm" />
            </div>
            <span>{passengers} Seats</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <TbManualGearbox className="text-purple-600 text-sm" />
            </div>
            <span>{transmission === "automatic" ? "Auto" : "M/T"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <FaRegSnowflake className="text-green-600 text-sm" />
            </div>
            <span>A/C</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <GiCarDoor className="text-orange-600 text-sm" />
            </div>
            <span>{doors} Doors</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-bold text-gray-900">
              PKR {pricePerDay}
              <span className="text-sm font-normal text-gray-500">/day</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleViewDetails} 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          View Details →
        </Button>
      </div>
    </div>
  );
};
