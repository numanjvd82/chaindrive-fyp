import React from "react";
import { motion } from "motion/react";
import { FaUser, FaCalendarAlt, FaEdit, FaCar, FaKey } from "react-icons/fa";
import { convertDateToString } from "@/lib/utils";

interface AccountInfoProps {
  selfie: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "renter" | "owner";
  createdAt: Date;
  updatedAt: Date;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({
  firstName,
  lastName,
  email,
  role,
  selfie,
  createdAt,
  updatedAt,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white">
          <FaUser className="text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Account Information
          </h2>
          <p className="text-gray-600">Your personal profile details</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Profile Picture */}
        <div className="relative group">
          <img
            src={`data:image/jpeg;base64,${selfie}`}
            alt="Profile"
            className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FaEdit className="text-white text-xl" />
          </div>
        </div>

        {/* Account Details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{`${firstName} ${lastName}`}</h3>
              <p className="text-gray-600">{email}</p>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                    role === "owner"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {role === "owner" ? (
                    <>
                      <FaCar className="text-xs" />
                      <span>Car Owner</span>
                    </>
                  ) : (
                    <>
                      <FaKey className="text-xs" />
                      <span>Renter</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaCalendarAlt className="text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm">{convertDateToString(createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaEdit className="text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm">{convertDateToString(updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
