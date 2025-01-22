import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="ChainDrive Logo" className="h-8" />
          <span className="ml-2 text-xl font-bold text-blue-600">ChainDrive</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="#become-renter" className="text-gray-600 hover:text-blue-600">
              Become a renter
            </Link>
          </li>
          <li>
            <Link to="#rental-deals" className="text-gray-600 hover:text-blue-600">
              Rental deals
            </Link>
          </li>
          <li>
            <Link to="#how-it-works" className="text-gray-600 hover:text-blue-600">
              How it works
            </Link>
          </li>
          <li>
            <Link to="#why-choose-us" className="text-gray-600 hover:text-blue-600">
              Why choose us
            </Link>
          </li>
        </ul>

        {/* Desktop Authentication Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link to="#sign-in" className="text-gray-600 hover:text-blue-600">
            Sign in
          </Link>
          <Link
            to="#sign-up"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-100 md:hidden shadow-lg">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li>
              <Link to="#become-renter" className="text-gray-600 hover:text-blue-600">
                Become a renter
              </Link>
            </li>
            <li>
              <Link to="#rental-deals" className="text-gray-600 hover:text-blue-600">
                Rental deals
              </Link>
            </li>
            <li>
              <Link to="#how-it-works" className="text-gray-600 hover:text-blue-600">
                How it works
              </Link>
            </li>
            <li>
              <Link to="#why-choose-us" className="text-gray-600 hover:text-blue-600">
                Why choose us
              </Link>
            </li>
            <li>
              <Link to="#sign-in" className="text-gray-600 hover:text-blue-600">
                Sign in
              </Link>
            </li>
            <li>
              <Link
                to="#sign-up"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
