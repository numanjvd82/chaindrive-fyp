import Splash from "@/components/Splash";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotAuthorized: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <Splash />;
  }

  if (!user) {
    navigate("/login");
  }

  const redirectPath =
    user?.role === "owner" ? "/owner-dashboard" : "/renter-dashboard";

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-gray-800">403 - Not Authorized</h1>
      <p className="mt-4 text-lg text-gray-600">
        You do not have permission to access this page.
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

export default NotAuthorized;
