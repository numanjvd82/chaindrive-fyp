import { useConfirmRental } from "@/hooks/useConfirmRental";
import { useNotificationProvider } from "@/providers/NotificationProvider";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "./Button";
import Divider from "./Divider";
import Dropdown from "./Dropdown";

export const NotificationDropdown = () => {
  const { notifications, markAllAsRead } = useNotificationProvider();
  const { confirmRental, isConfirmRentalLoading } = useConfirmRental();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmRental = async (rentalId: number) => {
    try {
      await confirmRental({
        rentalId,
      });
      setIsOpen(false);
      toast.success("Rental confirmed successfully!");
      markAllAsRead();
    } catch (error) {
      console.error("Error confirming rental:", error);
    }
  };

  return (
    <Dropdown
      dropdownClassName="top-12 w-96 shadow-lg rounded-lg bg-white"
      button={
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-200 cursor-pointer p-2 rounded-xl transition duration-300 ease-in-out hover:text-primary hover:bg-gray-300 relative"
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
                {notification.type === "rental_confirmation" ? (
                  <>
                    <p className="font-semibold text-gray-800">
                      Rental Confirmation
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.content}
                    </p>
                    <Button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      onClick={() => {
                        if (isConfirmRentalLoading) return;
                        if (!notification.rentalId) return;
                        handleConfirmRental(notification.rentalId);
                      }}
                      disabled={isConfirmRentalLoading}
                      isLoading={isConfirmRentalLoading}
                    >
                      {isConfirmRentalLoading
                        ? "Confirming..."
                        : "Confirm Rental"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-gray-800">
                      {notification.type === "message"
                        ? "New Message"
                        : "New Notification"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.content}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dropdown>
  );
};
