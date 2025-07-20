import React from "react";
import { motion } from "motion/react";
import { FaKey, FaShieldAlt, FaCog, FaLock, FaUnlock } from "react-icons/fa";
import Button from "@/components/Button";
import { User } from "@/lib/types";

interface ProfileActionsProps {
  user: User;
  isToggleTwoFactorLoading: boolean;
  onToggleTwoFactor: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  user,
  isToggleTwoFactorLoading,
  onToggleTwoFactor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
          <FaCog className="text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account Actions</h2>
          <p className="text-gray-600">
            Manage your account security and settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <FaKey className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Password</h3>
              <p className="text-sm text-gray-600">
                Update your account password
              </p>
            </div>
          </div>
          <Button className="w-full">Change Password</Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg text-white">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-600">
                {user.twoFactorEnabled ? "Disable" : "Enable"} extra security
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                user.twoFactorEnabled
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {user.twoFactorEnabled ? (
                <>
                  <FaLock className="text-xs" />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <FaUnlock className="text-xs" />
                  <span>Disabled</span>
                </>
              )}
            </span>
          </div>

          <Button
            className="w-full"
            isLoading={isToggleTwoFactorLoading}
            onClick={onToggleTwoFactor}
            variant={user.twoFactorEnabled ? "secondary" : "primary"}
          >
            {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
