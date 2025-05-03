import { Notification } from "@/lib/types";
import { useNotificationProvider } from "@/providers/NotificationProvider";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";
import { ConfirmRentalModal } from "./ConfirmRentalModal";
import Divider from "./Divider";
import Dropdown from "./Dropdown";

export const NotificationDropdown = () => {
  const { notifications, markAllAsRead } = useNotificationProvider();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "rental_confirmation":
        return (
          <>
            <p className="font-semibold text-gray-800">Rental Confirmation</p>
            <p className="text-sm text-gray-600">{notification.content}</p>
            <Button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => setSelectedRentalId(notification.rentalId)}
            >
              View Details
            </Button>
          </>
        );

      case "message":
        return (
          <Link
            to={notification.link || "#"}
            onClick={() => {
              if (notification.link) {
                setIsOpen(false);
              }
            }}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded transition"
          >
            <p className="font-semibold text-gray-800">New Message</p>
            <p className="text-sm text-gray-600">{notification.content}</p>
          </Link>
        );

      default:
        return (
          <>
            <p className="font-semibold text-gray-800">Notification</p>
            <p className="text-sm text-gray-600">{notification.content}</p>
          </>
        );
    }
  };

  return (
    <>
      <Dropdown
        dropdownClassName="top-12 w-96 shadow-lg rounded-lg bg-white"
        button={
          <span
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-200 cursor-pointer p-2 rounded-xl transition hover:text-primary hover:bg-gray-300 relative"
          >
            <FaRegBell className="text-xl" />
            {notifications?.length > 0 && (
              <span className="absolute top-0 -right-0 bg-primary rounded-full w-2 h-2" />
            )}
          </span>
        }
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg">Notifications</h4>
            {notifications?.length > 0 && (
              <Button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all as read
              </Button>
            )}
          </div>
          <Divider />

          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              You have no notifications at the moment
            </p>
          ) : (
            <ul className="overflow-y-auto max-h-80">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex flex-col gap-2 p-3 border-b last:border-b-0"
                >
                  {renderNotificationContent(notification)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dropdown>

      {/* Rental Details Modal */}
      {selectedRentalId && (
        <ConfirmRentalModal
          selectedRentalId={selectedRentalId}
          setSelectedRentalId={setSelectedRentalId}
        />
      )}
    </>
  );
};
