import logo from "@/assets/images/logo.svg";
import { useUser } from "@/hooks/useUser";
import { axiosInstance } from "@/lib/axios";
import { motion } from "motion/react";
import React, { useState } from "react";
import { FaBars, FaRegCommentDots, FaTimes } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { NotificationDropdown } from "./NotificationDropdown";

const Header: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const imageUrl = `data:image/png;base64,${user.selfie}`;

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout", {});
      queryClient.setQueryData("user", null); // Clear user data
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex justify-between items-center h-16 p-4 bg-white shadow-md">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Chaindrive Logo" className="h-15 w-15" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          to={user.role === "owner" ? "/owner-dashboard" : "/renter-dashboard"}
          className="font-semibold text-gray-600 hover:text-primary"
        >
          Dashboard
        </Link>

        <Link
          to="/rentals"
          className="font-semibold text-gray-600 hover:text-primary"
        >
          Rentals
        </Link>

        {user.role === "owner" ? (
          <>
            <Link to="/listings/create">
              <Button variant="primary">List Vehicle</Button>
            </Link>

            <Link
              to="/devices"
              className="font-semibold text-gray-600 hover:text-primary"
            >
              Devices
            </Link>
          </>
        ) : (
          <Link to="/become-host">
            <Button variant="primary">Become a host</Button>
          </Link>
        )}

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
              {user.role === "owner" ? (
                <Link
                  to="/listings"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Listings
                </Link>
              ) : null}
              <div
                onClick={handleLogout}
                className="block px-4 py-2 bg-primary text-white transition-all hover:brightness-110"
              >
                Logout
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-600 hover:text-primary focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FaTimes className="text-2xl transition-transform transform hover:scale-110" />
        ) : (
          <FaBars className="text-2xl transition-transform transform hover:scale-110" />
        )}
      </button>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-50 md:hidden"
      >
        <div className="flex flex-col items-end space-y-6 p-6">
          <div className="flex items-center space-x-4 mt-4">
            <Link
              to="/chat"
              className="bg-gray-200 cursor-pointer p-2 rounded-xl transition duration-300 ease-in-out hover:text-primary hover:bg-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaRegCommentDots className="text-xl" />
            </Link>
            <NotificationDropdown />
            <img
              src={imageUrl}
              alt="Profile"
              className="h-12 w-12 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <button
              className="self-end text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes className="text-2xl transition-transform transform hover:scale-110" />
            </button>
          </div>

          <Link
            to={
              user.role === "owner" ? "/owner-dashboard" : "/renter-dashboard"
            }
            className="font-semibold text-gray-600 hover:text-primary transition-transform transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/rentals"
            className="font-semibold text-gray-600 hover:text-primary transition-transform transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Rentals
          </Link>
          {user.role === "owner" ? (
            <Link
              to="/listings/create"
              className="font-semibold text-gray-600 hover:text-primary transition-transform transform hover:scale-105"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              List Vehicle
            </Link>
          ) : (
            <Link
              to="/become-host"
              className="font-semibold text-gray-600 hover:text-primary transition-transform transform hover:scale-105"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a host
            </Link>
          )}
          <Link
            to="/profile"
            className="font-semibold text-gray-600 hover:text-primary transition-transform transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>

          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
