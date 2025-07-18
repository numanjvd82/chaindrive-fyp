import { Notification } from "@/lib/types";
import { useNotificationProvider } from "@/providers/NotificationProvider";
import { useState } from "react";
import {
  FaRegBell,
  FaCar,
  FaEnvelope,
  FaCheckCircle,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";
import { ConfirmRentalModal } from "./ConfirmRentalModal";
import Dropdown from "./Dropdown";
import { motion } from "motion/react";

export const NotificationDropdown = () => {
  const { notifications, markAllAsRead, markIndividualAsRead } =
    useNotificationProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(null);

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "rental_confirmation":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCar className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Rental Confirmation
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                    Action Required
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {notification.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm flex-1"
                    onClick={() => {
                      setSelectedRentalId(notification.rentalId);
                      setSelectedNotificationId(notification.id);
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaCalendarAlt className="text-xs" />
                      View Details
                    </div>
                  </Button>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-300"
                    onClick={() => {
                      markIndividualAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "message":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">New Message</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                    New
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {notification.content}
                </p>
                <div className="flex items-center gap-2">
                  {notification.link && (
                    <Link
                      to={notification.link}
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm flex-1 text-center"
                    >
                      View Message
                    </Link>
                  )}
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-all duration-300"
                    onClick={() => {
                      markIndividualAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Notification</h3>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-lg transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      markIndividualAsRead(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {notification.content}
                </p>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <Dropdown
        dropdownClassName="top-12 w-96 shadow-xl rounded-2xl bg-white border border-gray-200 overflow-hidden"
        button={
          <span
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-100 hover:bg-gray-200  cursor-pointer p-3 rounded-xl transition-all duration-300 hover:shadow-md relative"
          >
            <FaRegBell className="text-xl text-gray-600 hover:text-primary" />
            {notifications?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-3 h-3 border-2 border-white" />
            )}
          </span>
        }
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg">Notifications</h4>
            {notifications?.length > 0 && (
              <Button
                onClick={markAllAsRead}
                className="text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10 px-3 py-1 rounded-lg text-sm transition-all duration-300"
              >
                Mark all as read
              </Button>
            )}
          </div>
          {notifications?.length > 0 && (
            <p className="text-blue-100 text-sm mt-1">
              {notifications.length} unread notification
              {notifications.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRegBell className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium mb-1">All caught up!</p>
              <p className="text-gray-400 text-sm">
                You have no new notifications
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-96">
              {notifications.map((notification, index) => (
                <motion.div
                  key={`${notification.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderNotificationContent(notification)}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Dropdown>

      {/* Rental Details Modal */}
      {selectedRentalId && (
        <ConfirmRentalModal
          selectedRentalId={selectedRentalId}
          setSelectedRentalId={setSelectedRentalId}
          selectedNotificationId={selectedNotificationId}
          setSelectedNotificationId={setSelectedNotificationId}
        />
      )}
    </>
  );
};
