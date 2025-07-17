import useAddConversation from "@/hooks/useAddConversation";
import useAuthUser from "@/hooks/useAuthUser";
import { useOtherUser } from "@/hooks/useOtherUser";
import { convertDateToString } from "@/lib/utils";
import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "./Button";
import Loader from "./Loader";

type Props = {
  id: number;
};

const AboutVehicleOwner: React.FC<Props> = ({ id }) => {
  const { error, isLoading, user: otherUser } = useOtherUser(id);
  const { user: authenticatedUser } = useAuthUser();
  const { addConversation, isLoading: isAddConversationLoading } =
    useAddConversation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">User not found</p>
      </div>
    );
  }

  if (!authenticatedUser || !otherUser) {
    return null;
  }

  const rating = 4.5;
  const reviewCount = 20;

  // Render star ratings
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );
  };

  return (
    <div className="bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg ">
      {/* Header */}
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
        About Vehicle Owner
      </h2>

      {/* Owner Info */}
      <div className="flex flex-col items-center text-center">
        <img
          className="h-20 w-20 rounded-full border-2 border-blue-400"
          src={`data:image/jpeg;base64,${otherUser.selfie}`}
          alt={otherUser.firstName}
        />
        <h3 className="text-xl font-semibold mt-3">{`${otherUser.firstName} ${otherUser.lastName}`}</h3>

        {/* Rating */}
        <div className="flex items-center justify-center mt-2">
          {renderStars()}
          <span className="ml-2 text-gray-400 text-sm">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>
      </div>

      {/* User Details */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-gray-300 text-sm">
        <p>
          <span className="text-blue-300 font-medium">From:</span>{" "}
          {otherUser.city}, {otherUser.state}
        </p>
        <p>
          <span className="text-blue-300 font-medium">Member Since:</span>{" "}
          {convertDateToString(otherUser.createdAt)}
        </p>
        <p className="col-span-2">
          <span className="text-blue-300 font-medium">Address:</span>{" "}
          {otherUser.address}
        </p>
        <p className="col-span-2">
          <span className="text-blue-300 font-medium">Phone:</span>{" "}
          {otherUser.phone}
        </p>
      </div>

      {/* Chat Button */}
      <Link to="/chat">
        <Button
          disabled={isAddConversationLoading}
          isLoading={isAddConversationLoading}
          onClick={async () => {
            try {
              const conversationId = await addConversation({
                user1: authenticatedUser.id,
                user2: otherUser.id,
              });
              if (conversationId) {
                navigate(`/chat?conversationId=${conversationId}`);
              }
            } catch (error) {
              console.error("Error adding conversation:", error);
              toast.error("Failed to start chat");
            }
          }}
          className="mt-6 w-full py-2 text-lg font-semibold"
        >
          Chat Now
        </Button>
      </Link>
    </div>
  );
};

export default AboutVehicleOwner;
