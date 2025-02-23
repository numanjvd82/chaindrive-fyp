import { useNotification } from "@/hooks/useNotification";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";

import Button from "./Button";
import Divider from "./Divider";
import Dropdown from "./Dropdown";

export const NotificationDropdown = () => {
  const { notifications, markAsRead, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const Notfications = () => {
    if (notifications.length === 0) {
      return (
        <p className="text-center">
          You're all caught up! <br /> No new notifications.
        </p>
      );
    }
    return notifications.map((notification) => (
      <div key={notification.id}>
        <li className="flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {notification.type === "message"
                ? "New Message"
                : "New Notification"}
            </p>
            <p>{notification.content}</p>
          </div>
          <Button
            onClick={() => {
              markAsRead(notification.id);
              removeNotification(notification.id);
            }}
            className="px-1"
          >
            <MdMarkEmailRead />
          </Button>
        </li>
        <Divider />
      </div>
    ));
  };

  return (
    <Dropdown
      dropdownClassName="top-12 w-80"
      button={
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-200 cursor-pointer p-2 rounded-xl transition duration-300 ease-in-out hover:text-primary hover:bg-gray-300 relative"
        >
          <FaRegBell className="text-xl" />

          {notifications.length > 0 && (
            <span className="absolute top-0 -right-0 bg-primary rounded-full w-2 h-2" />
          )}
        </span>
      }
    >
      <div className="p-2">
        <h4 className="font-semibold">
          Notifications{" "}
          {notifications.length > 0 && `(${notifications.length})`}
        </h4>
        <Divider />
        <ul>
          <Notfications />
        </ul>
      </div>
    </Dropdown>
  );
};
