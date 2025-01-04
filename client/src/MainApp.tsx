import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "./hooks/useUser";
import Login from "./pages/Login";
import OwnerProfile from "./pages/OwnerProfile";
import RenterProfile from "./pages/RenterProfile";
import SignUp from "./pages/Signup";

type Route = {
  link: string;
  component: React.ReactNode;
  roles?: string[];
};

const ROUTES: Route[] = [
  {
    link: "/",
    component: <div>Home</div>,
  },
  {
    link: "/renter-profile",
    component: <RenterProfile />,
    roles: ["renter"],
  },
  {
    link: "/signup",
    component: <SignUp />,
  },
  {
    link: "/login",
    component: <Login />,
  },
  {
    link: "/owner-profile",
    component: <OwnerProfile />,
    roles: ["owner"],
  },
];

const MainApp: React.FC = () => {
  const { user, loading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        {ROUTES.map(({ component, link, roles }) => (
          <Route key={link} path={link} element={component} />
        ))}
      </Routes>
    </>
  );
};

export default MainApp;
