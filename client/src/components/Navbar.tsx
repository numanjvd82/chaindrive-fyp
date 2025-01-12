import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="ChainDrive Logo" className="h-8" />
        <span className="text-lg font-bold text-dodgerblue-100">
          Chain<span className="text-lg font-bold text-black">Drive</span>
        </span>
      </div>

      {/* Navigation Links (Desktop) */}
      <ul className="hidden md:flex space-x-6">
        <li>
          <a
            href="#become-renter"
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="Become a renter"
          >
            Become a renter
          </a>
        </li>
        <li>
          <a
            href="#rental-deals"
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="Rental deals"
          >
            Rental deals
          </a>
        </li>
        <li>
          <Link className="nav-link active" aria-current="page" to={'/'}>
          How it works </Link>
          {/* <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="How it works"
          > */}
        </li>
        <li>
          <a
            href="#why-choose-us"
            className="text-gray-600 hover:text-blue-600 transition"
            aria-label="Why choose us"
          >
            Why choose us
          </a>
        </li>
      </ul>

      {/* Auth Buttons (Desktop) */}
      <div className="hidden md:flex space-x-4">
        <a
          href="#sign-in"
          className="px-4 py-2 text-gray-600 rounded-md hover:text-blue-600 transition"
          aria-label="Sign in"
        >
          Sign in
        </a>
        <a
          href="#sign-up"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          aria-label="Sign up"
        >
          Sign up
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="block md:hidden text-gray-600 hover:text-blue-600"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-100 shadow-lg md:hidden">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li>
              <a
                href="#become-renter"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Become a renter"
              >
                Become a renter
              </a>
            </li>
            <li>
              <a
                href="#rental-deals"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Rental deals"
              >
                Rental deals
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="How it works"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href="#why-choose-us"
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Why choose us"
              >
                Why choose us
              </a>
            </li>
            <li>
              <a
                href="#sign-in"
                className="px-4 py-2 text-gray-600 rounded-md hover:text-blue-600 transition"
                aria-label="Sign in"
              >
                Sign in
              </a>
            </li>
            <li>
              <a
                href="#sign-up"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                aria-label="Sign up"
              >
                Sign up
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
