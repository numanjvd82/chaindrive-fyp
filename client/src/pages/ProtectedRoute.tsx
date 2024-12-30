import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser();

  // Redirect to login only if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; // Allow access if user is logged in
};

export default ProtectedRoute;
