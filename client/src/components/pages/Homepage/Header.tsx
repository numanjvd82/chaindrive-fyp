import logo from "@/assets/images/logo.svg";
import Button from "@/components/Button";

const Header: React.FC = () => {
  return (
    <nav className="flex items-center justify-around px-6 py-4 bg-white shadow-md w-full">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="ChainDrive Logo" className="h-8" />
        <span className="text-lg font-bold text-dodgerblue-100">
          Chain<span className="text-lg font-bold text-black">Drive</span>
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Desktop and tablet menu */}
        <ul className="hidden lg:flex space-x-6 mt-2">
          <li>
            <a
              href="#become-renter"
              className="text-gray-600 hover:text-blue-600 transition"
              aria-label="Become a renter"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#rental-deals"
              className="text-gray-600 hover:text-blue-600 transition"
              aria-label="Rental deals"
            >
              Bookings
            </a>
          </li>
          <li>
            <Button text="Become a host" />
          </li>
        </ul>

        {/* Mobile icons */}
        <ul className="hidden lg:flex space-x-2">
          <li>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="12" fill="#E8EDF2" />
              <g clipPath="url(#clip0_4297_506)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9375 20C20.9375 20.5178 20.5178 20.9375 20 20.9375C19.4822 20.9375 19.0625 20.5178 19.0625 20C19.0625 19.4822 19.4822 19.0625 20 19.0625C20.5178 19.0625 20.9375 19.4822 20.9375 20ZM16.5625 19.0625C16.0447 19.0625 15.625 19.4822 15.625 20C15.625 20.5178 16.0447 20.9375 16.5625 20.9375C17.0803 20.9375 17.5 20.5178 17.5 20C17.5 19.4822 17.0803 19.0625 16.5625 19.0625ZM23.4375 19.0625C22.9197 19.0625 22.5 19.4822 22.5 20C22.5 20.5178 22.9197 20.9375 23.4375 20.9375C23.9553 20.9375 24.375 20.5178 24.375 20C24.375 19.4822 23.9553 19.0625 23.4375 19.0625ZM28.125 20C28.1256 22.8534 26.6294 25.4979 24.1834 26.9671C21.7373 28.4362 18.6998 28.5145 16.1813 27.1734L13.5211 28.0602C13.0719 28.21 12.5766 28.0931 12.2418 27.7582C11.9069 27.4234 11.79 26.9281 11.9398 26.4789L12.8266 23.8188C11.239 20.8339 11.6656 17.1778 13.8979 14.6386C16.1302 12.0995 19.7015 11.2081 22.8651 12.4003C26.0288 13.5925 28.1236 16.6192 28.125 20ZM26.875 20C26.8742 17.1096 25.0656 14.5284 22.3492 13.5408C19.6328 12.5531 16.5887 13.37 14.7317 15.5849C12.8747 17.7998 12.6013 20.9397 14.0477 23.4422C14.1372 23.5972 14.156 23.7833 14.0992 23.9531L13.125 26.875L16.0469 25.9008C16.1105 25.8791 16.1773 25.868 16.2445 25.868C16.3543 25.8682 16.4621 25.8973 16.557 25.9523C18.6843 27.1831 21.3067 27.1848 23.4354 25.9567C25.5642 24.7286 26.8756 22.4576 26.875 20Z"
                  fill="#0D141C"
                />
              </g>
              <defs>
                <clipPath id="clip0_4297_506">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(10 10)"
                  />
                </clipPath>
              </defs>
            </svg>
          </li>
          <li>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="12" fill="#E8EDF2" />
              <g clipPath="url(#clip0_4297_511)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M27.3281 23.7453C26.8945 22.9984 26.25 20.8852 26.25 18.125C26.25 14.6732 23.4518 11.875 20 11.875C16.5482 11.875 13.75 14.6732 13.75 18.125C13.75 20.8859 13.1047 22.9984 12.6711 23.7453C12.4457 24.1318 12.4441 24.6092 12.6668 24.9973C12.8895 25.3853 13.3026 25.6247 13.75 25.625H16.9383C17.2356 27.0796 18.5153 28.1243 20 28.1243C21.4847 28.1243 22.7644 27.0796 23.0617 25.625H26.25C26.6972 25.6244 27.1101 25.3849 27.3326 24.9969C27.5551 24.609 27.5534 24.1317 27.3281 23.7453ZM20 26.875C19.2056 26.8748 18.4976 26.3739 18.2328 25.625H21.7672C21.5024 26.3739 20.7944 26.8748 20 26.875ZM13.75 24.375C14.3516 23.3406 15 20.9438 15 18.125C15 15.3636 17.2386 13.125 20 13.125C22.7614 13.125 25 15.3636 25 18.125C25 20.9414 25.6469 23.3383 26.25 24.375H13.75Z"
                  fill="#0D141C"
                />
              </g>
              <defs>
                <clipPath id="clip0_4297_511">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(10 10)"
                  />
                </clipPath>
              </defs>
            </svg>
          </li>
          <li>
            <img src="/profilelogo.svg" alt="Profile Logo" />
          </li>
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button className="p-2 rounded-md text-gray-600 hover:text-blue-600">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 10h28v4H6zM6 18h28v4H6zM6 26h28v4H6z"
              fill="#0D141C"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Header;
