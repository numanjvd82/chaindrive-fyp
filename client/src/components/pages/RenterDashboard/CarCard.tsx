import Button from "@/components/Button";
import Divider from "@/components/Divider";
import { FaRegSnowflake, FaStar } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { Link } from "react-router-dom";

export interface CarProps {
  name: string;
  rating: number;
  reviews: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  price: number;
  image: string;
  link: string;
}

export const CarCard: React.FC<CarProps> = ({
  name,
  rating,
  reviews,
  passengers,
  transmission,
  airConditioning,
  doors,
  price,
  image,
  link,
}) => {
  return (
    <div className="flex flex-col items-start w-70 border rounded-lg shadow-xl py-4 px-6 bg-white min-h-[450px]">
      <div className="h-[150px] w-full flex justify-center">
        <img
          src={image}
          alt={name}
          className="rounded-lg h-full object-contain"
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mt-4">{name}</h3>
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
          <span className="text-lg font-bold">${price}</span>
          <span className="text-sm text-gray-500"> /day</span>
        </p>
      </div>
      <Link 
        to={link} 
        className="mt-4 w-full"
      >
      <Button className="mt-4 w-full">
        Rent Now →
      </Button></Link>
      
    </div>
  );
};