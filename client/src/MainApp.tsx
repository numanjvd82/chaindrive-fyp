import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
    if (!loading && !user && location.pathname !== "/login") {
      navigate("/login");
    }

    if (!loading && user) {
      const currentRoute = ROUTES.find(
        (route) => route.link === location.pathname
      );
      if (currentRoute?.roles && !currentRoute.roles.includes(user.role)) {
        navigate("/");
      }
    }
  }, [loading, user, navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />

      <Routes>
        {ROUTES.map(({ component, link }) => (
          <Route key={link} path={link} element={component} />
        ))}
      </Routes>
    </>
  );
};

export default MainApp;
