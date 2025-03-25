import logo from "@/assets/images/logo.svg";
import { useUser } from "@/hooks/useUser";
import { axiosInstance } from "@/lib/axios";
import React from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { NotificationDropdown } from "./NotificationDropdown";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return null;

  const imageUrl = `data:image/png;base64,${user.selfie}`;

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      queryClient.setQueryData("user", null); // Clear user data
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex justify-between items-center h-16 p-4 bg-white shadow-md">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Chaindrive Logo" className="h-15 w-15" />
      </div>

      <nav className="hidden sm:flex items-center space-x-6">
        {user.role === "owner" ? (
          <Link to="/listings/create">
            <Button variant="primary">List Vehicle</Button>
          </Link>
        ) : null}
        <Link
          to={user.role === "owner" ? "/owner-dashboard" : "/renter-dashboard"}
          className="font-semibold text-gray-600 hover:text-primary"
        >
          Dashboard
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to="/chat"
            className="bg-gray-200 cursor-pointer p-2 rounded-xl transition duration-300 ease-in-out hover:text-primary hover:bg-gray-300"
          >
            <FaRegCommentDots className="text-xl" />
          </Link>
          <NotificationDropdown />
          <Dropdown
            button={
              <img
                src={imageUrl}
                alt="Profile"
                className="h-12 w-12 rounded-full"
              />
            }
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/listings"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Listings
              </Link>
              <Link
                to="/settings"
                onClick={handleLogout}
                className="block px-4 py-2 bg-primary text-white transition-all hover:brightness-110"
              >
                Logout
              </Link>
            </div>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default Header;
