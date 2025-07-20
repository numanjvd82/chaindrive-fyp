import useAddConversation from "@/hooks/useAddConversation";
import useAuthUser from "@/hooks/useAuthUser";
import { useOtherUser } from "@/hooks/useOtherUser";
import { convertDateToString } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";
import { 
  FaRegStar, 
  FaStar, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaHome, 
  FaPhone,
  FaComments,
  FaUser
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "./Button";
import Loader from "./Loader";

type Props = {
  id: number;
  title?: string; // Optional title to customize the header
};

const UserProfile: React.FC<Props> = ({ id, title = "User Information" }) => {
  const { error, isLoading, user: otherUser } = useOtherUser(id);
  const { user: authenticatedUser } = useAuthUser();
  const { addConversation, isLoading: isAddConversationLoading } =
    useAddConversation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader size="md" variant="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium">User not found</div>
          <p className="text-gray-500 mt-2">Unable to load user information</p>
        </div>
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <FaUser className="w-5 h-5" />
          {title}
        </h2>
      </div>

      <div className="p-6">
        {/* User Profile */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative">
            <img
              className="h-20 w-20 rounded-full border-4 border-blue-200 shadow-md"
              src={`data:image/jpeg;base64,${otherUser.selfie}`}
              alt={otherUser.firstName}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-3">
            {`${otherUser.firstName} ${otherUser.lastName}`}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>
            <span className="ml-2 text-gray-500 text-sm">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaMapMarkerAlt className="text-blue-600 w-4 h-4" />
            <div>
              <span className="text-sm text-gray-500">Location</span>
              <p className="font-medium text-gray-900">{otherUser.city}, {otherUser.state}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-blue-600 w-4 h-4" />
            <div>
              <span className="text-sm text-gray-500">Member Since</span>
              <p className="font-medium text-gray-900">{convertDateToString(otherUser.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <FaHome className="text-blue-600 w-4 h-4 mt-1" />
            <div>
              <span className="text-sm text-gray-500">Address</span>
              <p className="font-medium text-gray-900">{otherUser.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FaPhone className="text-blue-600 w-4 h-4" />
            <div>
              <span className="text-sm text-gray-500">Phone</span>
              <p className="font-medium text-gray-900">{otherUser.phone}</p>
            </div>
          </div>
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaComments className="w-4 h-4" />
              Start Conversation
            </div>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default UserProfile;
