import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type RoleProtectedRouteProps = {
  allowedRoles: string[];
  children: JSX.Element;
};

const RoleProtectedRoute = ({
  allowedRoles,
  children,
}: RoleProtectedRouteProps) => {
  const { user } = useUser();

  // Check if the user's role is allowed
  if (!allowedRoles.includes(user?.role || "")) {
    const redirectTo =
      user?.role === "renter" ? "/renter-profile" : "/owner-profile";
    return <Navigate to={redirectTo} replace />;
  }

  return children; // Allow access if the role is valid
};

export default RoleProtectedRoute;
