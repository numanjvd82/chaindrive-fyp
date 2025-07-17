import Splash from "@/components/Splash";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <Splash />;
  }

  const redirectPath = user
    ? user.role === "owner"
      ? "/owner-dashboard"
      : "/renter-dashboard"
    : "/login";

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to={redirectPath}
        className="mt-6 px-4 py-2 bg-primary text-white rounded hover:brightness-125"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
