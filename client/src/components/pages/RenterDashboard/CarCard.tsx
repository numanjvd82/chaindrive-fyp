import Button from "@/components/Button";
import Divider from "@/components/Divider";
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
  const airConditioning = true;
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
    <div className="flex flex-col items-start w-80 border rounded-lg shadow-xl py-4 px-6 bg-white min-h-[450px]">
      <div className="h-[200px] w-full flex justify-center">
        <img
          src={`data:image/jpeg;base64,${images[0]}`}
          alt={title}
          className="rounded-lg h-full object-cover w-full"
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mt-4">{title}</h3>
        <div className="flex items-center">
          <FaStar className="text-xl mr-1 text-yellow-300" />
          <span>
            {rating.toFixed(1)}
            <span className="text-gray-500"> ({reviews} reviews)</span>
          </span>
        </div>
      </div>
      <section className="text-sm text-gray-600 mt-3 space-y-1 w-full">
        <div className="flex justify-between">
          <div className="flex items-center">
            <FiUser className="text-xl mr-1" />
            <span>{passengers} Passengers</span>
          </div>
          <div className="flex items-center">
            <TbManualGearbox className="text-xl mr-1" />
            <span>{transmission}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <FaRegSnowflake className="text-xl mr-1" />
            <span>
              {airConditioning ? "Air Conditioning" : "No Air Conditioning"}
            </span>
          </div>
          <div className="flex items-center">
            <GiCarDoor className="text-xl mr-1" />
            <span>{doors} Doors</span>
          </div>
        </div>
      </section>
      <Divider />
      <div className="flex justify-between w-full">
        <p className="text-lg font-bold">Price</p>
        <p>
          <span className="text-lg font-bold">PKR{pricePerDay}</span>
          <span className="text-sm text-gray-500"> /day</span>
        </p>
      </div>
      <Button onClick={handleViewDetails} className="mt-4 w-full">
        Rent Now →
      </Button></Link>
      
    </div>
  );
};