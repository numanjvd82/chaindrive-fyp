import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";

import { useNotificationProvider } from "@/providers/NotificationProvider";
import Button from "./Button";
import Divider from "./Divider";
import Dropdown from "./Dropdown";

export const NotificationDropdown = () => {
  const { notifications, markAllAsRead } = useNotificationProvider();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      dropdownClassName="top-12 w-80"
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
      <div className="p-2">
        <h4 className="font-semibold">
          Notifications{" "}
          {notifications?.length > 0 && `(${notifications.length})`}
        </h4>
        <Divider />

        {notifications.length === 0 ? (
          <p className="text-center">You have no notifications at the moment</p>
        ) : (
          <>
            <ul className="overflow-y-auto max-h-80">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex justify-between items-center p-2"
                >
                  <div>
                    <p className="font-semibold">
                      {notification.type === "message"
                        ? "New Message"
                        : "New Notification"}
                    </p>
                    <p>{notification.content}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-2">
              <Button onClick={markAllAsRead} className="px-1">
                <div className="flex items-center justify-center gap-1">
                  <MdMarkEmailRead />
                  <p className="font-normal">Mark all as read</p>
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
    </Dropdown>
  );
};
